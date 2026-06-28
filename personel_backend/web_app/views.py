from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
from .services import vector_store
from .answer_generator import generate_response

import tempfile
import base64
import os
from gtts import gTTS


# ── Text Chat endpoint ────────────────────────────────────────────────────────
@api_view(['POST'])
def chat_text(request):
    message = request.data.get('message', '').strip()
    if not message:
        return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)

    scored_chunks = vector_store.search(message, top_k=3)
    answer = generate_response(message, scored_chunks)
    return Response({'text': answer})


# ── Text-to-Speech endpoint ───────────────────────────────────────────────────
@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def gtts_robot(request):
    """
    Accepts { text: str, lang: str }
    Returns  { audio_base64: str }
    Lang codes: en, am, om, ti
    gTTS supported: en=English, am=Amharic, om=Oromo, ti=Tigrinya
    """
    text = request.data.get('text', '').strip()
    lang = request.data.get('lang', 'en').strip()

    if not text:
        return Response({'error': 'Text is required'}, status=status.HTTP_400_BAD_REQUEST)

    # Map short codes to gTTS language codes
    LANG_MAP = {
        'en': 'en',
        'am': 'am',
        'om': 'om',
        'ti': 'ti',
    }
    gtts_lang = LANG_MAP.get(lang, 'en')

    try:
        tts_obj = gTTS(text=text, lang=gtts_lang, slow=False)

        with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as fp:
            tts_obj.save(fp.name)
            tmp_path = fp.name

        with open(tmp_path, 'rb') as f:
            audio_bytes = f.read()

        os.unlink(tmp_path)

        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
        return Response({'audio_base64': audio_base64})

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ── Contact Form endpoint (sends email) ──────────────────────────────────────
@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def contact(request):
    name = request.data.get('name', '').strip()
    email = request.data.get('email', '').strip()
    message = request.data.get('message', '').strip()

    if not email or not message:
        return Response({'error': 'Email and message are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        send_mail(
            subject=f'Portfolio Message from {name or email}',
            message=f'From: {name} ({email})\n\n{message}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.CONTACT_EMAIL],
            fail_silently=False,
        )
        return Response({'success': True})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
