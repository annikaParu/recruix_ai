from __future__ import annotations

from io import BytesIO
from typing import Literal

import fitz  # PyMuPDF
from docx import Document


FileType = Literal["pdf", "docx"]


def extract_text_from_pdf(data: bytes) -> str:
  text_parts: list[str] = []
  with fitz.open(stream=data, filetype="pdf") as doc:
    for page in doc:
      page_text = page.get_text()
      if page_text:
        text_parts.append(page_text)
  return "\n".join(text_parts)


def extract_text_from_docx(data: bytes) -> str:
  file_obj = BytesIO(data)
  document = Document(file_obj)
  return "\n".join(p.text for p in document.paragraphs if p.text)


def extract_resume_text(data: bytes, file_type: FileType) -> str:
  if file_type == "pdf":
    return extract_text_from_pdf(data)
  if file_type == "docx":
    return extract_text_from_docx(data)
  raise ValueError("Unsupported file type")

