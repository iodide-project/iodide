from rest_framework import serializers

from .models import RemoteOperation


class RemoteOperationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RemoteOperation
        fields = (
            "id",
            "notebook_id",
            "backend",
            "status",
            "parameters",
            "filename",
            "snippet",
            "scheduled_at",
            "started_at",
            "ended_at",
            "failed_at",
        )
