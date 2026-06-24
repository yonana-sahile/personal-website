def generate_response(question, scored_chunks):
    if not scored_chunks:
        return "I don't have enough information to answer that. Please contact Yonas directly."

    best_chunk, best_score = scored_chunks[0]

    # If the best match is too weak, politely refuse
    if best_score < 0.4:
        return "I'm not sure about that. I only know specific facts about Yonas. Try asking about his work, skills, or projects."

    # Combine up to two strong chunks
    if len(scored_chunks) >= 2 and scored_chunks[1][1] > 0.3:
        return best_chunk + " " + scored_chunks[1][0]
    return best_chunk
