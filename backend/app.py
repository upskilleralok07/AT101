from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import sys

# Add workspace directory to python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database.db import init_db, fetch_user_results

from backend.services.resume_service import fetch_latest_resume_result
from backend.services.interview_service import fetch_latest_interview_result
from backend.services.jobs_service import fetch_latest_internship_recommendations
from backend.routes.auth import router as auth_router
from backend.routes.resume import router as resume_router
from backend.routes.interview import router as interview_router
from backend.routes.jobs import router as jobs_router

# Initialize the database tables on startup
init_db()

app = FastAPI(title="PlacePilot AI API", version="1.0.0")

# Setup CORS for the React development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root status route
@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "placepilot-api"}

# Dashboard aggregation route
@app.get("/api/dashboard/{user_id}")
def get_dashboard_data(user_id: int):
    latest_resume = fetch_latest_resume_result(user_id)
    latest_interview = fetch_latest_interview_result(user_id)
    latest_recommendations = fetch_latest_internship_recommendations(user_id, limit=5)
    all_results = fetch_user_results(user_id)

    # Calculate metrics
    resume_score = latest_resume["resume_score"] if latest_resume and latest_resume.get("resume_score") is not None else 0
    interview_score = latest_interview["interview_score"] if latest_interview and latest_interview.get("interview_score") is not None else "N/A"
    target_role = latest_resume["target_role"] if latest_resume and latest_resume.get("target_role") else "General"
    missing_skills_count = latest_resume["missing_skills"] if latest_resume and latest_resume.get("missing_skills") is not None else 0
    
    # Calculate interviews completed (count how many interview scores are in results)
    interviews_completed = sum(1 for r in all_results if r.get("interview_score") is not None)
    
    # Calculate resume scans (count how many resume scores are in results)
    resumes_scanned = sum(1 for r in all_results if r.get("resume_score") is not None)

    return {
        "metrics": {
            "resume_score": resume_score,
            "interview_score": interview_score,
            "target_role": target_role,
            "missing_skills_count": missing_skills_count,
            "interviews_completed": interviews_completed,
            "resumes_scanned": resumes_scanned
        },
        "latest_resume": latest_resume,
        "latest_interview": latest_interview,
        "latest_recommendations": latest_recommendations,
        "recent_activity": all_results[:10]  # top 10 activities
    }

# Include child routes
api_router = APIRouter(prefix="/api")
api_router.include_router(auth_router)
api_router.include_router(resume_router)
api_router.include_router(interview_router)
api_router.include_router(jobs_router)

app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run("backend.app:app", host="127.0.0.1", port=8000, reload=True)
