from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List


KEYWORD_SETS = {
    "skills": [
        "python",
        "fastapi",
        "react",
        "typescript",
        "ml",
        "machine learning",
        "data",
        "cloud",
        "aws",
        "gcp",
        "azure",
    ],
    "formatting": [
        "experience",
        "education",
        "projects",
        "skills",
        "summary",
    ],
}


@dataclass
class AtsScore:
    total: int
    breakdown: Dict[str, int]
    tips: List[str]


def _score_keywords(text: str, keywords: list[str], weight: int) -> int:
    lowered = text.lower()
    count = sum(1 for kw in keywords if kw in lowered)
    max_count = max(len(keywords), 1)
    ratio = count / max_count
    return int(weight * ratio)


def score_resume(text: str) -> AtsScore:
    """
    Very lightweight ATS-style scoring:
    - skills: keyword coverage
    - formatting: presence of standard sections
    - length/readability: rough heuristic on character count
    """
    breakdown: Dict[str, int] = {}
    tips: List[str] = []

    skills_score = _score_keywords(text, KEYWORD_SETS["skills"], weight=40)
    breakdown["skills"] = skills_score
    if skills_score < 25:
        tips.append(
            "Call out your technical skills more clearly (Python, React, cloud, ML, etc.)."
        )

    formatting_score = _score_keywords(text, KEYWORD_SETS["formatting"], weight=30)
    breakdown["formatting"] = formatting_score
    if formatting_score < 20:
        tips.append(
            "Add clear sections like Summary, Experience, Education, Projects, and Skills."
        )

    length = len(text)
    if length < 1200:
        readability_score = 20
        tips.append(
            "Your resume looks short; consider adding more detail for impact and clarity."
        )
    elif length > 8000:
        readability_score = 10
        tips.append("Resume is quite long; trim redundant bullets and focus on outcomes.")
    else:
        readability_score = 30
    breakdown["readability"] = readability_score

    completeness_score = 10 if "@" in text else 0
    breakdown["completeness"] = completeness_score
    if completeness_score == 0:
        tips.append("Make sure your contact information is present and easy to find.")

    total = min(100, sum(breakdown.values()))
    return AtsScore(total=total, breakdown=breakdown, tips=tips)

