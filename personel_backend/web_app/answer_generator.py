import re
import random

# ── Stop words ────────────────────────────────────────────────────────────────
STOP_WORDS = {
    "a", "an", "the", "is", "are", "was", "were", "does", "do", "did",
    "what", "who", "where", "when", "why", "how", "tell", "me", "about",
    "of", "to", "in", "for", "on", "with", "and", "or", "that", "this",
    "yonas", "sahile", "he", "his", "him", "i", "you", "can", "get",
    "email", "contact", "phone", "number", "please", "just", "really",
    "very", "want", "know", "like", "help"
}

def get_keywords(text):
    words = re.findall(r'\b[a-z]+\b', text.lower())
    return {w for w in words if w not in STOP_WORDS and len(w) > 1}


# ── Greeting variations ───────────────────────────────────────────────────────
GREETINGS = [
    "👋 Hey there! I'm Yonas's AI assistant. I'm here to tell you everything about his skills, projects, and experience.\n\nWhat would you like to know? 😊",
    "Hello! 👋 Great to have you here. I can fill you in on Yonas's background, technical expertise, projects, and more.\n\nFeel free to ask anything! 🚀",
    "Hi there! 😊 I'm the AI assistant for Yonas Sahile's portfolio. Ask me about his skills, projects, or how to get in touch with him!",
]

THANKS_RESPONSES = [
    "You're very welcome! 😊 Is there anything else you'd like to know about Yonas?",
    "Happy to help! 🙌 Feel free to ask anything else about Yonas's work or experience.",
    "Anytime! 😄 Don't hesitate to ask if you have more questions.",
]

FAREWELL_RESPONSES = [
    "Goodbye! 👋 Thanks for stopping by. Hope to see you again soon!",
    "Take care! 🙌 If you ever want to know more about Yonas, feel free to come back anytime.",
    "Bye! 😊 Have a wonderful day. Don't forget — you can always reach Yonas at yonassahile8@gmail.com!",
]


# ── Unknown / private topic responses ────────────────────────────────────────
UNKNOWN_TRIGGERS = {
    "age":        ["old", "age", "born", "birth", "birthday", "how old"],
    "location":   ["live", "location", "city", "country", "based", "where from", "hometown", "address", "reside"],
    "salary":     ["salary", "earn", "pay", "income", "wage", "money", "rate", "charge", "cost", "fee", "price"],
    "education":  ["study", "studied", "university", "college", "degree", "school", "graduate", "phd", "masters", "bachelor"],
    "social":     ["twitter", "linkedin", "instagram", "github", "facebook", "social media", "profile", "handle"],
    "personal":   ["girlfriend", "wife", "husband", "family", "married", "relationship", "kids", "children", "hobby", "hobbies"],
}

UNKNOWN_RESPONSES = {
    "age": (
        "🤷 That's a personal detail Yonas keeps private — and honestly, age is just a number! 😄\n\n"
        "What *really* matters is what he can do. Want to explore his **skills** or **projects** instead?"
    ),
    "location": (
        "📍 Yonas's exact location is kept private, but here's the good news — **he's available remotely** "
        "and open to international opportunities! 🌍\n\n"
        "Want to get in touch? Reach him at ✉️ **yonassahile8@gmail.com**"
    ),
    "salary": (
        "💼 That's something best discussed directly between you and Yonas!\n\n"
        "He's open to freelance projects, consulting, and full-time roles. "
        "Reach out at ✉️ **yonassahile8@gmail.com** to discuss details. 🤝"
    ),
    "education": (
        "🎓 I don't have details on Yonas's formal education in my knowledge base right now.\n\n"
        "For the full story, feel free to reach out to him directly at ✉️ **yonassahile8@gmail.com** — "
        "he'd love to tell you more! 😊"
    ),
    "social": (
        "🌐 I don't have Yonas's social media profiles in my knowledge base currently.\n\n"
        "The best way to connect with him professionally is via ✉️ **yonassahile8@gmail.com** — "
        "he typically responds within 24 hours! ⚡"
    ),
    "personal": (
        "😄 That's a bit personal — I'll let Yonas keep that to himself!\n\n"
        "But I *can* tell you a lot about his professional side. "
        "Want to know about his **skills**, **projects**, or **experience**?"
    ),
}


# ── Response builders ─────────────────────────────────────────────────────────

def build_identity_response():
    return (
        "👨‍💻 **Yonas Sahile — Cybersecurity Architect & Full-Stack Engineer**\n\n"
        "Yonas is a highly skilled professional who sits at the intersection of **offensive security** "
        "and **modern software engineering** — a rare and powerful combination.\n\n"
        "🔐 **What he does:**\n"
        "• Designs and builds secure, scalable systems from the ground up\n"
        "• Conducts penetration testing, ethical hacking, and security audits\n"
        "• Architects cloud infrastructure with a security-first mindset\n"
        "• Develops full-stack web applications with clean, production-grade code\n\n"
        "🌍 He's fluent in **4 languages**, available remotely, and passionate about making "
        "the digital world more secure.\n\n"
        "Want to know more? Ask about his **skills**, **projects**, or **how to hire him**! 🚀"
    )


def build_skills_response(focus=None):
    if focus == "python":
        return (
            "🐍 **Yes! Python is one of Yonas's core languages.**\n\n"
            "He uses Python for:\n"
            "• 🔧 Security tooling & automation scripts\n"
            "• 🤖 Building AI/ML pipelines and data processing tools\n"
            "• 🌐 Backend APIs with Django and FastAPI\n"
            "• 🔍 Penetration testing scripts and exploit development\n\n"
            "He also knows TypeScript, Golang, and more. Want the full skill breakdown? 😊"
        )
    if focus == "golang":
        return (
            "🔵 **Golang (Go) is one of Yonas's favorite languages!**\n\n"
            "He uses it for:\n"
            "• ⚡ High-performance backend services\n"
            "• 🔐 Security tools like Zero-Trust Protocol\n"
            "• 🌐 gRPC microservices and concurrent systems\n\n"
            "Go's speed and concurrency model make it perfect for the kind of systems Yonas builds. 🚀"
        )
    if focus == "cloud":
        return (
            "☁️ **Yonas is experienced with cloud infrastructure, primarily AWS.**\n\n"
            "His cloud skills include:\n"
            "• 🖥️  EC2, S3, Lambda, VPC, IAM\n"
            "• 🐳 Docker & Kubernetes for container orchestration\n"
            "• ⚙️  Terraform and Infrastructure as Code (IaC)\n"
            "• 🔄 CI/CD pipelines with GitHub Actions\n"
            "• 🛡️  Cloud security hardening and compliance\n\n"
            "He designs cloud systems with a **security-first** approach. 🔐"
        )

    return (
        "🛠️ **Yonas's Technical Skill Set**\n\n"
        "**💻 Languages & Frameworks:**\n"
        "• 🐍 Python — automation, security tooling, backend APIs\n"
        "• 📘 TypeScript — scalable frontend & Node.js backend\n"
        "• 🔵 Golang — high-performance services, gRPC, security tools\n"
        "• ⚛️  React — modern, responsive web UIs\n"
        "• 🟢 Node.js — real-time servers and REST APIs\n\n"
        "**☁️ Cloud & DevOps:**\n"
        "• 🐳 Docker & ☸️ Kubernetes — containerization & orchestration\n"
        "• ☁️ AWS (EC2, S3, Lambda, VPC, IAM)\n"
        "• ⚙️ Terraform, GitHub Actions, CI/CD pipelines\n\n"
        "**🔐 Cybersecurity:**\n"
        "• Penetration Testing & Ethical Hacking\n"
        "• Red Teaming & Threat Modeling\n"
        "• Zero-Trust Architecture & Cloud Security\n"
        "• IDS/IPS, Vulnerability Assessment, Incident Response\n\n"
        "**🗄️ Databases:**\n"
        "• PostgreSQL, MongoDB, Redis, Elasticsearch\n\n"
        "He's a **full-stack security engineer** — rare, versatile, and production-ready. 💪"
    )


def build_projects_response():
    return (
        "🚀 **Yonas's Project Portfolio**\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
        "**🔐 1. Zero-Trust Protocol**\n"
        "*Tech: Golang, gRPC, mutual TLS*\n"
        "A high-security communication framework built on zero-trust principles. "
        "Every request is authenticated, authorized, and encrypted — no implicit trust, ever. "
        "Designed for enterprise-grade security environments.\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
        "**🌐 2. NetScanner v2**\n"
        "*Tech: Python, passive network analysis*\n"
        "A stealth network reconnaissance tool used by security professionals. "
        "It maps networks, identifies devices, and discovers open ports — all without triggering "
        "IDS/IPS detection systems. 🕵️‍♂️\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
        "**📊 3. Real-Time OSINT Dashboard**\n"
        "*Tech: React, Node.js, Elasticsearch*\n"
        "A powerful open-source intelligence platform that aggregates data from public sources, "
        "correlates threats in real time, and visualizes results through an interactive dashboard.\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
        "**+ More:** Custom IDS, JWT auth microservice, cloud cost optimizer, and open-source contributions.\n\n"
        "Interested in a specific project? Just ask! 😊"
    )


def build_zerotrust_response():
    return (
        "🔐 **Zero-Trust Protocol — Deep Dive**\n\n"
        "**What is it?**\n"
        "A production-grade secure communication system built by Yonas using **Golang** and **gRPC**.\n\n"
        "**Core Principles:**\n"
        "• 🚫 *Never trust, always verify* — no implicit access\n"
        "• 🔑 Mutual TLS (mTLS) for bidirectional authentication\n"
        "• 🪙 Token-based authorization on every request\n"
        "• 🔒 End-to-end encryption for all data in transit\n\n"
        "**Why it matters:**\n"
        "Traditional security assumes everything inside a network is safe. "
        "Zero-trust assumes the opposite — making it far more resilient against insider threats "
        "and lateral movement attacks. 🛡️\n\n"
        "This project showcases Yonas's ability to architect **enterprise-level security systems** from scratch."
    )


def build_netscanner_response():
    return (
        "🌐 **NetScanner v2 — Deep Dive**\n\n"
        "**What is it?**\n"
        "A professional-grade **passive network reconnaissance tool** built for penetration testers and red teams.\n\n"
        "**Key Features:**\n"
        "• 🕵️ Passive fingerprinting — identifies OS, services, and devices\n"
        "• 🔍 Maps entire network topologies silently\n"
        "• 🛡️ Bypasses IDS/IPS detection completely\n"
        "• 📡 Analyzes network traffic patterns without sending a single probe\n\n"
        "**Why it's impressive:**\n"
        "Most network scanners (like Nmap) actively probe targets and get flagged immediately. "
        "NetScanner v2 stays completely invisible — making it a powerful tool for real-world "
        "red team engagements. 🎯\n\n"
        "This shows Yonas's deep understanding of **network protocols** and **offensive security**."
    )


def build_osint_response():
    return (
        "📊 **Real-Time OSINT Dashboard — Deep Dive**\n\n"
        "**What is it?**\n"
        "A full-stack **Open Source Intelligence (OSINT)** platform for security researchers and analysts.\n\n"
        "**Tech Stack:**\n"
        "• ⚛️  React — interactive, real-time frontend UI\n"
        "• 🟢 Node.js — high-performance backend API\n"
        "• 🔍 Elasticsearch — lightning-fast search and data indexing\n\n"
        "**What it does:**\n"
        "• 🌐 Aggregates data from multiple public intelligence sources\n"
        "• ⚡ Processes and correlates threat data in real time\n"
        "• 🗺️  Visualizes entity relationships and threat patterns\n"
        "• 🔔 Provides automated alerts on emerging threats\n\n"
        "**Impact:**\n"
        "This tool dramatically reduces the time security analysts spend on manual research — "
        "turning hours of OSINT gathering into seconds. 🚀"
    )


def build_languages_response():
    return (
        "🌍 **Languages Yonas Speaks:**\n\n"
        "• 🇪🇹 **Amharic** — Native\n"
        "• 🇬🇧 **English** — Professional fluency (primary working language)\n"
        "• 🟢 **Oromo** — Fluent\n"
        "• 🔵 **Tigrinya** — Fluent\n\n"
        "Speaking **4 languages** makes Yonas an exceptional communicator "
        "who can collaborate effectively across diverse, multicultural teams — "
        "a genuine advantage in today's global tech industry. 🤝"
    )


def build_contact_response():
    return (
        "📬 **Get in Touch with Yonas**\n\n"
        "The best way to reach him is via email:\n\n"
        "✉️  **yonassahile8@gmail.com**\n\n"
        "**He's open to:**\n"
        "• 💼 Full-time roles (remote & on-site)\n"
        "• 🔐 Security consulting & audits\n"
        "• 🤝 Freelance & contract projects\n"
        "• 🚀 Technical collaborations\n"
        "• 💬 Networking & knowledge sharing\n\n"
        "⚡ He typically responds within **24 hours**. Don't hesitate to reach out!"
    )


def build_availability_response():
    return (
        "✅ **Yonas's Availability**\n\n"
        "Yonas is currently **open to new opportunities!** 🎉\n\n"
        "**What he's looking for:**\n"
        "• 🔐 Cybersecurity roles (pentesting, red team, security engineering)\n"
        "• 💻 Full-stack engineering positions\n"
        "• 🌍 Remote-friendly or international opportunities\n"
        "• 🤝 Freelance security consulting projects\n\n"
        "**To start a conversation:**\n"
        "✉️  **yonassahile8@gmail.com**\n\n"
        "He's professional, responsive, and brings both **technical depth** and "
        "**strong communication skills** to every team. 💪"
    )


def build_why_hire_response():
    return (
        "⭐ **Why Hire Yonas Sahile?**\n\n"
        "**1. 🔐 Rare Dual Expertise**\n"
        "Most engineers code. Most security experts audit. Yonas does *both* — "
        "he builds systems with security baked in from day one.\n\n"
        "**2. 🚀 Proven Project Portfolio**\n"
        "Real, production-quality projects: a zero-trust communication system, "
        "a stealth network scanner, and a live OSINT intelligence platform.\n\n"
        "**3. 🌍 Multilingual & Global**\n"
        "Fluent in 4 languages and available remotely — a natural fit for diverse, international teams.\n\n"
        "**4. ⚡ Fast, Clean, Production-Ready Code**\n"
        "He follows best practices: clean architecture, security-first design, CI/CD, and code review.\n\n"
        "**5. 💬 Strong Communicator**\n"
        "Technical skills + communication skills = someone who delivers *and* explains their work.\n\n"
        "Interested? Reach out at ✉️ **yonassahile8@gmail.com** 🤝"
    )


def build_experience_response():
    return (
        "💼 **Yonas's Professional Experience**\n\n"
        "Yonas has hands-on experience across multiple domains:\n\n"
        "**🔐 Cybersecurity:**\n"
        "• Penetration testing and vulnerability assessments\n"
        "• Red team operations and adversary simulation\n"
        "• Zero-trust architecture design\n"
        "• Intrusion detection and incident response\n\n"
        "**💻 Software Engineering:**\n"
        "• Full-stack web application development\n"
        "• RESTful APIs and gRPC microservices\n"
        "• Real-time systems with WebSockets\n"
        "• Cloud-native application deployment on AWS\n\n"
        "**🛠️ DevOps & Infrastructure:**\n"
        "• Containerization with Docker and Kubernetes\n"
        "• CI/CD automation with GitHub Actions\n"
        "• Infrastructure as Code with Terraform\n\n"
        "He brings **real-world, production-level experience** — not just theoretical knowledge. 🚀"
    )


# ── Main entry point ───────────────────────────────────────────────────────────
def generate_response(question, scored_chunks):
    q = question.lower().strip()
    q_clean = re.sub(r'[^\w\s]', '', q)

    # ── 1. Greetings ──────────────────────────────────────────────────────────
    greeting_words = ["hi", "hello", "hey", "greetings", "howdy", "sup", "good morning", "good afternoon", "good evening"]
    if any(q_clean.startswith(g) or q_clean == g for g in greeting_words):
        return random.choice(GREETINGS)

    # ── 2. Thanks ─────────────────────────────────────────────────────────────
    thanks_words = ["thank", "thanks", "thank you", "thx", "ty", "appreciate", "cheers"]
    if any(t in q_clean for t in thanks_words):
        return random.choice(THANKS_RESPONSES)

    # ── 3. Farewell ───────────────────────────────────────────────────────────
    farewell_words = ["bye", "goodbye", "see you", "later", "take care", "cya", "farewell"]
    if any(f in q_clean for f in farewell_words):
        return random.choice(FAREWELL_RESPONSES)

    # ── 4. Unknown / private topics ───────────────────────────────────────────
    for topic, triggers in UNKNOWN_TRIGGERS.items():
        if any(t in q for t in triggers):
            return UNKNOWN_RESPONSES[topic]

    # ── 5. Contact intent ─────────────────────────────────────────────────────
    if any(t in q for t in ["email", "contact", "reach", "message", "hire", "connect", "work with", "get in touch"]):
        return build_contact_response()

    # ── 6. Availability / hiring ──────────────────────────────────────────────
    if any(t in q for t in ["available", "availability", "open to work", "looking for", "open for"]):
        return build_availability_response()

    if any(t in q for t in ["why hire", "should i hire", "why choose", "what makes him", "recommend"]):
        return build_why_hire_response()

    # ── 7. Specific project deep-dives ────────────────────────────────────────
    if any(t in q for t in ["zero trust", "zero-trust", "zerotrust"]):
        return build_zerotrust_response()

    if any(t in q for t in ["netscanner", "net scanner", "network scanner", "ids", "ips", "passive scan"]):
        return build_netscanner_response()

    if any(t in q for t in ["osint", "intelligence dashboard", "open source intelligence", "elasticsearch dashboard"]):
        return build_osint_response()

    # ── 8. Projects (general) ─────────────────────────────────────────────────
    if any(t in q for t in ["project", "built", "build", "created", "made", "portfolio", "work", "showcase", "app", "tool", "system"]):
        return build_projects_response()

    # ── 9. Specific skill deep-dives ──────────────────────────────────────────
    if "python" in q:
        return build_skills_response(focus="python")

    if "golang" in q or "go lang" in q or " go " in q:
        return build_skills_response(focus="golang")

    if any(t in q for t in ["aws", "cloud", "docker", "kubernetes", "devops", "terraform"]):
        return build_skills_response(focus="cloud")

    # ── 10. Skills (general) ──────────────────────────────────────────────────
    if any(t in q for t in ["skill", "tech", "stack", "technology", "framework", "language", "programming",
                              "know", "expertise", "experience with", "familiar", "proficient", "capable"]):
        return build_skills_response()

    # ── 11. Languages spoken ──────────────────────────────────────────────────
    if any(t in q for t in ["speak", "spoken", "fluent", "amharic", "oromo", "tigrinya", "multilingual", "languages"]):
        return build_languages_response()

    # ── 12. Experience ────────────────────────────────────────────────────────
    if any(t in q for t in ["experience", "background", "career", "history", "worked", "professional"]):
        return build_experience_response()

    # ── 13. Identity / overview ───────────────────────────────────────────────
    if any(t in q for t in ["who", "about", "introduce", "overview", "summary", "tell me", "describe", "person"]):
        return build_identity_response()

    # ── 14. Semantic fallback ─────────────────────────────────────────────────
    THRESHOLD = 0.30
    relevant = [(c, s) for c, s in scored_chunks if s >= THRESHOLD]

    if relevant and scored_chunks[0][1] >= 0.38:
        best = scored_chunks[0][0]
        return (
            f"🤖 Here's what I found:\n\n"
            f"{best}\n\n"
            f"---\n"
            f"💡 Want to explore more? Try asking about Yonas's **skills**, **projects**, **experience**, or **how to contact him**!"
        )

    # ── 15. True fallback ─────────────────────────────────────────────────────
    return (
        "🤔 Hmm, I don't have specific information about that in my knowledge base.\n\n"
        "But here's what I *can* help you with:\n\n"
        "• 👨‍💻 **Who is Yonas?** — His background & expertise\n"
        "• 🛠️  **Skills** — Languages, frameworks, tools\n"
        "• 🚀 **Projects** — Zero-Trust Protocol, NetScanner v2, OSINT Dashboard\n"
        "• 💼 **Experience** — Cybersecurity & engineering background\n"
        "• 📬 **Contact** — How to hire or collaborate with Yonas\n\n"
        "Try one of these topics and I'll give you a detailed answer! 😊"
    )
