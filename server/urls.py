from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth.models import Group
from django.urls import path
from django.views.generic.base import RedirectView

import server.views


admin.site.unregister(Group)  # Hide the group, not used right now


def parse_redirects(redirects):
    """
    Parses a string defining a set of redirects.

    The string is in ;-delimited section, where each section is
    if the form `$prefix=$dest`.

    Yields Django url configurations to perform the redirect.
    """
    redirects = [x.strip() for x in redirects.split(";")]
    for redirect in redirects:
        parts = [x.strip() for x in redirect.split("=")]
        if len(parts) != 2:
            continue
        prefix, dest = parts
        yield url(f"^{prefix}.*", RedirectView.as_view(url=dest))


urlpatterns = [
    # notebook stuff
    url(r"^api/v1/", include("server.notebooks.api_urls")),
    url(r"^api/v1/", include("server.files.api_urls")),
    url(r"^notebooks/", include("server.files.urls")),
    url(r"^notebooks/", include("server.notebooks.urls")),
    url(r"^new/?", server.notebooks.views.new_notebook_view, name="new-notebook"),
    url(r"^tryit/?", server.notebooks.views.tryit_view, name="try-it"),
    # various views to help with the authentication pipeline
    url(r"^oauth/", include("social_django.urls", namespace="social")),
    url(r"^login_success/$", server.views.login_success, name="login_success"),
    url(r"^logout/$", server.views.logout, name="logout"),
    # admin stuff
    path("admin/", admin.site.urls),
    url(r"^$", server.views.index, name="index"),
]

urlpatterns += list(parse_redirects(settings.IODIDE_REDIRECTS))

urlpatterns += [
    # user urls
    # based on https://github.com/shinnn/github-username-regex
    url(r"^(?P<name>\w(?:\w|-|@|\.(?=\w)){0,38})/$", server.views.user, name="user")
]
