import json

from django.core.exceptions import PermissionDenied
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response

from ..notebooks.models import Notebook
from .models import File, FileSource, FileUpdateOperation
from .serializers import (
    FileSourceDetailSerializer,
    FileSourceDetailWithoutURLSerializer,
    FileSourceSerializer,
    FilesSerializer,
    FileUpdateOperationSerializer,
)
from .tasks import execute_file_update_operation, tasks


class FileViewSet(viewsets.ModelViewSet):

    http_method_names = ["post", "put", "delete"]
    queryset = File.objects.all()
    serializer_class = FilesSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.notebook.owner != request.user:
            raise PermissionDenied
        return super().destroy(request, *args, **kwargs)

    def create(self, request):
        metadata = json.loads(self.request.data["metadata"])
        file = self.request.data["file"]

        notebook = get_object_or_404(Notebook, id=metadata["notebook_id"])
        if notebook.owner != self.request.user:
            raise PermissionDenied

        file_obj = File.objects.create(
            notebook_id=notebook.id, filename=metadata["filename"], content=file.read()
        )
        return Response(FilesSerializer(file_obj).data, status=201)

    def update(self, request, pk):
        metadata = json.loads(self.request.data["metadata"])
        file = self.request.data["file"]

        notebook = get_object_or_404(Notebook, id=metadata["notebook_id"])
        if notebook.owner != self.request.user:
            raise PermissionDenied

        file_obj_to_update = get_object_or_404(File, pk=pk)
        updated_filename = metadata["filename"].strip()
        file_obj_to_update.filename = updated_filename
        if file:
            file_obj_to_update.content = file.read()
        file_obj_to_update.save()

        return Response(FilesSerializer(file_obj_to_update).data, status=201)


class NotebookFileViewSet(viewsets.ModelViewSet):

    http_method_names = ["get"]
    serializer_class = FilesSerializer

    def get_serializer_context(self):
        notebook_id = int(self.kwargs["notebook_id"])
        if not Notebook.objects.filter(id=notebook_id).exists():
            raise Http404("Notebook with id %s does not exist" % notebook_id)
        return {"notebook_id": notebook_id}

    def get_queryset(self):
        files = File.objects.filter(notebook_id=self.kwargs["notebook_id"])
        filter_by_id = self.request.query_params.getlist("id")
        if filter_by_id:
            return files.filter(id__in=filter_by_id)
        return files


class NotebookFileSourceViewSet(viewsets.ModelViewSet):

    http_method_names = ["get"]

    def get_serializer_class(self):
        request = self.request
        if not request.user.is_authenticated:
            return FileSourceDetailWithoutURLSerializer
        notebook_id = int(self.kwargs["notebook_id"])
        notebook = get_object_or_404(Notebook, id=notebook_id)
        owner_id = notebook.owner.id
        requester_id = request.user.id
        if not owner_id == requester_id:
            return FileSourceDetailWithoutURLSerializer
        return FileSourceDetailSerializer

    def get_serializer_context(self):
        notebook_id = int(self.kwargs["notebook_id"])
        if not Notebook.objects.filter(id=notebook_id).exists():
            raise Http404("Notebook with id %s does not exist" % notebook_id)
        return {"notebook_id": notebook_id}

    def get_queryset(self):
        base = FileSource.objects.filter(notebook_id=self.kwargs["notebook_id"])
        filter_by_id = self.request.query_params.getlist("id")
        if filter_by_id:
            return base.filter(id__in=filter_by_id)
        return base


class FileSourceViewSet(viewsets.ModelViewSet):

    http_method_names = ["post", "put", "delete"]
    queryset = FileSource.objects.all()
    serializer_class = FileSourceSerializer

    def perform_destroy(self, instance):
        if instance.notebook.owner != self.request.user:
            raise PermissionDenied
        super().perform_destroy(instance)

    def perform_create(self, serializer):
        if self.request.user != serializer.validated_data["notebook"].owner:
            raise PermissionDenied

        serializer.save()

    def perform_update(self, serializer):
        if self.request.user != serializer.validated_data["notebook"].owner:
            raise PermissionDenied

        serializer.save()


class FileUpdateOperationViewSet(viewsets.ModelViewSet):

    queryset = FileUpdateOperation.objects.all()
    serializer_class = FileUpdateOperationSerializer

    http_method_names = ["get", "post"]

    def create(self, serializer):
        file_source = get_object_or_404(FileSource, id=self.request.data["file_source_id"])
        if self.request.user != file_source.notebook.owner:
            raise PermissionDenied

        update_operation = FileUpdateOperation.objects.create(file_source=file_source)
        tasks.schedule(execute_file_update_operation, update_operation.id)

        return Response(FileUpdateOperationSerializer(update_operation).data, status=201)
