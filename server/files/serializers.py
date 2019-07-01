from rest_framework import serializers

from ..notebooks.models import Notebook
from .models import (File, FileSource)


class FilesSerializer(serializers.ModelSerializer):
    """
    Gives a summary of file (not its content)
    """
    class Meta:
        model = File
        fields = ("id", "notebook_id", "filename", "last_updated")


class FileSourceSerializer(serializers.ModelSerializer):
    """
    All the properties of a file source, which can be used to retrieve or
    update a file from a URL
    """
    notebook_id = serializers.PrimaryKeyRelatedField(
        source="notebook", queryset=Notebook.objects.all())


    class Meta:
        model = FileSource
        fields = ("id", "notebook_id", "file_id", "filename", "source", "update_interval")
