from django.conf.urls import url

from .views import notebook_revisions, notebook_view

urlpatterns = [
    url(r'^(?P<pk>[0-9]+)/revisions/', notebook_revisions, name='notebook-revisions'),
    url(r'^(?P<pk>[0-9]+)/$', notebook_view,
        name='notebook-view'),
]
