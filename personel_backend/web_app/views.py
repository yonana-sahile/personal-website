from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .services import vector_store
from .answer_generator import generate_response

@api_view(['POST'])
def chat_text(request):
    message = request.data.get('message', '').strip()
    if not message:
        return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)

    chunks = vector_store.search(message, top_k=3)
    answer = generate_response(message, chunks)
    return Response({'text': answer})
