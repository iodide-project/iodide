from rest_framework import serializers

from .models import RemoteOperation


class RemoteOperationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RemoteOperation
        fields = (
            "id",
            "notebook_id",
            "remote_kernel",
            "status",
            "parameters",
            "filename",
            "snippet",
            "created_at",
            "running_at",
            "completed_at",
            "failed_at",
        )
