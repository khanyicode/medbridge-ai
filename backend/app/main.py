import os
import asyncio
import traceback
import json
import re

from fastapi import FastAPI, APIRouter, Request
from telegram import Bot, Update

from app.ai_service import analyze_symptoms

from app.database import SessionLocal
from app.models import User, Conversation

app = FastAPI()
router = APIRouter()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
bot = Bot(token=BOT_TOKEN)


# =========================
# HELPERS
# =========================
def extract_json_from_response(text: str):
    """
    Extracts the JSON block from Gemini response safely.
    """

    try:
        # Find last JSON block in response
        json_match = re.search(r"\{[\s\S]*\}$", text.strip())

        if json_match:
            return json.loads(json_match.group())

    except Exception:
        pass

    return {
        "urgency_level": "UNKNOWN",
        "possible_condition": "",
        "recommendation": "",
        "red_flags": []
    }


def extract_user_message(text: str):
    """
    Removes JSON block so only conversational text is sent to Telegram.
    """
    return re.sub(r"\{[\s\S]*\}$", "", text).strip()


# =========================
# AI PROCESSING + DATABASE
# =========================
async def process_ai(chat_id: int, text: str, username: str = None):

    db = SessionLocal()

    try:
        # =========================
        # 1. GET OR CREATE USER
        # =========================
        user = db.query(User).filter(
            User.telegram_id == str(chat_id)
        ).first()

        if not user:
            user = User(
                telegram_id=str(chat_id),
                full_name=username or "User",
                language="en"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # =========================
        # 2. RUN AI
        # =========================
        loop = asyncio.get_running_loop()

        raw_result = await loop.run_in_executor(
            None,
            analyze_symptoms,
            text
        )

        # =========================
        # 3. PARSE AI RESPONSE
        # =========================
        structured_data = extract_json_from_response(raw_result)
        clean_reply = extract_user_message(raw_result)

        # =========================
        # 4. SAVE CONVERSATION
        # =========================
        conversation = Conversation(
            user_id=user.id,
            user_message=text,
            ai_response=clean_reply,
            urgency_level=structured_data.get("urgency_level", "UNKNOWN")
        )

        db.add(conversation)
        db.commit()

        # =========================
        # 5. SEND TELEGRAM RESPONSE
        # =========================
        async with bot:
            await bot.send_message(
                chat_id=chat_id,
                text=(
                    f"{clean_reply}\n\n"
                    f"⚠️ Urgency: {structured_data.get('urgency_level', 'UNKNOWN')}"
                )
            )

    except Exception as e:
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
            print(f"Telegram fallback failed: {telegram_err}")

    finally:
        db.close()


# =========================
# TELEGRAM WEBHOOK
# =========================
@router.post("/telegram/webhook")
async def webhook(request: Request):

    try:
        data = await request.json()

        update = Update.de_json(data, bot)

        if update.message and update.message.text:

            chat_id = update.effective_chat.id
            text = update.message.text

            username = (
                update.effective_user.first_name
                if update.effective_user
                else "User"
            )

            asyncio.create_task(
                process_ai(chat_id, text, username)
            )

    except Exception as e:
        print(f"Webhook processing failure: {e}")

    return {"ok": True}


# =========================
# HEALTH CHECK
# =========================
@app.get("/")
def home():
    return {"status": "MedBridge AI running"}


app.include_router(router)