import asyncio
import time
import random
from typing import AsyncGenerator


class RetryConfig:
    MAX_RETRIES = 3
    BASE_DELAY = 0.5  # segundos
    MAX_DELAY = 4.0


async def mock_streaming_response(
    text: str,
    heartbeat_interval: float = 2.0,
    max_buffer_size: int = 5,
) -> AsyncGenerator[str, None]:
    """
    Streaming simulado con:
    - tokens progresivos
    - heartbeat
    - backpressure (queue)
    - retry + exponential backoff
    """

    queue: asyncio.Queue[str | None] = asyncio.Queue(maxsize=max_buffer_size)

    async def producer():
        retries = 0

        while retries <= RetryConfig.MAX_RETRIES:
            try:
                # Simulamos fallo aleatorio (solo para demo)
                if random.random() < 0.15:
                    raise RuntimeError("Simulated upstream failure")

                for word in text.split():
                    await queue.put(word + " ")
                    await asyncio.sleep(0.2)

                await queue.put(None)  # fin normal
                return

            except Exception as e:
                retries += 1
                if retries > RetryConfig.MAX_RETRIES:
                    await queue.put("[ERROR] Streaming failed after retries.")
                    await queue.put(None)
                    return

                delay = min(
                    RetryConfig.BASE_DELAY * (2 ** retries),
                    RetryConfig.MAX_DELAY,
                )
                await asyncio.sleep(delay)

    async def consumer():
        last_sent = time.time()

        while True:
            try:
                item = await asyncio.wait_for(queue.get(), timeout=heartbeat_interval)
                if item is None:
                    break
                yield item
                last_sent = time.time()
            except asyncio.TimeoutError:
                yield "\n"  # heartbeat
                last_sent = time.time()

    producer_task = asyncio.create_task(producer())

    async for chunk in consumer():
        yield chunk

    await producer_task

# Mock simple streaming without advanced features
async def mock_streaming_response(text: str, delay: float = 0.05):
    for char in text:
        yield char
        await asyncio.sleep(delay)