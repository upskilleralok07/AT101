# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import List, Optional

from backend.services.jobs_service import (
    get_recommendations,
    fetch_latest_internship_recommendations
)

router = APIRouter(prefix="/jobs", tags=["jobs"])

class RecommendJobsRequest(BaseModel):
    user_id: int
    user_skills: List[str] = []
    preferred_role: str = ""
    preferred_functional_area: str = ""
    preferred_industry: str = ""
    preferred_company: str = ""
    preferred_location: str = ""
    max_distance: float = 200.0
    work_from_home: bool = False
    top_n: int = 5


@router.post("/recommend")
def recommend_jobs(data: RecommendJobsRequest):
    result = get_recommendations(
        user_id=data.user_id,
        user_skills=data.user_skills,
        preferred_role=data.preferred_role,
        preferred_functional_area=data.preferred_functional_area,
        preferred_industry=data.preferred_industry,
        preferred_company=data.preferred_company,
        preferred_location=data.preferred_location,
        max_distance=data.max_distance,
        work_from_home=data.work_from_home,
        top_n=data.top_n
    )
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error", "Error generating recommendations"))
    return result


@router.get("/latest/{user_id}")
def get_latest_recommendations(user_id: int, limit: int = 5):
    try:
        recommendations = fetch_latest_internship_recommendations(user_id, limit)
        return {"success": True, "recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
