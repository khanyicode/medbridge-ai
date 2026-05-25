from fastapi import APIRouter, Request
from telegram import Update
from telegram.ext import Application
from dotenv import load_dotenv
from app.ai_service import analyze_symptoms
import os

load_dotenv()

router = APIRouter()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

app_bot = Application.builder().token(BOT_TOKEN).build()


@router.post("/telegram/webhook")
async def webhook(request: Request):

    data = await request.json()

    update = Update.de_json(data, app_bot.bot)

    if update.message:

        user_text = update.message.text

        try:

            ai_result = analyze_symptoms(user_text)

            reply = f"""
🩺 MedBridge AI Assessment

{ai_result}

⚠️ This is not a medical diagnosis.
"""

        except Exception as e:

            print("🔥 ERROR:", str(e))

            reply = f"AI error: {str(e)}"

        await app_bot.bot.send_message(
            chat_id=update.effective_chat.id,
            text=reply
        )

    return {"ok": True}