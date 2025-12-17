import asyncio
from typing import AsyncGenerator


async def mock_streaming_response(text: str) -> AsyncGenerator[str, None]:
    """
    Simula una respuesta token por token como si viniera de OpenAI
    """
    for word in text.split():
        yield word + " "
        await asyncio.sleep(0.2)  # Simula el retardo de la red