from rest_framework import serializers
from server.base.models import User
from server.notebooks.models import Notebook


class NotebookUserListSerializer(serializers.ModelSerializer):
    '''
    List of notebooks with id and title
    '''

    class Meta:
        model = Notebook
        fields = ('id', 'title')


class UserSerializer(serializers.ModelSerializer):
    notebooks = serializers.SerializerMethodField()

    def get_notebooks(self, obj):
        notebooks_queryset = Notebook.objects.filter(owner=obj.id)
        return NotebookUserListSerializer(notebooks_queryset, many=True).data

    class Meta:
        model = User
        fields = ('id', 'username', 'avatar', 'first_name', 'last_name', 'notebooks')
