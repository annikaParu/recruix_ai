"""Analyze resume vs job description using Claude."""

from __future__ import annotations

import json
import os
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["analyze"])


class AnalyzeRequest(BaseModel):
    job_description: str
    resume_text: str


class AnalyzeResponse(BaseModel):
    score: int
    matched_skills: list[str]
    missing_skills: list[str]
    matched_keywords: list[str]
    missing_keywords: list[str]
    experience_match: str
    recommendation: str
    tips: list[str]


def _call_claude(job_desc: str, resume: str) -> dict[str, Any]:
    try:
        import anthropic
    except ImportError:
        raise HTTPException(
            status_code=500,
            detail="Anthropic SDK not installed. Run: pip install anthropic",
        )
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        raise HTTPException(
            status_code=500,
            detail="ANTHROPIC_API_KEY not set. Add it to backend/.env",
        )
    client = anthropic.Anthropic(api_key=key)
    prompt = f"""Compare this resume to this job description. Return ONLY valid JSON, no other text.

Job description:
{job_desc[:8000]}

Resume:
{resume[:8000]}

Return JSON with exactly these keys:
{{
  "score": number 0-100 (overall match percentage),
  "matchedSkills": string[] (skills from JD that appear in resume),
  "missingSkills": string[] (skills from JD not in resume),
  "matchedKeywords": string[] (important keywords from JD found in resume),
  "missingKeywords": string[] (important keywords from JD not in resume),
  "experienceMatch": string (e.g. "Required: 2+ years. Yours: Entry level - partial match"),
  "recommendation": string (1-2 sentence overall recommendation),
  "tips": string[] (3 specific tips to improve match)
}}"""

    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}],
    )
    raw = message.content[0].text
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        start = raw.find("{")
        end = raw.rfind("}") + 1
        if start >= 0 and end > start:
            parsed = json.loads(raw[start:end])
        else:
            raise HTTPException(status_code=500, detail="Claude returned invalid JSON")
    return {
        "score": int(parsed.get("score", 0)),
        "matched_skills": parsed.get("matchedSkills", []),
        "missing_skills": parsed.get("missingSkills", []),
        "matched_keywords": parsed.get("matchedKeywords", []),
        "missing_keywords": parsed.get("missingKeywords", []),
        "experience_match": parsed.get("experienceMatch", ""),
        "recommendation": parsed.get("recommendation", ""),
        "tips": parsed.get("tips", []),
    }


@router.post("/analyze-match", response_model=AnalyzeResponse)
async def analyze_match(req: AnalyzeRequest) -> AnalyzeResponse:
    if not req.resume_text or not req.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text is required")
    if not req.job_description or not req.job_description.strip():
        raise HTTPException(status_code=400, detail="Job description is required")
    result = _call_claude(req.job_description, req.resume_text)
    return AnalyzeResponse(**result)
