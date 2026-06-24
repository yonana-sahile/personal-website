def generate_response(question, scored_chunks):
    if not scored_chunks:
        return "I don't have enough information to answer that. Please contact Yonas directly."

    best_chunk, best_score = scored_chunks[0]

    if best_score < 0.6:   # ← raise to 0.6
        return "I'm not sure about that. I only know specific facts about Yonas. Try asking about his work, skills, or projects."

    return best_chunk
