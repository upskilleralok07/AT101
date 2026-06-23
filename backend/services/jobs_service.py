import os
import sys
import pandas as pd
from datetime import datetime
from backend.database.db import get_connection

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.src.internship_recommender import InternshipRecommender

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INTERNSHIP_CSV_PATH = os.path.join(BASE_DIR, "models", "intern", "internship.csv")

# Initialize InternshipRecommender
recommender = None
try:
    if os.path.exists(INTERNSHIP_CSV_PATH):
        recommender = InternshipRecommender(INTERNSHIP_CSV_PATH)
        print("Internship Recommender initialized successfully in service layer.")
    else:
        print(f"Warning: CSV not found at {INTERNSHIP_CSV_PATH}")
except Exception as e:
    print(f"Error loading Internship Recommender: {e}")



def save_internship_recommendations(user_id, recommendations_df):
    conn = get_connection()
    cur = conn.cursor()

    # Clear old recommendations for user
    cur.execute("DELETE FROM internship_recommendations WHERE user_id = ?", (user_id,))

    for _, row in recommendations_df.iterrows():
        cur.execute("""
            INSERT INTO internship_recommendations (
                user_id, company_name, internship_role, functional_area,
                industry, state, distance_km, recommendation_score, created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            user_id,
            str(row.get("company_name", "")),
            str(row.get("internship_role", "")),
            str(row.get("functional_area", "")),
            str(row.get("industry", "")),
            str(row.get("state", "")),
            float(row.get("distance_km", 0)),
            float(row.get("recommendation_score", 0)),
            datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ))

    conn.commit()
    conn.close()


def fetch_latest_internship_recommendations(user_id, limit=5):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT *
        FROM internship_recommendations
        WHERE user_id = ?
        ORDER BY created_at DESC, recommendation_score DESC
        LIMIT ?
    """, (user_id, limit))
    rows = cur.fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_recommendations(
    user_id: int,
    user_skills: list,
    preferred_role: str = "",
    preferred_functional_area: str = "",
    preferred_industry: str = "",
    preferred_company: str = "",
    preferred_location: str = "",
    max_distance: float = 200.0,
    work_from_home: bool = False,
    top_n: int = 5
):
    if recommender is None:
        return {"success": False, "error": "Recommender engine is not loaded on the backend."}

    try:
        recommendations = recommender.recommend(
            user_skills=user_skills,
            preferred_role=preferred_role,
            preferred_functional_area=preferred_functional_area,
            preferred_industry=preferred_industry,
            preferred_company=preferred_company,
            preferred_location=preferred_location,
            preferred_state="madhya pradesh",
            max_distance=max_distance,
            work_from_home=work_from_home,
            top_n=top_n
        )

        results = []
        if recommendations is not None and not recommendations.empty:
            # Save to database
            save_internship_recommendations(user_id, recommendations)

            # Format the output with explanations
            for _, row in recommendations.iterrows():
                explanation = recommender.explain_recommendation(
                    internship_row=row,
                    user_skills=user_skills,
                    preferred_role=preferred_role
                )
                row_dict = row.to_dict()
                row_dict["explanation"] = explanation
                results.append(row_dict)

        return {"success": True, "recommendations": results}

    except Exception as e:
        return {"success": False, "error": str(e)}
