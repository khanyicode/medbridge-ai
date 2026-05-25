from fastapi import APIRouter, Request
from telegram import Bot, Update
import os
import asyncio
from app.ai_service import analyze_symptoms

router = APIRouter()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
bot = Bot(token=BOT_TOKEN)


async def process_ai(chat_id: int, text: str):
    try:
        result = analyze_symptoms(text)

        await bot.send_message(
            chat_id=chat_id,
            text=f"""🩺 MedBridge AI Assessment

{result}

⚠️ This is not a medical diagnosis."""
        )

    except Exception as e:
        await bot.send_message(
            chat_id=chat_id,
            text="⚠️ AI error occurred. Please try again."
        )


@router.post("/telegram/webhook")
async def webhook(request: Request):

    data = await request.json()
    update = Update.de_json(data, None)

    if update.message:

        chat_id = update.effective_chat.id
        text = update.message.text

        # IMPORTANT: DO NOT block Telegram
        asyncio.create_task(process_ai(chat_id, text))

    return {"ok": True}