from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from .services import vector_store
from .answer_generator import generate_response

import subprocess
import tempfile
import base64
import os


# ── Existing AI Chat endpoint ─────────────────────────────────────────────
@api_view(['POST'])
def chat_text(request):
    message = request.data.get('message', '').strip()
    if not message:
        return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)

    scored_chunks = vector_store.search(message, top_k=3)
    answer = generate_response(message, scored_chunks)
    return Response({'text': answer})


# ── Stable Text‑to‑Speech endpoint (uses system espeak) ───────────────────
@csrf_exempt
@api_view(['POST'])
def tts(request):
    text = request.data.get('text', '')
    lang = request.data.get('lang', 'en')
    if not text:
        return Response({'error': 'Text required'}, status=400)

    # Map language codes to espeak voices (fallback to English if not available)
    voice_map = {
        'en': 'english-us',
        'am': 'amharic',
        'om': 'oromo',
        'ti': 'tigrinya',
    }
    voice = voice_map.get(lang, 'english-us')

    try:
        # Create a temporary WAV file
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as fp:
            wav_path = fp.name

        # Run espeak to generate speech
        cmd = ['espeak', '-w', wav_path, '-v', voice, '--', text]
        subprocess.run(cmd, check=True, capture_output=True)

        # Read the generated audio and encode it
        with open(wav_path, 'rb') as f:
            audio_bytes = f.read()
        os.unlink(wav_path)

        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
        return Response({'audio_base64': audio_base64})

    except subprocess.CalledProcessError as e:
        # If espeak fails, return the error message
        error_msg = e.stderr.decode() if e.stderr else str(e)
        return Response({'error': f'espeak failed: {error_msg}'}, status=500)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
