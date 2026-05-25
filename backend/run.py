import os
import sys
import subprocess
import time
import json
import urllib.request
import zipfile
import tarfile

def run_command(command, background=False):
    """Executes a system command cleanly across Windows, Mac, and Linux."""
    if background:
        if os.name == 'nt': # Windows
            return subprocess.Popen(command, shell=True)
        else: # Mac/Linux
            return subprocess.Popen(command, shell=True, preexec_fn=os.setpgrp)
    else:
        return subprocess.run(command, shell=True)

print("📦 1. Installing Python dependencies...")
run_command(f"{sys.executable} -m pip install -r requirements.txt")

# Check if .env file exists
if not os.path.exists(".env"):
    print("\n❌ Error: Please create a .env file with your TELEGRAM_BOT_TOKEN and GEMINI_API_KEY first!")
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
    print("❌ Error: TELEGRAM_BOT_TOKEN missing from .env file!")
    sys.exit(1)

print("🌐 2. Setting up Cloudflare Tunnel binary...")

# Determine OS and local binary name
is_windows = os.name == 'nt'
binary_name = "cloudflared.exe" if is_windows else "./cloudflared"

# Download the official Cloudflare binary if it doesn't exist yet
if not os.path.exists(binary_name.replace("./", "")):
    print("   📥 Downloading official cloudflared binary directly from Cloudflare GitHub...")
    try:
        if is_windows:
            url = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
            urllib.request.urlretrieve(url, "cloudflared.exe")
        else:
            # Mac / Linux handling
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
            
            # Make binary executable on Unix systems
            os.chmod("cloudflared", 0o755)
        print("   ✅ Download complete!")
    except Exception as e:
        print(f"   ❌ Failed to download Cloudflare binary natively: {e}")
        sys.exit(1)

print("🌐 3. Exposing local port 8000 via Cloudflare Quick Tunnel...")

if os.path.exists("tunnel.log"):
    try: os.remove("tunnel.log")
    except: pass

# Launch the downloaded binary directly, skipping npm entirely
cf_cmd = f"{binary_name} tunnel --url http://localhost:8000 > tunnel.log 2>&1"
cf_proc = run_command(cf_cmd, background=True)

# Give Cloudflare 7 seconds to establish connection handshake and output the domain
time.sleep(7)

public_url = ""
if os.path.exists("tunnel.log"):
    with open("tunnel.log", "r", encoding="utf-8", errors="ignore") as f:
        log_lines = f.readlines()
        for line in log_lines:
            if "trycloudflare.com" in line:
                parts = line.strip().split()
                for part in parts:
                    if "https://" in part and "trycloudflare.com" in part:
                        public_url = part.strip()
                        break
                if public_url:
                    break

if not public_url:
    print("❌ Could not extract a valid live Cloudflare domain from logs.")
    print("💡 Here is what Cloudflare printed inside 'tunnel.log':\n")
    if os.path.exists("tunnel.log"):
        with open("tunnel.log", "r", encoding="utf-8", errors="ignore") as f:
            print(f.read())
    cf_proc.terminate()
    sys.exit(1)

print(f"🔗 Public Domain Linked: {public_url}")

print("🤖 4. Informing Telegram where to route messages...")
try:
    webhook_url = f"https://api.telegram.org/bot{bot_token}/setWebhook?url={public_url}/telegram/webhook"
    with urllib.request.urlopen(webhook_url) as response:
        res = json.loads(response.read().decode())
        if res.get("ok"):
            print("   ✅ Webhook updated successfully!")
        else:
            print(f"   ❌ Telegram rejection: {res.get('description')}")
except Exception as e:
    print(f"   ❌ Webhook assignment error: {e}")

print("\n🚀 5. Initializing local FastAPI instance...")
print("💡 (Press CTRL+C or close this window to safely terminate the tunnel environment)\n")

try:
    # Run uvicorn server in the foreground
    run_command(f"{sys.executable} -m uvicorn app.main:app --host 127.0.0.1 --port 8000")
finally:
    print("\n🛑 Cleaning up local system routing and shutting down...")
    cf_proc.terminate()
    if os.path.exists("tunnel.log"):
        try: os.remove("tunnel.log")
        except: pass