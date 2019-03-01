from rest_framework import routers

from .api_views import FileViewSet

router = routers.SimpleRouter()
router.register(r"files", FileViewSet, base_name="files")

urlpatterns = router.urls
