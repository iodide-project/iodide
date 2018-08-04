from django.conf.urls import include, url
from django.contrib import admin
from django.urls import path
from django.views import generic

import server.views


admin.autodiscover()

urlpatterns = [
    # notebook stuff
    url(r'^api/v1/', include('server.notebooks.api_urls')),
    url(r'^notebooks/', include('server.notebooks.urls')),

    # various views to help with the authentication pipeline
    url(r'^oauth/', include('social_django.urls', namespace='social')),
    url(r'^login_success/$', server.views.login_success,
        name='login_success'),
    url(r'^logout/$', server.views.logout, name='logout'),

    # react bundles to views
    url(r'^view2/',
      generic.TemplateView.as_view(template_name='view2.html')),
    url(r'^view1/',
      generic.TemplateView.as_view(template_name='view1.html')),

    # admin stuff
    path('admin/', admin.site.urls),

    url(r'^$', server.views.index, name='index'),
]
