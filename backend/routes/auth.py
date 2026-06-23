from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel, EmailStr
from backend.services.auth_service import (
    signup_user,
    login_user,
    get_user_profile,
    update_user_profile
)

router = APIRouter(prefix="/auth", tags=["auth"])

class UserSignupSchema(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str

class ProfileUpdateSchema(BaseModel):
    user_id: int
    bio: str = ""
    skills: str = ""
    certificates: list = []
    achievements: list = []
    social_links: dict = {}
    photo_url: str = ""


@router.post("/signup")
def signup(data: UserSignupSchema):
    success, message = signup_user(data.name, data.email, data.password)
    if not success:
        raise HTTPException(status_code=400, detail=message)
    return {"message": message}


@router.post("/login")
def login(data: UserLoginSchema):
    success, result = login_user(data.email, data.password)
    if not success:
        raise HTTPException(status_code=401, detail=result)
    return {"message": "Login successful", "user": result}


@router.get("/profile/{user_id}")
def get_profile(user_id: int):
    profile = get_user_profile(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")
    return {"profile": profile}


@router.post("/profile")
def update_profile(data: ProfileUpdateSchema):
    success, message = update_user_profile(
        user_id=data.user_id,
        bio=data.bio,
        skills=data.skills,
        certificates=data.certificates,
        achievements=data.achievements,
        social_links=data.social_links,
        photo_url=data.photo_url
    )
    if not success:
        raise HTTPException(status_code=500, detail=message)
    return {"message": message}
