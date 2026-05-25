import os
import sys
import subprocess
import time
import json
import urllib.request

def run_command(command, background=False):
    """Runs a system command safely across Windows, Mac, and Linux."""
    if background:
        if os.name == 'nt': # Windows
            return subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        else: # Mac/Linux
            return subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, preexec_fn=os.setpgrp)
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

print("🌐 2. Creating a public secure URL via built-in SSH Tunnel (No Node.js needed)...")

# We use localhost.run via built-in SSH. It works natively on Windows, Mac, and Linux.
# The StrictHostKeyChecking=no flag ensures it bypasses any interactive "trust this key" prompt.
ssh_cmd = "ssh -R 80:localhost:8000 -o StrictHostKeyChecking=no nokey@localhost.run"
ssh_proc = run_command(ssh_cmd, background=True)

# Give the SSH connection a few seconds to shake hands and print the domain link
time.sleep(5)

public_url = ""
# Read the stdout stream from the background process to grab the generated domain link
try:
    # Read a chunk of output lines to locate the line containing localhost.run
    for _ in range(10):
        # Read line without blocking indefinitely if there's no output
        import select
        if os.name != 'nt':
            ready, _, _ = select.select([ssh_proc.stdout], [], [], 1)
            if not ready: break
        
        line = ssh_proc.stdout.readline()
        if "lhrtunnel.link" in line or "localhost.run" in line:
            # Extract the raw url from the string
            parts = line.strip().split()
            for part in parts:
                if "https://" in part:
                    public_url = part
                    break
            if public_url: break
except Exception:
    pass

# Fallback: If parsing stdout was messy or restricted by OS pipes, prompt the user or handle failure
if not public_url:
    print("⚠️  Could not auto-read the generated URL structure.")
    print("💡 Please double check if your firewall or network blocks outgoing SSH tunnels.")
    print("Let's try to boot the server anyway...")
    public_url = "PENDING"

if public_url != "PENDING":
    print(f"🔗 Public URL generated: {public_url}")