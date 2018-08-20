from django.conf.urls import include, url
from django.contrib import admin
from django.urls import path

import server.views


admin.autodiscover()

urlpatterns = [
    # notebook stuff
    url(r'^api/v1/', include('server.notebooks.api_urls')),
    url(r'^api/v1/', include('server.base.api_urls')),
    url(r'^notebooks/', include('server.notebooks.urls')),

    # various views to help with the authentication pipeline
    url(r'^oauth/', include('social_django.urls', namespace='social')),
    url(r'^login_success/$', server.views.login_success,
        name='login_success'),
    url(r'^logout/$', server.views.logout, name='logout'),

    # admin stuff
    path('admin/', admin.site.urls),

    # react website
    url(r'^(?!oauth/|notebooks|api)', server.views.index, name='index'),
]
