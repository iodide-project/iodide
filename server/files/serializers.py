from rest_framework import serializers

from .models import File


class FilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ("id", "notebook_id", "filename", "last_updated")
