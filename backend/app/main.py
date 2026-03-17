from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import resume, analyze

app = FastAPI(title="Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router, prefix="/api")
app.include_router(analyze.router)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}

