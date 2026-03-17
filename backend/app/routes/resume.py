from __future__ import annotations

from typing import Any, Dict

from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel

from app.services.resume_parser import extract_resume_text
from app.services.ats_scorer import score_resume

router = APIRouter(prefix="/resume", tags=["resume"])


class ExtractResponse(BaseModel):
    text: str
    skills: list[str] = []


@router.post("/extract", response_model=ExtractResponse)
async def extract_resume(file: UploadFile = File(...)) -> ExtractResponse:
    """Extract text from resume file for storage in profiles."""
    if file.content_type not in (
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX are supported for extraction.")
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File is too large (max 5MB).")
    file_type = "pdf" if file.content_type == "application/pdf" else "docx"
    try:
        text = extract_resume_text(content, file_type=file_type) or ""
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to parse resume: {exc}") from exc
    skills = _extract_skills(text)
    return ExtractResponse(text=text, skills=skills)


def _extract_skills(text: str) -> list[str]:
    """Extract tech skills mentioned in resume text."""
    common = [
        "Python", "JavaScript", "TypeScript", "React", "Node.js", "Java", "C++", "Go", "Rust",
        "SQL", "MongoDB", "PostgreSQL", "Redis", "AWS", "GCP", "Azure", "Docker", "Kubernetes",
        "TensorFlow", "PyTorch", "ML", "Machine Learning", "AI", "NLP", "LangChain", "LLM",
        "REST", "GraphQL", "Git", "Linux", "CI/CD", "Agile", "Data", "DevOps", "Full Stack",
        "FastAPI", "Django", "Flask", "Vue", "Angular", "Next.js", "Tailwind", "HTML", "CSS",
    ]
    lowered = text.lower()
    found: list[str] = []
    seen: set[str] = set()
    for s in common:
        if s.lower() in lowered and s.lower() not in seen:
            found.append(s)
            seen.add(s.lower())
    return found[:20]


class ResumeUploadResponse(BaseModel):
    ats_score: int
    breakdown: Dict[str, int]
    tips: list[str]
    extracted_preview: str


@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(file: UploadFile = File(...)) -> ResumeUploadResponse:
    if file.content_type not in (
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX resumes are supported.")

    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File is too large (max 5MB).")

    file_type = "pdf" if file.content_type == "application/pdf" else "docx"
    try:
        text = extract_resume_text(content, file_type=file_type) or ""
    except Exception as exc:  # pragma: no cover - safety net
        raise HTTPException(status_code=500, detail=f"Failed to parse resume: {exc}") from exc

    ats = score_resume(text)
    preview = text[:800]
    return ResumeUploadResponse(
        ats_score=ats.total,
        breakdown=ats.breakdown,
        tips=ats.tips,
        extracted_preview=preview,
    )

