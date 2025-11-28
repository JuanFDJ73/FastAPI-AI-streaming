from fastapi import FastAPI
import uvicorn
import os
from dotenv import load_dotenv

app = FastAPI(title="Servidor prueba", version="0.1")

@app.get("/")
async def main():
	return {"message": "Servidor funcionando"}

if __name__ == "__main__":
	load_dotenv()
	port = int(os.getenv("PORT", "8000"))
	host = os.getenv("HOST", "127.0.0.1")
	uvicorn.run("main:app", host=host, port=port, reload=True)