import json
from django.contrib.auth import logout as django_logout
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse
from django.shortcuts import redirect
from django.template import loader
from social_django.models import UserSocialAuth


def get_user_info_dict(user):
    if user.is_authenticated:
        user_social_auth = UserSocialAuth.objects.get(user=user)
        social_auth_extra_data = user_social_auth.extra_data
        return {
            'name': social_auth_extra_data['login'],
            'avatar': user.avatar,
            'accessToken': user.social_auth_extra_data['access_token']
        }
    return {}


def index(request):
    template = loader.get_template('main.html')
    return HttpResponse(template.render({
        'user_info': json.dumps(get_user_info_dict(request.user))
    }, request))


def login_success(request):
    if not request.user.is_authenticated:
        raise PermissionDenied
    template = loader.get_template('login_success.html')
    return HttpResponse(
        template.render({
            'user_info': json.dumps(get_user_info_dict(request.user))
        }, request))


def logout(request):
    django_logout(request)
    return redirect('/')
