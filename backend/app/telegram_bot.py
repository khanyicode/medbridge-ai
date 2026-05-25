from fastapi import APIRouter, Request
from telegram import Bot, Update
from dotenv import load_dotenv
from app.ai_service import analyze_symptoms
import os
import asyncio

load_dotenv()

router = APIRouter()

# Load bot token safely
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

if not BOT_TOKEN:
    raise Exception("❌ Missing TELEGRAM_BOT_TOKEN in environment variables")

# Create bot once (safe for Render)
bot = Bot(token=BOT_TOKEN)


# -----------------------------
# Background AI processing
# -----------------------------
async def process_ai(chat_id: int, user_text: str):
    try:
        # Run AI
        result = analyze_symptoms(user_text)

        reply = f"""
🩺 MedBridge AI Assessment

{result}

⚠️ This is not a medical diagnosis.
"""

        await bot.send_message(chat_id=chat_id, text=reply)

    except Exception as e:
        print("🔥 AI ERROR:", e)
        await bot.send_message(
            chat_id=chat_id,
            text="⚠️ AI error occurred. Please try again."
        )


# -----------------------------
# Telegram Webhook
# -----------------------------
@router.post("/telegram/webhook")
async def telegram_webhook(request: Request):

    try:
        data = await request.json()
        update = Update.de_json(data, None)

        if update.message:

            chat_id = update.effective_chat.id
            user_text = update.message.text

            # ⚡ 1. Immediate response (IMPORTANT for Telegram timeout)
            await bot.send_message(
                chat_id=chat_id,
                text="🧠 Processing your symptoms..."
            )

            # ⚡ 2. Run AI in background (prevents timeout)
            asyncio.create_task(process_ai(chat_id, user_text))

        return {"ok": True}

    except Exception as e:
        print("🔥 WEBHOOK ERROR:", e)
        return {"ok": False, "error": str(e)}