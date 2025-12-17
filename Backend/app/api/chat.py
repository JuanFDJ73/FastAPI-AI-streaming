from fastapi import APIRouter, HTTPException
from models.chat_models import ChatRequest, ChatResponse
from services.chat_service import ChatService

# Manejar errores de API descendentes (por ejemplo, cuota de OpenAI) y traducirlos a respuestas HTTP

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/", response_model=ChatResponse)
async def chat_basic(body: ChatRequest):
    if not body.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    try:
        reply = await ChatService.generate_basic_reply(body.message)
    except RuntimeError as e:
        # Lo genera el cliente OpenAI cuando ocurren problemas de cuota u otros problemas de API
        raise HTTPException(status_code=503, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")

    return ChatResponse(response=reply)
