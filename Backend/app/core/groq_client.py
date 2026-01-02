from groq import AsyncGroq
from core.config import settings

class GroqClient:
    def __init__(self):
        if not settings.GROQ_API_KEY:
            raise RuntimeError("GROQ_API_KEY not configured")

        self.client = AsyncGroq(api_key=settings.GROQ_API_KEY)

        if not settings.GROQ_MODEL:
            raise RuntimeError("GROQ_MODEL not configured")
        
        self.model = settings.GROQ_MODEL

    async def generate(self, message: str) -> str:
        try:
            completion = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": message},
                ],
            )
            return completion.choices[0].message.content
        except Exception as e:
            raise RuntimeError(f"Groq API error: {e}")

    async def stream(self, message: str):
        try:
            stream = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": message},
                ],
                stream=True,
            )

            async for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    yield delta

        except Exception as e:
            yield f"\n[ERROR]: {str(e)}"