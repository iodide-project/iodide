from django.conf.urls import include, url
from django.urls import path

from django.contrib import admin
admin.autodiscover()

import server.views


urlpatterns = [
    url(r'^$', server.views.index, name='index'),

    # various views to help with the authentication pipeline
    url(r'^oauth/', include('social_django.urls', namespace='social')),
    url(r'^login_success/$', server.views.login_success,
        name='login_success'),
    url(r'^logout/$', server.views.logout, name='logout'),

    # admin stuff
    path('admin/', admin.site.urls),
]
