from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseModel):
    APP_NAME: str = "FastAPI AI Stream"

    # OpenAI (opcional)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    # Groq (nuevo)
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    GROQ_MODEL: str = os.getenv("GROQ_MODEL")

    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

settings = Settings()