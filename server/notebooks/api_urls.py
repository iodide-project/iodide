from rest_framework import routers

from .api_views import NotebookRevisionViewSet, NotebookViewSet

router = routers.SimpleRouter()
router.register(r'notebooks', NotebookViewSet,
                base_name='notebooks')
router.register(r'notebooks/(?P<notebook_id>[0-9]+)/revisions', NotebookRevisionViewSet,
                base_name='notebook-revisions')

urlpatterns = router.urls
