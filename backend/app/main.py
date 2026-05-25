from fastapi import FastAPI
from app.telegram_bot import router

app = FastAPI()

app.include_router(router)

@app.get("/")
def home():
    return {"message": "MedBridge AI Backend Running"}