FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies (espeak for TTS, gcc for any compiled packages)
RUN apt-get update && apt-get install -y --no-install-recommends \
    espeak \
    gcc \
    libc6-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the ML model so it's ready instantly
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# Copy the whole project
COPY . .

EXPOSE 8000

# Start Django with runserver for development; switch to gunicorn for production
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
