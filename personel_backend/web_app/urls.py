from django.urls import path
from . import views

urlpatterns = [
    path('chat/text/', views.chat_text, name='chat_text'),
    path('gtts-robot/', views.gtts_robot, name='gtts-robot'),
    path('contact/', views.contact, name='contact'),

    # Auth
    path('auth/login/', views.login_view, name='login'),
    path('auth/forgot-password/', views.forgot_password, name='forgot_password'),   # new
    path('auth/reset-password/', views.reset_password, name='reset_password'),     # new

    # Projects (public list, protected add/delete)
    path('projects/', views.list_projects, name='list_projects'),
    path('projects/add/', views.add_project, name='add_project'),
    path('projects/<int:pk>/delete/', views.delete_project, name='delete_project'),

    # CV (public get, protected upload)
    path('cv/', views.get_cv, name='get_cv'),
    path('cv/upload/', views.upload_cv, name='upload_cv'),
    path('certificates/', views.list_certificates, name='list_certificates'),
    path('certificates/add/', views.add_certificate, name='add_certificate'),
    path('certificates/<int:pk>/delete/', views.delete_certificate, name='delete_certificate'),
]
