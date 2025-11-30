from fastapi import APIRouter, HTTPException
from models.chat_models import ChatRequest, ChatResponse

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/", response_model=ChatResponse)
async def chat_basic(body: ChatRequest):
    if not body.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    # Respuesta temporal (placeholder)
    bot_reply = f"Recibí tu mensaje: {body.message}"

    return ChatResponse(response=bot_reply)
