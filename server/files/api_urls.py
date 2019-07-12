from rest_framework import routers

from .api_views import FileSourceViewSet, FileUpdateOperationViewSet, FileViewSet

router = routers.SimpleRouter()
router.register(r"files", FileViewSet, basename="files")
router.register(r"file-sources", FileSourceViewSet, basename="file-sources")
router.register(
    r"file-update-operations", FileUpdateOperationViewSet, basename="file-update-operations"
)

urlpatterns = router.urls
