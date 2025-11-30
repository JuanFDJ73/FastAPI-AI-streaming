from fastapi import FastAPI
import uvicorn
import os
from dotenv import load_dotenv

# Importar routers
from api import health
from api import chat

app = FastAPI(title="Servidor prueba", version="0.1")

# Routes
app.include_router(health.router)
app.include_router(chat.router)

if __name__ == "__main__":
    load_dotenv()
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "127.0.0.1")
    uvicorn.run("main:app", host=host, port=port, reload=True)
