import json
from django.contrib.auth import logout as django_logout
from django.core.exceptions import PermissionDenied
from django.shortcuts import (get_object_or_404,
                              redirect,
                              render)

from .notebooks.models import Notebook, NotebookRevision
from .base.models import User


def get_user_info_dict(user):
    if user.is_authenticated:
        return {
            'name': user.username,
            'avatar': user.avatar,
        }
    return {}


def index(request):
    # this is horrible and will not scale
    return render(
        request, 'home.html', {
            'user_info': json.dumps(get_user_info_dict(request.user)),
            'notebook_list': json.dumps([
                {'id': v[0], 'title': v[1], 'owner': v[2]} for v in
                Notebook.objects.values_list('id', 'title', 'owner__username')
            ])
        }
    )


def user(request, name=None):
    user_info = get_user_info_dict(request.user)
    user = get_object_or_404(User, username=name)

    this_user = {
        'full_name': '{} {}'.format(user.first_name, user.last_name),
        'avatar': user.avatar,
        'name': user.username,
    }
    return render(request, 'user.html', {
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
    })


def login(request):
    if request.user.is_authenticated:
        return redirect('/new')
    return render(request, 'login.html')


def login_success(request):
    if not request.user.is_authenticated:
        raise PermissionDenied
    return render(request, 'login_success.html', {
        'user_info': json.dumps(get_user_info_dict(request.user))
    })


def logout(request):
    django_logout(request)
    return redirect('/')
