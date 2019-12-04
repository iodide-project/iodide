import logging

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.db import transaction
from django.http import Http404
from requests.exceptions import HTTPError
from rest_framework import status, viewsets
from rest_framework.exceptions import APIException, ValidationError
from rest_framework.response import Response
from social_django.models import UserSocialAuth

from ..github import get_github_user_data
from .models import Notebook, NotebookRevision
from .serializers import (
    NotebookDetailSerializer,
    NotebookListSerializer,
    NotebookRevisionDetailSerializer,
    NotebookRevisionSerializer,
)
from .tasks import execute_notebook_revisions_cleanup, tasks

logger = logging.getLogger(__name__)


class NotebookViewSet(viewsets.ModelViewSet):

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
        super().perform_destroy(instance)

    @transaction.atomic
    def create(self, request):
        if "owner" in self.request.data:
            owner_username = self.request.data["owner"]
            if not owner_username or owner_username == self.request.user.username:
                owner = self.request.user
            elif self.request.user.can_create_on_behalf_of_others:
                User = get_user_model()
                owner, _ = User.objects.get_or_create(username=owner_username)
                if (
                    settings.SOCIAL_AUTH_GITHUB_KEY
                    and not UserSocialAuth.objects.filter(user=owner, provider="github").exists()
                ):
                    # if this does not succeed, we will return a 500
                    try:
                        github_user_data = get_github_user_data(owner_username)
                    except HTTPError as err:
                        logger.error(
                            "Error getting information for user %s from github: %s",
                            request.user.username,
                            err,
                        )
                        raise APIException(
                            "Error getting github user data for user %s".format(owner_username)
                        )
                    UserSocialAuth.objects.get_or_create(
                        user=owner, provider="github", defaults={"uid": github_user_data["id"]}
                    )
            else:
                raise PermissionDenied
        else:
            owner = self.request.user

        if "forked_from" in self.request.data:
            nbr_id = self.request.data["forked_from"]
            try:
                forked_from = NotebookRevision.objects.get(id=nbr_id)
            except NotebookRevision.DoesNotExist:
                raise Http404(f"Notebook with id {nbr_id} does not exist")
        else:
            forked_from = None

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        notebook = serializer.save(owner=owner, forked_from=forked_from)
        NotebookRevision.objects.create(
            notebook=notebook,
            title=self.request.data["title"],
            content=self.request.data["content"],
            is_draft=False,
        )

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    queryset = Notebook.objects.all()


class NotebookRevisionViewSet(viewsets.ModelViewSet):

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
        super().perform_destroy(instance)

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
                    f"Based on non-latest revision {parent_revision_id} "
                    f"(expected: {last_revision.id})"
                )
        serializer.save(**{**ctx, "is_draft": True})
        tasks.schedule(execute_notebook_revisions_cleanup, ctx["notebook_id"])
