from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.db import transaction
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import permissions, viewsets
from rest_framework.exceptions import ValidationError

from .models import Notebook, NotebookRevision
from .serializers import (
    NotebookDetailSerializer,
    NotebookListSerializer,
    NotebookRevisionDetailSerializer,
    NotebookRevisionSerializer,
)


class NotebookViewSet(viewsets.ModelViewSet):

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    # modifying a notebook doesn't make sense once created (if you want to
    # change the title, add a revision doing just that)
    http_method_names = ["get", "post", "head", "delete"]

    def get_serializer_class(self):
        if self.action in ["retrieve", "create"]:
            return NotebookDetailSerializer
        return NotebookListSerializer

    def perform_destroy(self, instance):
        if instance.owner != self.request.user:
            raise PermissionDenied
        viewsets.ModelViewSet.perform_destroy(self, instance)

    def perform_create(self, serializer):
        with transaction.atomic():
            if "owner" in self.request.data:
                User = get_user_model()
                if (
                    not self.request.data["owner"]
                    or self.request.data["owner"] == self.request.user.username
                ):
                    owner = self.request.user
                elif self.request.user.can_create_on_behalf_of_others:
                    owner = get_object_or_404(User, username=self.request.data["owner"])
                else:
                    raise PermissionDenied
            else:
                owner = self.request.user

            if "forked_from" in self.request.data:
                nbr_id = self.request.data["forked_from"]
                forked_from = NotebookRevision.objects.get(id=nbr_id)
            else:
                forked_from = None
            notebook = serializer.save(owner=owner, forked_from=forked_from)
            NotebookRevision.objects.create(
                notebook=notebook,
                title=self.request.data["title"],
                content=self.request.data["content"],
            )

    queryset = Notebook.objects.all()


class NotebookRevisionViewSet(viewsets.ModelViewSet):

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    # revisions should be considered immutable once created
    http_method_names = ["get", "post", "head", "delete"]

    def get_serializer_context(self):
        notebook_id = int(self.kwargs["notebook_id"])
        if not Notebook.objects.filter(id=notebook_id).exists():
            raise Http404("Notebook with id %s does not exist" % notebook_id)
        return {"notebook_id": notebook_id}

    def get_queryset(self):
        base = NotebookRevision.objects.filter(notebook_id=self.kwargs["notebook_id"])
        filter_by_id = self.request.query_params.getlist("id")
        if filter_by_id:
            return base.filter(id__in=filter_by_id)
        return base

    def get_serializer_class(self):
        full = self.request.query_params.get("full") and self.request.query_params["full"][0]
        if not full and self.action == "list":
            return NotebookRevisionSerializer
        return NotebookRevisionDetailSerializer

    def perform_destroy(self, instance):
        if instance.notebook.owner != self.request.user:
            raise PermissionDenied
        viewsets.ModelViewSet.perform_destroy(self, instance)

    def perform_create(self, serializer):
        ctx = self.get_serializer_context()

        notebook_owner_id = Notebook.objects.values_list("owner", flat=True).get(
            id=ctx["notebook_id"]
        )
        if self.request.user.id != notebook_owner_id:
            raise PermissionDenied

        # validate against parent revision id, if provided as an argument
        parent_revision_id = self.request.data.get("parent_revision_id")
        if parent_revision_id:
            last_revision = NotebookRevision.objects.filter(notebook_id=ctx["notebook_id"]).first()
            try:
                assert int(parent_revision_id) == last_revision.id
            except (ValueError, AssertionError):
                raise ValidationError(
                    f"Based on non-latest revision {parent_revision_id} (expected: {last_revision.id})"
                )

        serializer.save(**ctx)
