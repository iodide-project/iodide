from server.base.models import User
from rest_framework import viewsets

from server.base.serializers import UserSerializer


class UserListViewSet(viewsets.ReadOnlyModelViewSet):

    serializer_class = UserSerializer
    http_method_names = ['get']

    def get_queryset(self):
        queryset = User.objects.all()
        username = self.request.query_params.get('username', None)
        if username is not None:
            queryset = queryset.filter(username=username)
        return queryset
