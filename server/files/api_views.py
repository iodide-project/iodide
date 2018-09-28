import json

from django.core.exceptions import PermissionDenied
from rest_framework import (permissions,
                            viewsets)
from rest_framework.response import Response

from .models import File
from .serializers import FilesSerializer


class FileViewSet(viewsets.ModelViewSet):

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = FilesSerializer

    # modifying a notebook doesn't make sense once created (if you want to
    # change the title, add a revision doing just that)
    http_method_names = ['post', 'put', 'delete']

    def perform_destroy(self, instance):
        if instance.notebook.owner != self.request.user:
            raise PermissionDenied
        viewsets.ModelViewSet.perform_destroy(self, instance)

    def create(self, request):
        (metadata, file) = (json.loads(self.request.data['metadata']),
                            self.request.data['file'])
        print(metadata, file)
        f = File.objects.create(
            notebook_id=metadata['notebook_id'],
            filename=metadata['filename'],
            content=file.read()
        )
        serializer = FilesSerializer(f)
        return Response(serializer.data, status=201)

    queryset = File.objects.all()
