from fastapi import APIRouter, Request
from telegram import Update
from telegram.ext import Application
from dotenv import load_dotenv
from app.ai_service import analyze_symptoms
import os

load_dotenv()

router = APIRouter()

# Load token safely
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

if not BOT_TOKEN:
    raise Exception("❌ TELEGRAM_BOT_TOKEN is missing in environment variables")


# Create bot ONLY when needed (prevents startup crash)
def get_bot():
    return Application.builder().token(BOT_TOKEN).build()


@router.post("/telegram/webhook")
async def telegram_webhook(request: Request):

    try:
        data = await request.json()
        update = Update.de_json(data, None)

        if update.message:

            user_text = update.message.text

            bot = get_bot()

            # 1. FAST RESPONSE (prevents Telegram timeout)
            await bot.bot.send_message(
                chat_id=update.effective_chat.id,
                text="🧠 Processing your symptoms... please wait"
            )

            try:
                # 2. AI PROCESSING
                ai_result = analyze_symptoms(user_text)

                reply = f"""
🩺 MedBridge AI Assessment

{ai_result}

⚠️ This is not a medical diagnosis.
"""

            except Exception as e:
                print("🔥 AI ERROR:", str(e))
                reply = f"AI error: {str(e)}"

            # 3. FINAL RESPONSE
            await bot.bot.send_message(
                chat_id=update.effective_chat.id,
                text=reply
            )

        return {"ok": True}

    except Exception as e:
        print("🔥 WEBHOOK ERROR:", str(e))
        return {"ok": False, "error": str(e)}