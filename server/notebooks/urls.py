from django.conf.urls import url

from .views import eval_frame_view, notebook_revisions, notebook_view

urlpatterns = [
    url(r"^(?P<pk>[0-9]+)/revisions/", notebook_revisions, name="notebook-revisions"),
    url(r"^(?P<pk>[0-9]+)/$", notebook_view, name="notebook-view"),
    url(r"^eval-frame/$", eval_frame_view, name="eval-frame-view"),
]
