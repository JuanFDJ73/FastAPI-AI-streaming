from core.groq_client import GroqClient

client = GroqClient()

class ChatService:

    @staticmethod
    async def generate_basic_reply(message: str) -> str:
        return await client.generate(message)

    @staticmethod
    async def stream_reply(message: str):
        async for token in client.stream(message):
            yield token