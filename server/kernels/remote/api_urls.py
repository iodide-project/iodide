from rest_framework import routers

from .api_views import RemoteFileViewSet, RemoteOperationViewSet

router = routers.SimpleRouter()
router.register(r"remote-files", RemoteFileViewSet, basename="remote-files")
router.register(r"remote-operations", RemoteOperationViewSet, basename="remote-operations")

urlpatterns = router.urls
