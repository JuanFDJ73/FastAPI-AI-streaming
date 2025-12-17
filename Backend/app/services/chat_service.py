from core.openai_client import OpenAIClient

class ChatService:
    _openai_client = OpenAIClient()

    @staticmethod
    async def generate_basic_reply(message: str) -> str:
        return await ChatService._openai_client.generate_response(message)