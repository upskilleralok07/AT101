from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import List, Optional

from backend.services.interview_service import (
    start_new_session,
    submit_session_answer,
    finish_session,
    fetch_interview_history,
    fetch_latest_interview_result
)

router = APIRouter(prefix="/interview", tags=["interview"])

class StartInterviewRequest(BaseModel):
    user_id: int
    role: str
    skills: List[str] = []
    num_questions: int = 5
    use_ai: bool = True

class SubmitAnswerRequest(BaseModel):
    session_id: str
    question: str
    answer: str

class FinishInterviewRequest(BaseModel):
    session_id: str


@router.post("/start")
def start_interview(data: StartInterviewRequest):
    try:
        session = start_new_session(
            user_id=data.user_id,
            role=data.role,
            skills=data.skills,
            num_q=data.num_questions,
            use_ai=data.use_ai
        )
        return {"success": True, "session": session}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/submit")
def submit_answer(data: SubmitAnswerRequest):
    try:
        result = submit_session_answer(data.session_id, data.question, data.answer)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/finish")
def finish_interview(data: FinishInterviewRequest):
    result = finish_session(data.session_id)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "Error finishing interview"))
    return result


@router.get("/history/{user_id}")
def get_history(user_id: int):
    try:
        history = fetch_interview_history(user_id)
        return {"success": True, "history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
