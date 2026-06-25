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

# ── Intent map ────────────────────────────────────────────────────────────────
INTENTS = {
    "contact": {
        "triggers": ["email", "contact", "reach", "message", "phone", "dm", "hire", "connect"],
        "chunk_keywords": ["email", "contact", "reach", "yonassahile8"],
        "response": (
            "📬 **You can reach Yonas directly at:**\n\n"
            "✉️  yonassahile8@gmail.com\n\n"
            "He's open to freelance work, collaborations, and job opportunities. Don't hesitate to drop him a message! 🤝"
        )
    },
    "skills": {
        "triggers": ["skill", "know", "tech", "stack", "technology", "language", "programming", "framework", "tool", "use", "familiar", "experience", "expertise"],
        "chunk_keywords": ["python", "typescript", "docker", "kubernetes", "aws", "golang", "react", "node"],
        "response": None  # built dynamically
    },
    "projects": {
        "triggers": ["project", "built", "build", "created", "made", "app", "tool", "system", "work", "portfolio", "showcase"],
        "chunk_keywords": ["built", "project", "created", "dashboard", "netscanner", "zero-trust", "osint", "protocol"],
        "response": None  # built dynamically
    },
    "identity": {
        "triggers": ["who", "introduce", "yourself", "background", "about", "overview", "summary", "person", "engineer", "developer"],
        "chunk_keywords": ["cybersecurity", "engineer", "architect", "specializes", "full-stack", "background"],
        "response": None  # built dynamically
    },
    "languages_spoken": {
        "triggers": ["speak", "spoken", "language", "fluent", "amharic", "english", "oromo", "tigrinya", "multilingual"],
        "chunk_keywords": ["fluent", "amharic", "oromo", "tigrinya", "english"],
        "response": None  # built dynamically
    },
    "zero_trust": {
        "triggers": ["zero", "trust", "protocol", "grpc", "golang"],
        "chunk_keywords": ["zero-trust", "golang", "grpc"],
        "response": None
    },
    "netscanner": {
        "triggers": ["netscanner", "network", "ids", "ips", "passive", "map", "scanner"],
        "chunk_keywords": ["netscanner", "passive", "network", "ids", "ips"],
        "response": None
    },
    "osint": {
        "triggers": ["osint", "dashboard", "intelligence", "elasticsearch", "real-time"],
        "chunk_keywords": ["osint", "dashboard", "elasticsearch", "real-time"],
        "response": None
    },
}

# ── Unknown / out-of-scope topics ─────────────────────────────────────────────
UNKNOWN_TRIGGERS = {
    "age":      ["old", "age", "born", "birth", "year old", "birthday"],
    "location": ["live", "location", "city", "country", "based", "where", "address", "from"],
    "salary":   ["salary", "earn", "pay", "income", "wage", "money", "rate", "charge"],
    "education":["study", "studied", "university", "college", "degree", "school", "graduate"],
    "social":   ["twitter", "linkedin", "instagram", "github", "facebook", "social media"],
}

UNKNOWN_RESPONSES = {
    "age":       "🤷 I don't have information about Yonas's age. That's kept private! Try asking about his skills or projects instead. 😊",
    "location":  "📍 Yonas's exact location isn't something I can share. But you can reach him at ✉️ yonassahile8@gmail.com!",
    "salary":    "💰 That's confidential! But if you're interested in hiring Yonas, reach out at ✉️ yonassahile8@gmail.com to discuss rates. 😄",
    "education": "🎓 I don't have details about Yonas's formal education right now. Ask him directly at ✉️ yonassahile8@gmail.com!",
    "social":    "🌐 I don't have Yonas's social media links handy. Best way to connect: ✉️ yonassahile8@gmail.com",
}

# ── Smart response builders ────────────────────────────────────────────────────
def build_identity_response(relevant_chunks):
    lines = [c for c, _ in relevant_chunks if any(
        w in c.lower() for w in ["cybersecurity", "engineer", "architect", "specializes", "full-stack", "background"]
    )]
    if not lines:
        lines = [relevant_chunks[0][0]]
    return (
        "👨‍💻 **Meet Yonas Sahile!**\n\n"
        + " ".join(lines) + "\n\n"
        "He's passionate about building secure, scalable systems — bridging the gap between "
        "offensive security and modern software engineering. 🔐🚀\n\n"
        "Feel free to ask me about his **skills**, **projects**, or how to **contact him**!"
    )

def build_skills_response(relevant_chunks):
    return (
        "🛠️ **Yonas's Technical Skills:**\n\n"
        "**Languages & Frameworks:**\n"
        "• 🐍 Python\n"
        "• 📘 TypeScript\n"
        "• 🔵 Golang\n"
        "• ⚛️  React & Node.js\n\n"
        "**DevOps & Cloud:**\n"
        "• 🐳 Docker\n"
        "• ☸️  Kubernetes\n"
        "• ☁️  AWS\n\n"
        "**Security:**\n"
        "• 🔍 Penetration Testing\n"
        "• 🛡️  Network Security\n"
        "• ☁️  Cloud Infrastructure\n\n"
        "He's a well-rounded engineer who can go from writing exploit code to deploying cloud infrastructure! 💪"
    )

def build_projects_response(relevant_chunks):
    return (
        "🚀 **Yonas's Projects:**\n\n"
        "**1. 🔐 Zero-Trust Protocol**\n"
        "A secure communication system built with Golang and gRPC. Designed around zero-trust architecture principles.\n\n"
        "**2. 🌐 NetScanner v2**\n"
        "A passive network mapping tool that detects and maps networks without triggering IDS/IPS systems. Stealth mode ON! 🕵️\n\n"
        "**3. 📊 OSINT Dashboard**\n"
        "A real-time open-source intelligence dashboard built with React, Node.js, and Elasticsearch.\n\n"
        "Want to know more about any specific project? Just ask! 😊"
    )

def build_languages_response(relevant_chunks):
    return (
        "🌍 **Languages Yonas speaks:**\n\n"
        "• 🇪🇹 Amharic\n"
        "• 🇬🇧 English\n"
        "• 🟢 Oromo\n"
        "• 🔵 Tigrinya\n\n"
        "Yonas is fluent in **4 languages** — making him a great communicator across diverse teams! 🤝"
    )

def build_zerotrust_response(relevant_chunks):
    return (
        "🔐 **Zero-Trust Protocol**\n\n"
        "One of Yonas's flagship projects! It's a secure communication system built using **Golang** and **gRPC**.\n\n"
        "It follows zero-trust architecture — meaning *no implicit trust*, every request is verified. "
        "Perfect for high-security environments. 🛡️\n\n"
        "Want to know about his other projects? Ask away! 🚀"
    )

def build_netscanner_response(relevant_chunks):
    return (
        "🌐 **NetScanner v2**\n\n"
        "A stealth network mapping tool built by Yonas. It passively maps networks **without triggering IDS/IPS** systems — "
        "making it invisible to most security monitoring tools. 🕵️‍♂️\n\n"
        "This is a great example of Yonas's deep understanding of both offensive and defensive security. 🔍"
    )

def build_osint_response(relevant_chunks):
    return (
        "📊 **OSINT Dashboard**\n\n"
        "Yonas built a real-time **Open Source Intelligence (OSINT)** dashboard using:\n\n"
        "• ⚛️  React (frontend)\n"
        "• 🟢 Node.js (backend)\n"
        "• 🔍 Elasticsearch (search & analytics)\n\n"
        "It aggregates and visualizes intelligence data in real time — super powerful for security research! 🚀"
    )

# ── Main entry point ───────────────────────────────────────────────────────────
def generate_response(question, scored_chunks):
    q = question.lower().strip()

    # 1. Check for unknown / out-of-scope topics first
    for topic, triggers in UNKNOWN_TRIGGERS.items():
        if any(t in q for t in triggers):
            return UNKNOWN_RESPONSES[topic]

    # 2. Check for hardcoded contact intent
    if any(t in q for t in INTENTS["contact"]["triggers"]):
        return INTENTS["contact"]["response"]

    # 3. Collect relevant chunks above threshold
    THRESHOLD = 0.28
    relevant = [(c, s) for c, s in scored_chunks if s >= THRESHOLD]

    if not relevant and scored_chunks:
        relevant = [scored_chunks[0]]  # always use best even if low

    # 4. Match other intents
    if any(t in q for t in INTENTS["zero_trust"]["triggers"]):
        return build_zerotrust_response(relevant)

    if any(t in q for t in INTENTS["netscanner"]["triggers"]):
        return build_netscanner_response(relevant)

    if any(t in q for t in INTENTS["osint"]["triggers"]):
        return build_osint_response(relevant)

    if any(t in q for t in INTENTS["projects"]["triggers"]):
        return build_projects_response(relevant)

    if any(t in q for t in INTENTS["skills"]["triggers"]):
        return build_skills_response(relevant)

    if any(t in q for t in INTENTS["languages_spoken"]["triggers"]):
        return build_languages_response(relevant)

    if any(t in q for t in INTENTS["identity"]["triggers"]):
        return build_identity_response(relevant)

    # 5. Semantic fallback — use best chunk if score is decent
    if scored_chunks and scored_chunks[0][1] >= 0.35:
        best = scored_chunks[0][0]
        return f"🤖 Here's what I know:\n\n{best}\n\nWant to know more? Ask me about Yonas's **skills**, **projects**, or **contact info**! 😊"

    # 6. True fallback
    return (
        "🤔 Hmm, I'm not sure about that one! I'm specifically trained on Yonas's professional profile.\n\n"
        "Here's what I *can* help you with:\n"
        "• 👨‍💻 His background & expertise\n"
        "• 🛠️  His technical skills\n"
        "• 🚀 His projects\n"
        "• 📬 How to contact him\n\n"
        "Try asking one of those! 😊"
    )
