import os
import io
import sys
from datetime import datetime
from backend.database.db import get_connection

# Add root folder to sys.path to find backend/src
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.src.resume_parser import parse_resume
from backend.src.placement_model import predict_placement

# PDF Extractor with fallback to pypdf or PyPDF2
try:
    from pypdf import PdfReader
    PDF_PARSING_AVAILABLE = True
except ImportError:
    try:
        from PyPDF2 import PdfReader
        PDF_PARSING_AVAILABLE = True
    except ImportError:
        PDF_PARSING_AVAILABLE = False


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    if not PDF_PARSING_AVAILABLE:
        raise ImportError("PDF extraction libraries (pypdf / PyPDF2) are not installed on the server.")

    reader = PdfReader(io.BytesIO(pdf_bytes))
    text = ""
    for page in reader.pages:
        t = page.extract_text()
        if t:
            text += t + "\n"
    return text


def save_resume_result(user_id, placement_result, parsed_resume, target_role="General"):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO results (
            user_id, resume_score, interview_score, resume_label,
            target_role, skills_found, missing_skills, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id,
        placement_result.get("score", 0),
        None,
        placement_result.get("label", ""),
        target_role,
        len(placement_result.get("skills_found", [])),
        len(placement_result.get("missing_skills", [])),
        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ))
    conn.commit()
    conn.close()


def fetch_latest_resume_result(user_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT * FROM results
        WHERE user_id = ? AND resume_score IS NOT NULL
        ORDER BY created_at DESC
        LIMIT 1
    """, (user_id,))
    row = cur.fetchone()
    conn.close()
    return dict(row) if row else None


def analyze_resume_content(user_id: int, resume_text: str, target_role: str = "General"):
    parsed = parse_resume(resume_text)
    result = predict_placement(parsed)

    # Save to SQLite DB
    save_resume_result(
        user_id=user_id,
        placement_result=result,
        parsed_resume=parsed,
        target_role=target_role if target_role else parsed.get("category", "General")
    )

    return {
        "score": result.get("score", 0),
        "label": result.get("label", ""),
        "skills_found": result.get("skills_found", []),
        "missing_skills": result.get("missing_skills", []),
        "skill_breakdown": parsed.get("skill_breakdown", {}),
        "word_count": parsed.get("word_count", 0),
        "num_skills": parsed.get("num_skills", 0),
        "category": parsed.get("category", "General")
    }
