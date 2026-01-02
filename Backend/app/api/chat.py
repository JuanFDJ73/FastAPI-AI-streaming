from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from models.chat_models import ChatRequest, ChatResponse
from services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/", response_model=ChatResponse)
async def chat_basic(body: ChatRequest):
    if not body.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    try:
        reply = await ChatService.generate_basic_reply(body.message)
    except RuntimeError as e:
        # Errores del proveedor LLM (Groq/OpenAI)
        raise HTTPException(status_code=503, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")

    return ChatResponse(response=reply)


@router.post("/stream")
async def chat_stream(body: ChatRequest):
    if not body.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    async def generator():
        try:
            async for token in ChatService.stream_reply(body.message):
                yield token
        except RuntimeError as e:
            yield f"\n[ERROR]: {str(e)}"
        except Exception:
            yield "\n[ERROR]: Streaming failed"

    return StreamingResponse(
        generator(),
        media_type="text/plain"
    )