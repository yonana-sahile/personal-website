from django.urls import path
from . import views

urlpatterns = [
    path('chat/text/', views.chat_text, name='chat_text'),
    path('gtts-robot/', views.gtts_robot, name='gtts-robot'),
    path('contact/', views.contact, name='contact'),   # ← new
]
