from django.conf.urls import url

from ..settings import MAX_FILENAME_LENGTH
from .views import file_view

urlpatterns = [
    url(
        r"^(?P<notebook_pk>[0-9]+)/files/(?P<filename>[^/]{0,%s})/?$" % MAX_FILENAME_LENGTH,
        file_view,
        name="file-view",
    )
]
