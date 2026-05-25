import os
import sys
import subprocess
import time
import json

def run_command(command, background=False):
    """Runs a system command safely across Windows, Mac, and Linux."""
    if background:
        # Open in background without blocking the script
        if os.name == 'nt': # Windows
            return subprocess.Popen(command, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        else: # Mac/Linux
            return subprocess.Popen(command, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, preexec_fn=os.setpgrp)
    else:
        # Run and wait for completion
        return subprocess.run(command, shell=True)

print(" 1. Installing Python dependencies...")
run_command(f"{sys.executable} -m pip install -r requirements.txt")

# Check if .env file exists
if not os.path.exists(".env"):
    print("\n Error: Please create a .env file with your TELEGRAM_BOT_TOKEN and GEMINI_API_KEY first!")
    sys.exit(1)

# Read variables manually from .env
env_vars = {}
with open(".env", "r") as f:
    for line in f:
        if line.strip() and not line.startswith("#"):
            key, val = line.strip().split("=", 1)
            env_vars[key.strip()] = val.strip()

bot_token = env_vars.get("TELEGRAM_BOT_TOKEN")
if not bot_token:
    print(" Error: TELEGRAM_BOT_TOKEN missing from .env file!")
    sys.exit(1)

print("🌐 2. Creating a public secure URL via localtunnel...")
# Clear old logs if they exist
if os.path.exists("lt.log"):
    os.remove("lt.log")

# Start localtunnel in the background
lt_proc = run_command("npx localtunnel --port 8000 > lt.log 2>&1", background=True)

# Give localtunnel 4 seconds to negotiate an assignment URL
time.sleep(4)

public_url = ""
if os.path.exists("lt.log"):
    with open("lt.log", "r") as f:
        log_content = f.read()
        # Find the line containing the URL
        for line in log_content.split("\n"):
            if "https://" in line:
                public_url = line.strip().split()[-1]
                break

if not public_url:
    print(" localtunnel failed to start. Please make sure Node.js (npm) is installed globally!")
    lt_proc.terminate()
    sys.exit(1)

print(f"🔗 Public URL generated: {public_url}")

print(" 3. Linking your Telegram Bot to this local machine...")
# Use Python's built-in urllib to make the webhook request instead of curl/powershell
import urllib.request
try:
    webhook_url = f"https://api.telegram.org/bot{bot_token}/setWebhook?url={public_url}/telegram/webhook"
    with urllib.request.urlopen(webhook_url) as response:
        res = json.loads(response.read().decode())
        if res.get("ok"):
            print(" Telegram Webhook linked successfully!")
except Exception as e:
    print(f"⚠️ Warning: Could not auto-set webhook via script: {e}")

print("\n 4. Starting FastAPI server. Send a message to your Telegram bot now!")
print(" (Press CTRL+C or close this window to stop the server)\n")

try:
    # Run uvicorn server in foreground
    run_command(f"{sys.executable} -m uvicorn app.main:app --host 0.0.0.0 --port 8000")
finally:
    # Cleanup background tunnel processes when exiting
    print("\n Stopping tunnel and cleaning up...")
    lt_proc.terminate()
    if os.path.exists("lt.log"):
        os.remove("lt.log")