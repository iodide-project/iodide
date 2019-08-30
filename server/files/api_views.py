import json

from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response

from ..notebooks.models import Notebook
from .models import File
from .serializers import FilesSerializer


class FileViewSet(viewsets.ModelViewSet):

    serializer_class = FilesSerializer

    http_method_names = ["post", "put", "delete"]

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

    queryset = File.objects.all()
