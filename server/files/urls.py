from django.conf.urls import url
from .views import file_view

from ..settings import MAX_FILENAME_LENGTH


urlpatterns = [
    url(r'^(?P<notebook_pk>[0-9]+)/files/(?P<filename>[^/]{0,%s})/?$' % MAX_FILENAME_LENGTH,
        file_view, name='file-view', ),
]
