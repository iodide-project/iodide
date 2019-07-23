from rest_framework import serializers

from ..notebooks.models import Notebook
from .models import File, FileSource, FileUpdateOperation


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
        source="notebook", queryset=Notebook.objects.all()
    )

    class Meta:
        model = FileSource
        fields = ("id", "notebook_id", "filename", "url", "update_interval")


class FileUpdateOperationSerializer(serializers.ModelSerializer):
    """
    Used for creating an operation to update a file source
    """

    class StatusField(serializers.ChoiceField):
        def to_representation(self, obj):
            return self._choices[obj]

    file_source_id = serializers.PrimaryKeyRelatedField(
        source="file_source", queryset=FileSource.objects.all()
    )
    status = StatusField(choices=FileUpdateOperation.OPERATION_STATUSES)

    class Meta:
        model = FileUpdateOperation
        fields = (
            "id",
            "file_source_id",
            "scheduled",
            "started",
            "ended",
            "status",
            "failure_reason",
        )


class FileUpdateOperationLatestSerializer(serializers.RelatedField):
    def get_attribute(self, obj):
        print('obJ!!!', obj)
        return FileUpdateOperation.objects.filter(file_source_id=obj.id).last()

    def to_representation(self, value):
        if value:
            return FileUpdateOperationSerializer(value).data

        return None


class FileSourceDetailSerializer(FileSourceSerializer):

    latest_file_update_operation = FileUpdateOperationLatestSerializer(read_only=True)

    class Meta:
        model = FileSource
        #fields = ("id", "owner", "title", "latest_revision", "forked_from")
        fields = ("id", "latest_file_update_operation", "update_interval", "filename", "url")