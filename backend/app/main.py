import os
import asyncio
from fastapi import FastAPI, APIRouter, Request
from telegram import Bot, Update
from app.ai_service import analyze_symptoms  # Assumes ai_service.py is in an 'app' folder

# Initialize FastAPI app
app = FastAPI()
router = APIRouter()

# Initialize Telegram Bot
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
bot = Bot(token=BOT_TOKEN)

async def process_ai(chat_id: int, text: str):
    try:
        # Run the synchronous Gemini call in an executor so it doesn't block the async loop
        loop = asyncio.get_running_loop()
        result = await loop.run_in_executor(None, analyze_symptoms, text)

        # Initialize the bot session context if needed and send message
        async with bot:
            await bot.send_message(
                chat_id=chat_id,
                text=f"🩺 MedBridge AI Assessment\n\n{result}\n\n⚠️ This is not a medical diagnosis."
            )

    except Exception as e:
        print(f"Error in process_ai: {e}")  # For server logs
        try:
            async with bot:
                await bot.send_message(
                    chat_id=chat_id,
                    text="⚠️ AI error occurred. Please try again later."
                )
        except Exception as telegram_err:
            print(f"Failed to send error message to Telegram: {telegram_err}")

@router.post("/telegram/webhook")
async def webhook(request: Request):
    try:
        data = await request.json()
        
        # Initialize bot context before parsing the update data
        async with bot:
            update = Update.de_json(data, bot)

        if update.message and update.message.text:
            chat_id = update.effective_chat.id
            text = update.message.text

            # Fire-and-forget the AI logic so Telegram gets a 200 OK immediately
            asyncio.create_task(process_ai(chat_id, text))
            
    except Exception as e:
        print(f"Webhook processing error: {e}")
        
    return {"ok": True}

# --- Root Endpoint ---
@app.get("/")
def home():
    return {"status": "main works"}

# --- CRITICAL: Include the router into the main app ---
app.include_router(router)