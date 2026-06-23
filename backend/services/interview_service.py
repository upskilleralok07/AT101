import os
import sys
import uuid
from datetime import datetime
from backend.database.db import get_connection

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.src.llm_engine import (
    generate_questions,
    evaluate_answer,
    get_interview_summary
)

# Active interview sessions cache to store state between API calls
# maps session_id -> { "role": role, "questions": [], "answers": [], "current_index": 0 }
ACTIVE_SESSIONS = {}


def start_new_session(user_id: int, role: str, skills: list, num_q: int, use_ai: bool):
    questions = generate_questions(role, skills, num_q)
    session_id = str(uuid.uuid4())

    ACTIVE_SESSIONS[session_id] = {
        "user_id": user_id,
        "role": role,
        "questions": questions,
        "qa_pairs": [],
        "current_index": 0,
        "total_questions": len(questions)
    }

    return {
        "session_id": session_id,
        "questions": questions,
        "total_questions": len(questions),
        "current_index": 0
    }


def submit_session_answer(session_id: str, question: str, answer: str):
    if session_id not in ACTIVE_SESSIONS:
        # Evaluate on the fly if session expired or not found
        feedback = evaluate_answer(question, answer)
        return {
            "success": True,
            "feedback": feedback,
            "next_index": None
        }

    session = ACTIVE_SESSIONS[session_id]
    feedback = evaluate_answer(question, answer)

    # Save to qa_pairs
    session["qa_pairs"].append({
        "question": question,
        "answer": answer,
        "score": feedback.get("score", 6),
        "feedback": feedback
    })

    session["current_index"] += 1

    return {
        "success": True,
        "feedback": feedback,
        "next_index": session["current_index"] if session["current_index"] < session["total_questions"] else None
    }


def save_interview_result(user_id, interview_score, target_role="General"):
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
        None,
        interview_score,
        "",
        target_role,
        None,
        None,
        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ))
    conn.commit()
    conn.close()


def finish_session(session_id: str):
    if session_id not in ACTIVE_SESSIONS:
        return {"success": False, "error": "Session not found or expired"}

    session = ACTIVE_SESSIONS.pop(session_id)
    summary = get_interview_summary(session["qa_pairs"], session["role"])

    overall_score = summary.get("overall_score", 0)
    try:
        overall_score = float(str(overall_score).replace("/10", "").strip())
    except Exception:
        overall_score = 0

    save_interview_result(
        user_id=session["user_id"],
        interview_score=overall_score,
        target_role=session["role"]
    )

    return {
        "success": True,
        "summary": summary,
        "qa_pairs": session["qa_pairs"]
    }


def fetch_latest_interview_result(user_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT * FROM results
        WHERE user_id = ? AND interview_score IS NOT NULL
        ORDER BY created_at DESC
        LIMIT 1
    """, (user_id,))
    row = cur.fetchone()
    conn.close()
    return dict(row) if row else None


def fetch_interview_history(user_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT * FROM results
        WHERE user_id = ? AND interview_score IS NOT NULL
        ORDER BY created_at DESC
    """, (user_id,))
    rows = cur.fetchall()
    conn.close()
    return [dict(r) for r in rows]
