from django.conf.urls import url
from django.views.generic.base import RedirectView

from .views import (notebook_view, new_notebook)


urlpatterns = [
    url(r'new', new_notebook,
        name='new-notebook'),
    url(r'(?P<pk>[0-9]+)', notebook_view,
        name='notebook-view'),
    url(r'^$', RedirectView.as_view(url='/notebooks/new'),
        name='go-to-new-notebook'),
]
