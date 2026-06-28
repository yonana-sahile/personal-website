from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .services import vector_store
from .answer_generator import generate_response
from .models import Project, CV
from .serializers import ProjectSerializer, CVSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

import tempfile
import base64
import os
from gtts import gTTS


# ── Text Chat endpoint ────────────────────────────────────────────────────────
@api_view(['POST'])
def chat_text(request):
    # ... unchanged ...
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
    # ... unchanged ...
    text = request.data.get('text', '').strip()
    lang = request.data.get('lang', 'en').strip()

    if not text:
        return Response({'error': 'Text is required'}, status=status.HTTP_400_BAD_REQUEST)

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


# ── Contact Form endpoint ─────────────────────────────────────────────────────
@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def contact(request):
    # ... unchanged ...
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


# ── Admin Authentication endpoint ─────────────────────────────────────────────
@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})
    return Response({'error': 'Invalid credentials'}, status=401)


# ── Project management (protected) ────────────────────────────────────────────

# Public: list all projects
@api_view(['GET'])
def list_projects(request):
    projects = Project.objects.all().order_by('-created_at')
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)


# Protected: add a new project
@csrf_exempt
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_project(request):
    serializer = ProjectSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# Protected: delete a project
@csrf_exempt
@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_project(request, pk):
    try:
        project = Project.objects.get(pk=pk)
        project.delete()
        return Response({'success': True})
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=404)


# ── CV management (protected) ────────────────────────────────────────────────

# Public: get current CV URL
@api_view(['GET'])
def get_cv(request):
    cv = CV.objects.first()
    return Response({'url': cv.url if cv else ''})


# Protected: upload/update CV
@csrf_exempt
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def upload_cv(request):
    url = request.data.get('url', '')
    cv, _ = CV.objects.get_or_create(id=1)
    cv.url = url
    cv.save()
    return Response({'url': cv.url})
