import os
import sys
import subprocess
import time
import json
import urllib.request
import tarfile

def run_command(command, background=False):
    """Run system commands cross-platform."""
    if background:
        if os.name == 'nt':
            return subprocess.Popen(command, shell=True)
        else:
            return subprocess.Popen(command, shell=True, preexec_fn=os.setpgrp)
    else:
        return subprocess.run(command, shell=True)

print("📦 1. Installing Python dependencies...")
run_command(f"{sys.executable} -m pip install -r requirements.txt")

# =========================
# LOAD ENV VARIABLES
# =========================

if not os.path.exists(".env"):
    print("\n Error: .env file not found!")
    sys.exit(1)

env_vars = {}

with open(".env", "r") as f:
    for line in f:
        if line.strip() and not line.startswith("#"):
            key, val = line.strip().split("=", 1)
            env_vars[key.strip()] = val.strip()

bot_token = env_vars.get("TELEGRAM_BOT_TOKEN")

if not bot_token:
    print(" TELEGRAM_BOT_TOKEN missing in .env")
    sys.exit(1)

print("✅ Environment variables loaded.")

# =========================
# DOWNLOAD CLOUDFLARED
# =========================

print("\n🌐 2. Setting up Cloudflare Tunnel binary...")

is_windows = os.name == "nt"
binary_name = "cloudflared.exe" if is_windows else "./cloudflared"

if not os.path.exists(binary_name.replace("./", "")):
    print(" Downloading cloudflared...")

    try:
        if is_windows:
            url = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"

            urllib.request.urlretrieve(url, "cloudflared.exe")

        else:
            import platform

            system = platform.system().lower()

            if system == "darwin":
                url = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-amd64.tgz"

                urllib.request.urlretrieve(url, "cloudflared.tgz")

                with tarfile.open("cloudflared.tgz", "r:gz") as tar:
                    tar.extractall()

                os.remove("cloudflared.tgz")

            else:
                url = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64"

                urllib.request.urlretrieve(url, "cloudflared")

            os.chmod("cloudflared", 0o755)

        print("✅ Cloudflared installed.")

    except Exception as e:
        print(f" Failed to download cloudflared: {e}")
        sys.exit(1)

# =========================
# START FASTAPI SERVER
# =========================

print("\n🚀 3. Starting FastAPI server...")

api_proc = run_command(
    f"{sys.executable} -m uvicorn app.main:app --host 127.0.0.1 --port 8000",
    background=True
)

# Give FastAPI time to start
time.sleep(5)

# =========================
# START CLOUDFLARE TUNNEL
# =========================

print("\n🌐 4. Starting Cloudflare Tunnel...")

if os.path.exists("tunnel.log"):
    try:
        os.remove("tunnel.log")
    except:
        pass

cf_cmd = f"{binary_name} tunnel --url http://localhost:8000 > tunnel.log 2>&1"

cf_proc = run_command(cf_cmd, background=True)

# Wait for tunnel
time.sleep(8)

# =========================
# EXTRACT PUBLIC URL
# =========================

public_url = ""

if os.path.exists("tunnel.log"):

    with open("tunnel.log", "r", encoding="utf-8", errors="ignore") as f:

        for line in f.readlines():

            if "trycloudflare.com" in line:

                parts = line.strip().split()

                for part in parts:

                    if "https://" in part and "trycloudflare.com" in part:
                        public_url = part.strip()
                        break

                if public_url:
                    break

if not public_url:
    print("\n Could not get Cloudflare public URL.\n")

    if os.path.exists("tunnel.log"):
        with open("tunnel.log", "r", encoding="utf-8", errors="ignore") as f:
            print(f.read())

    cf_proc.terminate()
    api_proc.terminate()

    sys.exit(1)

print(f"\n Public URL: {public_url}")

# =========================
# SET TELEGRAM WEBHOOK
# =========================

print("\n 5. Setting Telegram webhook...")

try:
    webhook_url = f"{public_url}/telegram/webhook"

    telegram_api = (
        f"https://api.telegram.org/bot{bot_token}/setWebhook"
        f"?url={webhook_url}"
    )

    with urllib.request.urlopen(telegram_api) as response:

        result = json.loads(response.read().decode())

        print(json.dumps(result, indent=2))

        if result.get("ok"):
            print("\n Telegram webhook connected successfully!")
        else:
            print(f"\n Telegram error: {result.get('description')}")

except Exception as e:
    print(f"\n Failed to set webhook: {e}")

# =========================
# KEEP SERVER RUNNING
# =========================

print("\n✅ MedBridge AI Bot is LIVE!")
print("💡 Press CTRL+C to stop everything.\n")

try:
    while True:
        time.sleep(1)

except KeyboardInterrupt:
    print("\n Shutting down services...")

finally:
    try:
        cf_proc.terminate()
    except:
        pass

    try:
        api_proc.terminate()
    except:
        pass

    if os.path.exists("tunnel.log"):
        try:
            os.remove("tunnel.log")
        except:
            pass

    print("✅ Cleanup complete.")