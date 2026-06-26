from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from .services import vector_store
from .answer_generator import generate_response

import tempfile
import base64
import os
from gtts import gTTS


# ── Existing AI Chat endpoint ─────────────────────────────────────────────
@api_view(['POST'])
def chat_text(request):
    message = request.data.get('message', '').strip()
    if not message:
        return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)

    scored_chunks = vector_store.search(message, top_k=3)
    answer = generate_response(message, scored_chunks)
    return Response({'text': answer})


# ── High‑quality Text‑to‑Speech endpoint (uses gTTS) ─────────────────────
@csrf_exempt
@api_view(['POST'])
@authentication_classes([])          # disable all authentication
@permission_classes([AllowAny])      # allow any request
def tts(request):
    text = request.data.get('text', '')
    lang = request.data.get('lang', 'en')
    if not text:
        return Response({'error': 'Text required'}, status=400)

    try:
        tts = gTTS(text=text, lang=lang)
        with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as fp:
            tts.save(fp.name)
            fp.seek(0)
            audio_bytes = fp.read()
        os.unlink(fp.name)

        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
        return Response({'audio_base64': audio_base64})
    except Exception as e:
        return Response({'error': str(e)}, status=500)
