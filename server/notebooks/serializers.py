from rest_framework import serializers

from server.base.models import User

from .models import Notebook, NotebookRevision


class NotebookLatestRevisionField(serializers.RelatedField):
    def get_attribute(self, obj):
        return NotebookRevision.objects.filter(notebook_id=obj.id).first()

    def to_representation(self, value):
        if value:
            return NotebookRevisionDetailSerializer(value).data

        return None


class NotebookListSerializer(serializers.ModelSerializer):

    owner = serializers.SlugRelatedField(
        slug_field="username", queryset=User.objects.all(), required=False
    )

    class Meta:
        model = Notebook
        fields = ("id", "owner", "title", "forked_from")


class NotebookDetailSerializer(NotebookListSerializer):

    latest_revision = NotebookLatestRevisionField(read_only=True)

    class Meta:
        model = Notebook
        fields = ("id", "owner", "title", "latest_revision", "forked_from")


class NotebookRevisionSerializer(serializers.ModelSerializer):
    """
    Summarization of revisions for a notebook (does not include content)
    """

    class Meta:
        model = NotebookRevision
        fields = ("id", "title", "created")


class NotebookRevisionDetailSerializer(serializers.ModelSerializer):
    """
    Details of a revision for a notebook (includes content)
    """

    def validate(self, attrs):
        last_revision = NotebookRevision.objects.filter(
            notebook_id=self.context["notebook_id"]
        ).first()
        if attrs["title"] == last_revision.title and attrs["content"] == last_revision.content:
            raise serializers.ValidationError("Revision unchanged from previous")
        return super().validate(attrs)

    class Meta:
        model = NotebookRevision
        fields = ("id", "title", "created", "content", "is_draft")
        write_only_fields = "notebook_id"
        read_only_fields = ["is_draft"]
