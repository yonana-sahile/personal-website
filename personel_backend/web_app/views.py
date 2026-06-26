from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from .services import vector_store
from .answer_generator import generate_response

import tempfile
import base64
import os
import pyttsx3


# ── Existing AI Chat endpoint ─────────────────────────────────────────────
@api_view(['POST'])
def chat_text(request):
    message = request.data.get('message', '').strip()
    if not message:
        return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)

    scored_chunks = vector_store.search(message, top_k=3)
    answer = generate_response(message, scored_chunks)
    return Response({'text': answer})


# ── NEW Text‑to‑Speech endpoint (offline with pyttsx3) ────────────────────
@csrf_exempt
@api_view(['POST'])
def tts(request):
    text = request.data.get('text', '')
    lang = request.data.get('lang', 'en')   # pyttsx3 uses system voices; lang is ignored for now
    if not text:
        return Response({'error': 'Text required'}, status=400)

    try:
        engine = pyttsx3.init()

        # Create a temporary file to save the audio
        with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as fp:
            temp_name = fp.name

        engine.save_to_file(text, temp_name)
        engine.runAndWait()

        # Read the generated audio
        with open(temp_name, 'rb') as f:
            audio_bytes = f.read()
        os.unlink(temp_name)

        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
        return Response({'audio_base64': audio_base64})
    except Exception as e:
        return Response({'error': str(e)}, status=500)
