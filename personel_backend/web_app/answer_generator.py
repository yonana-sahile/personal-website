def generate_response(question, chunks):
    if not chunks:
        return "I don't have enough information to answer that. Please contact Yonas directly."
    if len(chunks) == 1:
        return chunks[0]
    return chunks[0] + " " + chunks[1]
