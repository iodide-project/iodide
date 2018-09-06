import json
from django.contrib.auth import logout as django_logout
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse
from django.shortcuts import redirect, get_object_or_404

from django.template import loader
from social_django.models import UserSocialAuth

from .notebooks.models import Notebook, NotebookRevision
from .base.models import User


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
    template = loader.get_template('user.html')
    user_info = get_user_info_dict(request.user)
    user = get_object_or_404(User, username=name)

    this_user = {
        'full_name': '{} {}'.format(user.first_name, user.last_name),
        'avatar': user.avatar,
        'name': user.username,
    }
    return HttpResponse(template.render({
        'user_info': json.dumps(user_info),
        'this_user': json.dumps(this_user),
        'notebook_list': json.dumps(
            [{
                'id': v[0],
                'title': v[1],
                'last_revision': NotebookRevision.objects
                .filter(notebook_id=v[0]).last().created.isoformat(sep=' ')
            } for v in Notebook.objects.filter(owner=user).values_list('id', 'title')
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
