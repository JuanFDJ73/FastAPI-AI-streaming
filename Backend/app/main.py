from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv

# Importar routers
from api import health
from api import chat
from routers import auth
from routers import interviews

app = FastAPI(title="Servidor prueba", version="0.1")

# CORS: permitir requests desde el frontend (Vite)
load_dotenv()
FRONTEND_ORIGINS = os.getenv("FRONTEND_ORIGINS", "http://localhost:5173")
origins = [o.strip() for o in FRONTEND_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(health.router)
app.include_router(chat.router)
app.include_router(auth.router)
app.include_router(interviews.router)

if __name__ == "__main__":
    # .env ya cargado arriba
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "127.0.0.1")
    uvicorn.run("main:app", host=host, port=port, reload=True)
