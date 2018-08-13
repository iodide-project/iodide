from server.base.models import User
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.reverse import reverse

from server.base.serializers import UserSerializer


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    http_method_names = ['get']


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    http_method_names = ['get']

    def get_queryset(self):
        return User.objects.all().filter(username=self.request.user)

class UserDetailFromUsername(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    lookup_field = 'username'
    http_method_names = ['get']

    def get_queryset(self):
        username = self.kwargs['username']
        return User.objects.filter(username=username)
