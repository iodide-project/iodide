from rest_framework import routers
from .api_views import (UserListViewSet)


router = routers.SimpleRouter()
router.register(r'users', UserListViewSet, base_name='users')

urlpatterns = router.urls
