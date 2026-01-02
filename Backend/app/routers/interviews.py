from fastapi import APIRouter
from pydantic import BaseModel
import uuid

router = APIRouter(prefix="/interviews", tags=["Interviews"])


class InterviewRequest(BaseModel):
    topic: str
    difficulty: str


fake_interviews = {}


@router.post("/")
async def create_interview(data: InterviewRequest):
    interview_id = str(uuid.uuid4())
    fake_interviews[interview_id] = {
        "topic": data.topic,
        "difficulty": data.difficulty,
        "status": "pending",
        "score": None
    }
    return {"interview_id": interview_id}


@router.get("/{interview_id}")
async def get_interview(interview_id: str):
    if interview_id not in fake_interviews:
        return {"error": "La entrevista no existe"}

    return fake_interviews[interview_id]