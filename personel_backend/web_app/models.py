from django.db import models

class ContactMessage(models.Model):
    name = models.CharField(max_length=100, blank=True)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.email} - {self.created_at}'


class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    tech = models.JSONField(default=list)        # list of strings like ["React", "Node.js"]
    type = models.CharField(max_length=50, default='Custom')
    color = models.CharField(max_length=20, default='cyber-blue')
    image = models.TextField(blank=True)          # base64 or URL
    github = models.URLField(blank=True, default='#')
    link = models.URLField(blank=True, default='#')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class CV(models.Model):
    url = models.TextField(blank=True)   # base64 or file URL
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'CV updated at {self.updated_at}'
