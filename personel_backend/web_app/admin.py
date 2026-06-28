from django.contrib import admin
from .models import ContactMessage, Project, CV

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'created_at')
    readonly_fields = ('created_at',)

@admin.register(CV)
class CVAdmin(admin.ModelAdmin):
    list_display = ('id', 'updated_at')
