import re

# Simple list of words to ignore when checking overlap
STOP_WORDS = {
    "a", "an", "the", "is", "are", "was", "were", "does", "do", "did",
    "what", "who", "where", "when", "why", "how", "tell", "me", "about",
    "of", "to", "in", "for", "on", "with", "and", "or", "that", "this",
    "yonas", "sahile", "he", "his", "him", "i", "you", "can", "get",
    "email", "contact", "phone", "number"   # optionally keep these if they are common
}

def get_keywords(text):
    """Extract meaningful words from a text."""
    words = re.findall(r'\b[a-z]+\b', text.lower())
    return {w for w in words if w not in STOP_WORDS and len(w) > 1}

def generate_response(question, scored_chunks):
    if not scored_chunks:
        return "I don't have enough information to answer that. Please contact Yonas directly."

    best_chunk, best_score = scored_chunks[0]

    # Absolute minimum threshold – very low, just to filter noise
    if best_score < 0.45:
        return "I'm not sure about that. I only know specific facts about Yonas. Try asking about his work, skills, or projects."

    # Check keyword overlap between question and the best chunk
    question_keywords = get_keywords(question)
    chunk_keywords = get_keywords(best_chunk)

    if question_keywords & chunk_keywords:   # at least one common meaningful word
        return best_chunk
    else:
        return "I'm not sure about that. I only know specific facts about Yonas. Try asking about his work, skills, or projects."
