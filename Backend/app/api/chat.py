from fastapi import APIRouter, HTTPException
from models.chat_models import ChatRequest, ChatResponse
from services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/", response_model=ChatResponse)
async def chat_basic(body: ChatRequest):
    if not body.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    reply = await ChatService.generate_basic_reply(body.message)

    return ChatResponse(response=reply)
