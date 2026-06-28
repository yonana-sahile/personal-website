from rest_framework import serializers
from .models import Project, CV

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class CVSerializer(serializers.ModelSerializer):
    class Meta:
        model = CV
        fields = '__all__'
