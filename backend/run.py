# import os
# import sys
# import subprocess
# import time
# import json
# import urllib.request

# # =========================
# # RUN COMMAND HELPER
# # =========================
# def run_command(command, cwd=None):
#     return subprocess.Popen(command, shell=True, cwd=cwd)


# # =========================
# # CHECK PROJECT ROOT
# # =========================
# if not os.path.exists("backend") or not os.path.exists("frontend"):
#     print("❌ Run this from: medbridge-ai ROOT folder")
#     sys.exit(1)


# # =========================
# # INSTALL BACKEND DEPENDENCIES
# # =========================
# print("📦 Installing backend dependencies...")
# subprocess.run(f"{sys.executable} -m pip install -r backend/requirements.txt", shell=True)


# # =========================
# # LOAD ENV
# # =========================
# env_path = "backend/.env"

# if not os.path.exists(env_path):
#     print("❌ backend/.env not found")
#     sys.exit(1)

# env_vars = {}

# with open(env_path, "r") as f:
#     for line in f:
#         if "=" in line and not line.startswith("#"):
#             k, v = line.strip().split("=", 1)
#             env_vars[k] = v

# bot_token = env_vars.get("TELEGRAM_BOT_TOKEN")

# if not bot_token:
#     print("❌ Missing TELEGRAM_BOT_TOKEN")
#     sys.exit(1)

# print("✅ Environment loaded")


# # =========================
# # START BACKEND
# # =========================
# print("\n🚀 Starting backend...")

# backend_proc = run_command(
#     f"{sys.executable} -m uvicorn app.main:app --reload --port 8000",
#     cwd="backend"
# )

# time.sleep(5)


# # =========================
# # START FRONTEND
# # =========================
# print("\n⚛️ Starting frontend...")

# frontend_proc = run_command(
#     "npm run dev",
#     cwd="frontend"
# )

# time.sleep(8)


# # =========================
# # CLOUDFLARE TUNNEL (BACKEND)
# # =========================
# print("\n🌐 Starting tunnel...")

# tunnel_log = "tunnel.log"

# if os.path.exists(tunnel_log):
#     os.remove(tunnel_log)

# cf_proc = subprocess.Popen(
#     "cloudflared tunnel --url http://localhost:8000 > tunnel.log 2>&1",
#     shell=True
# )

# time.sleep(8)


# # =========================
# # GET PUBLIC URL
# # =========================
# public_url = ""

# if os.path.exists("tunnel.log"):
#     with open("tunnel.log", "r", errors="ignore") as f:
#         for line in f:
#             if "trycloudflare.com" in line:
#                 parts = line.split()
#                 for p in parts:
#                     if "https://" in p:
#                         public_url = p.strip()
#                         break

# if not public_url:
#     print("❌ Tunnel failed")
#     sys.exit(1)

# print(f"\n🌍 Public URL: {public_url}")


# # =========================
# # TELEGRAM WEBHOOK
# # =========================
# print("\n📲 Setting webhook...")

# webhook_url = f"{public_url}/telegram/webhook"

# resp = urllib.request.urlopen(
#     f"https://api.telegram.org/bot{bot_token}/setWebhook?url={webhook_url}"
# )

# print(json.dumps(json.loads(resp.read()), indent=2))


# # =========================
# # KEEP ALIVE
# # =========================
# print("\n🔥 ALL SYSTEMS LIVE")
# print("Backend + Frontend + Telegram Bot running")

# try:
#     while True:
#         time.sleep(1)

# except KeyboardInterrupt:
#     print("\n🛑 Shutting down...")

# finally:
#     backend_proc.terminate()
#     frontend_proc.terminate()
#     cf_proc.terminate()

#     if os.path.exists("tunnel.log"):
#         os.remove("tunnel.log")

#     print("✅ Clean exit")