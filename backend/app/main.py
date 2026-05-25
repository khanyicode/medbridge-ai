import os
import asyncio
import traceback
from fastapi import FastAPI, APIRouter, Request
from telegram import Bot, Update
from app.ai_service import analyze_symptoms

app = FastAPI()
router = APIRouter()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
bot = Bot(token=BOT_TOKEN)

async def process_ai(chat_id: int, text: str):
    try:
        # Offload blocking synchronous Gemini SDK call to an executor thread
        loop = asyncio.get_running_loop()
        result = await loop.run_in_executor(None, analyze_symptoms, text)

        async with bot:
            await bot.send_message(
                chat_id=chat_id,
                text=f"🩺 MedBridge AI Assessment\n\n{result}\n\n⚠️ This is not a medical diagnosis."
            )

    except Exception as e:
        # This logs the complete stack trace directly into your Render console logs
        print("🚨 --- CRITICAL BACKEND ERROR --- 🚨")
        traceback.print_exc()
        print("🚨 ------------------------------ 🚨")
        
        try:
            async with bot:
                await bot.send_message(
                    chat_id=chat_id,
                    text="⚠️ AI error occurred. Please try again later."
                )
        except Exception as telegram_err:
            print(f"Failed to deliver fallback error to Telegram: {telegram_err}")

@router.post("/telegram/webhook")
async def webhook(request: Request):
    try:
        data = await request.json()
        
        async with bot:
            update = Update.de_json(data, bot)

        if update.message and update.message.text:
            chat_id = update.effective_chat.id
            text = update.message.text

            # Execute background worker task safely
            asyncio.create_task(process_ai(chat_id, text))
            
    except Exception as e:
        print(f"Webhook processing failure: {e}")
        
    return {"ok": True}

@app.get("/")
def home():
    return {"status": "main works"}

app.include_router(router)