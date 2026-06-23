from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional
import os
import sys

from backend.services.resume_service import (
    analyze_resume_content,
    extract_text_from_pdf,
    fetch_latest_resume_result
)

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.src.llm_engine import get_resume_suggestions

router = APIRouter(prefix="/resume", tags=["resume"])

class SuggestionsRequest(BaseModel):
    skills: list
    missing_skills: list
    category: str


@router.post("/analyze")
async def analyze_resume(
    user_id: int = Form(...),
    text: Optional[str] = Form(None),
    target_role: Optional[str] = Form("General"),
    job_description: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    resume_text = ""

    if file is not None:
        filename = file.filename.lower()
        if not filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF resumes are supported.")
        
        try:
            pdf_bytes = await file.read()
            resume_text = extract_text_from_pdf(pdf_bytes)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to extract text from PDF: {str(e)}")
    
    elif text and text.strip():
        resume_text = text
    
    else:
        raise HTTPException(status_code=400, detail="Please upload a PDF resume or paste resume text.")

    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="The resume content is empty.")

    try:
        analysis = analyze_resume_content(user_id, resume_text, target_role)
        
        suggestions = None
        questions = None

        if job_description and job_description.strip():
            from backend.src.resume_parser import extract_skills
            from backend.src.llm_engine import generate_questions

            jd_skills = extract_skills(job_description.lower())
            resume_skills = analysis.get("skills_found", [])

            if jd_skills:
                matched = [s for s in jd_skills if s in resume_skills]
                missing = [s for s in jd_skills if s not in resume_skills]
                
                score = round((len(matched) / len(jd_skills)) * 100, 1)
                analysis["score"] = score
                analysis["missing_skills"] = missing
                analysis["label"] = "✅ Likely to be Placed" if score >= 60 else "❌ Needs Improvement"
            
            # Generate dynamic suggestions
            role_desc = f"{target_role} (Job Description: {job_description[:300]})"
            suggestions = get_resume_suggestions(resume_skills, analysis.get("missing_skills", []), role_desc)

            # Generate dynamic questions
            questions = generate_questions(f"{target_role} role matching description: {job_description[:300]}", resume_skills, 5)

        return {
            "success": True,
            "analysis": analysis,
            "ai_suggestions": suggestions,
            "interview_questions": questions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing resume: {str(e)}")



@router.get("/latest/{user_id}")
def get_latest_resume(user_id: int):
    result = fetch_latest_resume_result(user_id)
    if not result:
        return {"success": True, "analysis": None}
    return {"success": True, "analysis": result}


@router.post("/suggestions")
def get_ai_suggestions(data: SuggestionsRequest):
    try:
        suggestions = get_resume_suggestions(data.skills, data.missing_skills, data.category)
        return {"success": True, "suggestions": suggestions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate suggestions: {str(e)}")
