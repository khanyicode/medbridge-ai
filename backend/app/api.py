from fastapi import APIRouter
from pydantic import BaseModel
from app.ai_service import analyze_symptoms
import asyncio

router = APIRouter()


class SymptomRequest(BaseModel):
    message: str


@router.post("/api/analyze")
async def analyze(req: SymptomRequest):

    loop = asyncio.get_running_loop()

    result = await loop.run_in_executor(
        None,
        analyze_symptoms,
        req.message
    )

    return {
        "response": result
    }