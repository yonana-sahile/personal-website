import re

STOP_WORDS = {
    "a", "an", "the", "is", "are", "was", "were", "does", "do", "did",
    "what", "who", "where", "when", "why", "how", "tell", "me", "about",
    "of", "to", "in", "for", "on", "with", "and", "or", "that", "this",
    "yonas", "sahile", "he", "his", "him", "i", "you", "can", "get",
    "email", "contact", "phone", "number"
}

def get_keywords(text):
    words = re.findall(r'\b[a-z]+\b', text.lower())
    return {w for w in words if w not in STOP_WORDS and len(w) > 1}

def generate_response(question, scored_chunks):
    if not scored_chunks:
        return "I don't have enough information to answer that. Please contact Yonas directly at yonassahile8@gmail.com."

    best_chunk, best_score = scored_chunks[0]

    # Collect all chunks above a lower threshold to combine context
    THRESHOLD = 0.30
    relevant = [(chunk, score) for chunk, score in scored_chunks if score >= THRESHOLD]

    if not relevant:
        return (
            "I'm not sure about that. I only know specific facts about Yonas. "
            "Try asking about his work, skills, projects, or how to contact him."
        )

    question_lower = question.lower()

    # --- Contact / email intent ---
    if any(w in question_lower for w in ["email", "contact", "reach", "message", "phone"]):
        return "You can reach Yonas at yonassahile8@gmail.com."

    # --- Skills intent ---
    if any(w in question_lower for w in ["skill", "know", "language", "tech", "stack", "use", "work with"]):
        skill_chunks = [c for c, _ in relevant if any(
            w in c.lower() for w in ["skill", "python", "typescript", "docker", "kubernetes", "aws", "fluent", "golang"]
        )]
        if skill_chunks:
            return " ".join(skill_chunks)

    # --- Projects intent ---
    if any(w in question_lower for w in ["project", "built", "build", "created", "made", "app", "tool", "system"]):
        project_chunks = [c for c, _ in relevant if any(
            w in c.lower() for w in ["built", "project", "created", "dashboard", "netscanner", "zero-trust", "osint"]
        )]
        if project_chunks:
            return " ".join(project_chunks)

    # --- Who is / general identity ---
    if any(w in question_lower for w in ["who", "introduce", "yourself", "background", "about"]):
        identity_chunks = [c for c, _ in relevant if any(
            w in c.lower() for w in ["cybersecurity", "engineer", "architect", "specializes", "full-stack"]
        )]
        if identity_chunks:
            return " ".join(identity_chunks)

    # --- Language / spoken languages ---
    if any(w in question_lower for w in ["speak", "language", "fluent", "amharic", "english", "oromo"]):
        for chunk, _ in relevant:
            if "fluent" in chunk.lower():
                return chunk

    # --- Fallback: return best semantic match if score is decent ---
    if best_score >= 0.35:
        # Combine top 2 chunks if both are relevant enough
        top_chunks = [c for c, s in scored_chunks[:2] if s >= 0.32]
        if top_chunks:
            return " ".join(top_chunks)

    return (
        "I'm not sure about that specific detail. "
        "Try asking about Yonas's skills, projects, background, or contact info."
    )
