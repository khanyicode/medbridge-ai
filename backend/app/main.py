import os
import asyncio
import traceback

from fastapi import FastAPI, APIRouter, Request
from telegram import Bot, Update

from app.ai_service import analyze_symptoms

# NEW: database imports
from app.database import SessionLocal
from app.models import User, Conversation

app = FastAPI()
router = APIRouter()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
bot = Bot(token=BOT_TOKEN)


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
        # 2. RUN AI (OFFLOADED THREAD)
        # =========================
        loop = asyncio.get_running_loop()

        result = await loop.run_in_executor(
            None,
            analyze_symptoms,
            text
        )

        # =========================
        # 3. SAVE CONVERSATION
        # =========================
        conversation = Conversation(
            user_id=user.id,
            user_message=text,
            ai_response=result,
            urgency_level="UNKNOWN"
        )

        db.add(conversation)
        db.commit()

        # =========================
        # 4. SEND TELEGRAM RESPONSE
        # =========================
        async with bot:
            await bot.send_message(
                chat_id=chat_id,
                text=(
                    f"🩺 MedBridge AI Assessment\n\n"
                    f"{result}\n\n"
                    f"⚠️ This is not a medical diagnosis."
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

            # run async background task
            asyncio.create_task(
                process_ai(chat_id, text, username)
            )

    except Exception as e:
        print(f"Webhook processing failure: {e}")

    return {"ok": True}


# =========================
# HEALTH CHECK ROUTE
# =========================
@app.get("/")
def home():
    return {"status": "MedBridge AI running"}


app.include_router(router)