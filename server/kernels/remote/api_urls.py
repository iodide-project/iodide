from rest_framework import routers

from .api_views import RemoteOperationViewSet

router = routers.SimpleRouter()
router.register(r"remote-operations", RemoteOperationViewSet, basename="remote-operations")

urlpatterns = router.urls
