import os
import sys
import subprocess
import time
import json
import urllib.request
import urllib.parse  # Used for safe URL encoding
from pathlib import Path

# =========================
# RUN COMMAND HELPER
# =========================
def run_command(command, cwd=None):
    return subprocess.Popen(command, shell=True, cwd=cwd, env=os.environ.copy())


# =========================
# CHECK PROJECT ROOT
# =========================
if not os.path.exists("backend") or not os.path.exists("frontend"):
    print("Run this from: medbridge-ai ROOT folder")
    sys.exit(1)


# =========================
# INSTALL BACKEND DEPENDENCIES
# =========================
print("📦 Installing backend dependencies...")
subprocess.run(f"{sys.executable} -m pip install -r backend/requirements.txt", shell=True)


# =========================
# LOAD KEYS FROM HOME FOLDER
# Works on Windows + Linux
# =========================
home_dir = Path.home()
env_path = home_dir / ".medbridge" / "keys.env"

if not env_path.exists():
    print(f" Keys file not found: {env_path}")
    sys.exit(1)

env_vars = {}

with open(env_path, "r", encoding="utf-8") as f:
    for line in f:
        line = line.strip()

        if not line or line.startswith("#"):
            continue

        if "=" in line:
            key, value = line.split("=", 1)
            # Cleans up whitespace, hidden carriage returns (\r), and quotes
            cleaned_value = value.strip().replace("\r", "").replace("\n", "").strip("'\"")
            env_vars[key.strip()] = cleaned_value

bot_token = env_vars.get("TELEGRAM_BOT_TOKEN")
gemini_api_key = env_vars.get("GEMINI_API_KEY")
database_url = env_vars.get("DATABASE_URL")

if not bot_token:
    print("TELEGRAM_BOT_TOKEN missing in keys.env")
    sys.exit(1)

if not gemini_api_key:
    print(" GEMINI_API_KEY missing in keys.env")
    sys.exit(1)

if not database_url:
    print(" DATABASE_URL missing in keys.env")
    sys.exit(1)

print(f" Loaded keys from: {env_path}")

# CRITICAL FIX: Force-inject the keys into the system environment memory
# This ensures backend processes can read them natively via os.getenv()
os.environ["TELEGRAM_BOT_TOKEN"] = bot_token
os.environ["GEMINI_API_KEY"] = gemini_api_key
os.environ["DATABASE_URL"] = database_url


# =========================
# START BACKEND
# =========================
print("\n🚀 Starting backend...")

backend_proc = run_command(
    f"{sys.executable} -m uvicorn app.main:app --reload --port 8000",
    cwd="backend"
)

time.sleep(5)


# =========================
# START FRONTEND
# =========================
print("\n⚛️ Starting frontend...")

frontend_proc = run_command(
    "npm run dev",
    cwd="frontend"
)

time.sleep(8)


# =========================
# CLOUDFLARE TUNNEL (BACKEND)
# =========================
print("\n🌐 Starting tunnel...")

tunnel_log = "tunnel.log"

if os.path.exists(tunnel_log):
    os.remove(tunnel_log)

cf_proc = subprocess.Popen(
    "cloudflared tunnel --url http://localhost:8000 > tunnel.log 2>&1",
    shell=True,
    env=os.environ.copy() # Keeps environment clean for cloudflared too
)

time.sleep(8)


# =========================
# GET PUBLIC URL
# =========================
public_url = ""

if os.path.exists("tunnel.log"):
    with open("tunnel.log", "r", errors="ignore") as f:
        for line in f:
            if "trycloudflare.com" in line:
                parts = line.split()
                for p in parts:
                    if "https://" in p:
                        public_url = p.strip()
                        break

if not public_url:
    print(" Tunnel failed")
    sys.exit(1)

print(f"\n🌍 Public URL: {public_url}")


# =========================
# TELEGRAM WEBHOOK
# =========================
print("\n📲 Setting webhook...")

webhook_url = f"{public_url}/telegram/webhook"

# Properly encoding the webhook string to ensure special characters like '/' don't break the query
encoded_webhook = urllib.parse.quote_plus(webhook_url)

# Constructing safe URL
telegram_api_url = f"https://api.telegram.org/bot{bot_token}/setWebhook?url={encoded_webhook}"

try:
    resp = urllib.request.urlopen(telegram_api_url)
    print(json.dumps(json.loads(resp.read()), indent=2))
except urllib.error.HTTPError as e:
    print(f"❌ Failed to set webhook. HTTP Error: {e.code} {e.reason}")
    print(f"Attempted URL: https://api.telegram.org/bot[HIDDEN_TOKEN]/setWebhook?url={encoded_webhook}")
    sys.exit(1)


# =========================
# KEEP ALIVE
# =========================
print("\n🔥 ALL SYSTEMS LIVE")
print("Backend + Frontend + Telegram Bot running")

try:
    while True:
        time.sleep(1)

except KeyboardInterrupt:
    print("\n🛑 Shutting down...")

finally:
    backend_proc.terminate()
    frontend_proc.terminate()
    cf_proc.terminate()

    if os.path.exists("tunnel.log"):
        os.remove("tunnel.log")

    print("✅ Clean exit")