import json
from django.contrib.staticfiles.views import serve
from django.contrib.auth import logout as django_logout
from django.contrib.auth.decorators import permission_required
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse
from django.shortcuts import redirect
from django.template import loader

from .api.github import get_github_identity_data


def login_success(request):
    if not request.user.is_authenticated:
        raise PermissionDenied
    template = loader.get_template('login_success.html')
    return HttpResponse(
        template.render({
            'user_info': json.dumps(get_github_identity_data(request.user))
        }, request))


def logout(request):
    django_logout(request)
    return redirect('/')
