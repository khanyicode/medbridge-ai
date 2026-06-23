# Medbridge AI

## Windows Setup Instructions

These instructions are for Windows users who need to configure secure secrets and run the project locally.

### 1. Create the secure configuration folder

Open PowerShell and run:

```powershell
mkdir "$HOME\.medbridge"
```

This creates a hidden folder named `.medbridge` inside your Windows user profile directory, for example:

`C:\Users\YourName\.medbridge`

### 2. Create and open the keys file

Run:

```powershell
notepad "$HOME\.medbridge\keys.env"
```

If Windows prompts "Do you want to create a new file?", click **Yes**.

### 3. Populate your environment variables

In the Notepad window, paste your live credentials exactly like this. Do not use quotes or spaces around the `=` signs:

```text
TELEGRAM_BOT_TOKEN=123456789:ABCdefGh...
GEMINI_API_KEY=AIzaSyYourActualKey...
DATABASE_URL=postgresql://user:password@localhost:5432/medbridge
```

Save and close the file.

### 4. Install dependencies

From the project root folder (`medbridge-ai`), install backend and frontend dependencies.

#### Backend

```powershell
python -m pip install -r backend/requirements.txt
```

#### Frontend

```powershell
cd frontend
npm install
cd ..
```

### 5. Run the project

From the project root folder, start the app with:

```powershell
python run.py
```

This script will:

- install backend dependencies if needed
- start the FastAPI backend on `localhost:8000`
- start the Vite frontend
- launch the Cloudflare tunnel and set the Telegram webhook

### 6. Verify the setup

- The backend should be running on `http://localhost:8000`
- The frontend should be available at the URL shown by Vite
- The Telegram bot webhook should be configured automatically

### Notes

- The app reads secrets from `C:\Users\YourName\.medbridge\keys.env`
- Make sure your PostgreSQL database is running and the `DATABASE_URL` is correct

If you run into issues, double-check that `keys.env` exists and contains the three required values.

## Linux Setup Instructions

These instructions are for Linux users who need to configure secure secrets and run the project locally.

### 1. Create the secure configuration folder

Open a terminal and run:

```bash
mkdir -p "$HOME/.medbridge"
```

This creates a hidden folder named `.medbridge` inside your home directory, for example:

`/home/yourname/.medbridge`

### 2. Create and open the keys file

Run:

```bash
nano "$HOME/.medbridge/keys.env"
```

If `nano` is not installed, you can use another editor such as `vi` or `gedit`.

### 3. Populate your environment variables

In the editor, paste your live credentials exactly like this. Do not use quotes or spaces around the `=` signs:

```text
TELEGRAM_BOT_TOKEN=123456789:ABCdefGh...
GEMINI_API_KEY=AIzaSyYourActualKey...
DATABASE_URL=postgresql://user:password@localhost:5432/medbridge
```

Save and close the file.

### 4. Install dependencies

From the project root folder (`medbridge-ai`), install backend and frontend dependencies.

#### Backend

```bash
python3 -m pip install -r backend/requirements.txt
```

#### Frontend

```bash
cd frontend
npm install
cd ..
```

### 5. Run the project

From the project root folder, start the app with:

```bash
python3 run.py
```

This script will:

- install backend dependencies if needed
- start the FastAPI backend on `localhost:8000`
- start the Vite frontend
- launch the Cloudflare tunnel and set the Telegram webhook

### 6. Verify the setup

- The backend should be running on `http://localhost:8000`
- The frontend should be available at the URL shown by Vite
- The Telegram bot webhook should be configured automatically

### Notes

- The app reads secrets from `$HOME/.medbridge/keys.env`

If you run into issues, double-check that `keys.env` exists and contains the three required values.
