from pathlib import Path
from dotenv import load_dotenv
import os

env_file = Path.home() / ".medbridge" / "keys.env"

if not env_file.exists():
    raise FileNotFoundError(
        f"Secrets file not found: {env_file}"
    )

load_dotenv(env_file)

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

if not TELEGRAM_BOT_TOKEN:
    raise ValueError("TELEGRAM_BOT_TOKEN missing")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY missing")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL missing")