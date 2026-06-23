import bcrypt
import json
from backend.database.db import get_connection

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))


def signup_user(name: str, email: str, password: str):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            (name.strip(), email.strip().lower(), hash_password(password))
        )
        conn.commit()
        # Get the new user ID
        cur.execute("SELECT last_insert_rowid()")
        user_id = cur.fetchone()[0]

        # Initialize an empty profile for this user
        cur.execute(
            "INSERT INTO profiles (user_id, bio, skills, certificates, achievements, social_links, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (user_id, "", "", "[]", "[]", "{}", "")
        )
        conn.commit()

        return True, "Account created successfully. Please login."
    except Exception as e:
        if "UNIQUE constraint failed" in str(e):
            return False, "This email is already registered."
        return False, str(e)
    finally:
        conn.close()


def login_user(email: str, password: str):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE email = ?", (email.strip().lower(),))
    user = cur.fetchone()
    conn.close()

    if user and verify_password(password, user["password"]):
        user_dict = dict(user)
        # Don't return the password hash
        user_dict.pop("password", None)
        return True, user_dict
    return False, "Invalid email or password."


def get_user_profile(user_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM profiles WHERE user_id = ?", (user_id,))
    profile = cur.fetchone()
    conn.close()

    if profile:
        profile_dict = dict(profile)
        # Parse JSON fields safely
        try:
            profile_dict["certificates"] = json.loads(profile_dict.get("certificates", "[]") or "[]")
        except Exception:
            profile_dict["certificates"] = []

        try:
            profile_dict["achievements"] = json.loads(profile_dict.get("achievements", "[]") or "[]")
        except Exception:
            profile_dict["achievements"] = []

        try:
            profile_dict["social_links"] = json.loads(profile_dict.get("social_links", "{}") or "{}")
        except Exception:
            profile_dict["social_links"] = {}

        return profile_dict
    return None


def update_user_profile(user_id: int, bio: str, skills: str, certificates: list, achievements: list, social_links: dict, photo_url: str):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO profiles (user_id, bio, skills, certificates, achievements, social_links, photo_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                bio = excluded.bio,
                skills = excluded.skills,
                certificates = excluded.certificates,
                achievements = excluded.achievements,
                social_links = excluded.social_links,
                photo_url = excluded.photo_url
        """, (
            user_id,
            bio,
            skills,
            json.dumps(certificates),
            json.dumps(achievements),
            json.dumps(social_links),
            photo_url
        ))
        conn.commit()
        return True, "Profile updated successfully."
    except Exception as e:
        return False, str(e)
    finally:
        conn.close()
