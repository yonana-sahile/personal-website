from django.urls import path
from . import views

urlpatterns = [
    path('chat/text/', views.chat_text, name='chat_text'),
]
