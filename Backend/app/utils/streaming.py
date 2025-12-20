import asyncio
import time
from typing import AsyncGenerator


async def mock_streaming_response(
    text: str,
    heartbeat_interval: float = 2.0
) -> AsyncGenerator[str, None]:
    """
    Simula streaming token por token con heartbeats.
    """
    last_sent = time.time()

    for word in text.split():
        yield word + " "
        last_sent = time.time()
        await asyncio.sleep(0.2)

        # Enviar heartbeat si pasó mucho tiempo sin datos
        if time.time() - last_sent >= heartbeat_interval:
            yield "\n"  # heartbeat simple
            last_sent = time.time()

    # Heartbeat final (opcional)
    yield "\n"
