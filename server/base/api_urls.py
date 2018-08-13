from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from .api_views import (UserList, UserDetail, UserDetailFromUsername)


urlpatterns = [
    url(r'^users/$', UserList.as_view(), name='user-list'),
    url(r'^users/(?P<pk>[0-9]+)/$', UserDetail.as_view(), name='user-detail'),
    url(r'^users/username/(?P<username>\w+)$', UserDetailFromUsername.as_view(), name='user-detail-username'),
]
