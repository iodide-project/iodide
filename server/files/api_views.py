import json

from django.core.exceptions import PermissionDenied
from rest_framework import permissions, viewsets
from rest_framework.response import Response

from .models import File
from .serializers import FilesSerializer


class FileViewSet(viewsets.ModelViewSet):

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = FilesSerializer

    http_method_names = ['post', 'put', 'delete']

    def perform_destroy(self, instance):
        if instance.notebook.owner != self.request.user:
            raise PermissionDenied
        viewsets.ModelViewSet.perform_destroy(self, instance)

    def create(self, request):
        (metadata, file) = (json.loads(self.request.data['metadata']),
                            self.request.data['file'])
        f = File.objects.create(
            notebook_id=metadata['notebook_id'],
            filename=metadata['filename'],
            content=file.read()
        )
        serializer = FilesSerializer(f)
        return Response(serializer.data, status=201)

    def update(self, request, pk):
        (metadata, file) = (json.loads(self.request.data['metadata']),
                            self.request.data['file'])
        file_to_update = File.objects.get(pk=pk)
        updated_filename = metadata['filename'].strip()
        file_to_update.filename = updated_filename
        if file:
            file_to_update.content = file.read()
        file_to_update.save()
        serializer = FilesSerializer(file_to_update)
        return Response(serializer.data, status=201)

    queryset = File.objects.all()
