from rest_framework import routers

from .api_views import (FileSourceViewSet,
                        FileViewSet)

router = routers.SimpleRouter()
router.register(r"files", FileViewSet, basename="files")
router.register(r"file-sources", FileSourceViewSet, basename="file-sources")

urlpatterns = router.urls
