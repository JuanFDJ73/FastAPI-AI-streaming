from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseModel):
    APP_NAME: str = "FastAPI AI Stream"
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

settings = Settings()