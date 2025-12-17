from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from models.chat_models import ChatRequest, ChatResponse
from services.chat_service import ChatService
from utils.streaming import mock_streaming_response

# Manejar errores de API descendentes (por ejemplo, cuota de OpenAI) y traducirlos a respuestas HTTP

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/", response_model=ChatResponse)
async def chat_basic(body: ChatRequest):
    if not body.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    try:
        reply = await ChatService.generate_basic_reply(body.message)
    except RuntimeError as e:
        # Errores del cliente OpenAI (cuota, timeout, etc.)
        raise HTTPException(status_code=503, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")

    return ChatResponse(response=reply)


@router.post("/stream")
async def chat_stream(body: ChatRequest):
    if not body.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Por ahora usamos respuesta simulada (mock)
    simulated_answer = (
        "FastAPI es un framework moderno y rápido "
        "para construir APIs en Python usando async y tipado."
    )

    try:
        generator = mock_streaming_response(simulated_answer)

        return StreamingResponse(
            generator,
            media_type="text/plain"
        )
    except Exception:
        raise HTTPException(status_code=500, detail="Streaming error")