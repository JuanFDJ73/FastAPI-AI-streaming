from openai import AsyncOpenAI
import openai
from core.config import settings
import os


class OpenAIClient:
    def __init__(self):
        self.use_mock = os.getenv("USE_OPENAI_MOCK", "false").lower() == "true"

        if not self.use_mock:
            if not settings.OPENAI_API_KEY:
                raise RuntimeError("OPENAI_API_KEY not configured")
            self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    async def generate_response(self, message: str) -> str:
        if self.use_mock:
            # Respuesta simulada para fines de prueba,"message": "Explícame qué es FastAPI en una frase"
            return f"[MOCK RESPONSE] FastAPI es un framework moderno y rápido para crear APIs en Python."

        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": message},
                ],
            )
            return response.choices[0].message.content

        except openai.RateLimitError as e:
            raise RuntimeError(f"OpenAI quota exceeded: {str(e)}") from e
        except Exception as e:
            raise RuntimeError(f"OpenAI API error: {str(e)}") from e