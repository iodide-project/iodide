import json
from django.contrib.auth import logout as django_logout
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse
from django.shortcuts import redirect
from django.template import loader
from social_django.models import UserSocialAuth

from .notebooks.models import Notebook


def get_user_info_dict(user):
    if user.is_authenticated:
        user_social_auth = UserSocialAuth.objects.get(user=user)
        social_auth_extra_data = user_social_auth.extra_data
        # print('!!!', dir(social_auth_extra_data), dir(user_social_auth))
        # print(dir(user))
        return {
            'name': social_auth_extra_data['login'],
            'avatar': user.avatar,
            'user_id': user.pk,
            'accessToken': user.social_auth_extra_data['access_token']
        }
    return {}


def index(request):
    template = loader.get_template('home.html')
    # this is horrible and will not scale
    return HttpResponse(template.render({
        'user_info': json.dumps(get_user_info_dict(request.user)),
        'notebook_list': json.dumps(
            [{'id': v[0], 'title': v[1], 'owner': v[2]} for v in
             Notebook.objects.values_list('id', 'title', 'owner__username')
             ])
    }, request))

def user(request, name=None):
    print('user_name', name)
    template = loader.get_template('user.html')
    userInfo = get_user_info_dict(request.user)
    print(Notebook.objects.filter(owner_id=1).values_list('id', 'title'))
    return HttpResponse(template.render({
        'user_info': json.dumps(userInfo),
        'notebook_list': json.dumps(
            [{'id': v[0], 'title': v[1]} for v in
            Notebook.objects.filter(owner_id=userInfo['user_id']).values_list('id', 'title')
             ])
    }, request))

def login(request):
    if request.user.is_authenticated:
        return redirect('/new')
    template = loader.get_template('login.html')
    return HttpResponse(template.render(), request)


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
