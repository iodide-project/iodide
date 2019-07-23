from rest_framework import routers

from .api_views import NotebookRevisionViewSet, NotebookViewSet
from ..files.api_views import NotebookFileSourceViewSet

router = routers.SimpleRouter()
router.register(r"notebooks", NotebookViewSet, basename="notebooks")
router.register(
    r"notebooks/(?P<notebook_id>[0-9]+)/revisions",
    NotebookRevisionViewSet,
    basename="notebook-revisions",
)
router.register(
    r"notebooks/(?P<notebook_id>[0-9]+)/file-sources",
    NotebookFileSourceViewSet,
    basename="notebook-file-sources",
)

urlpatterns = router.urls
