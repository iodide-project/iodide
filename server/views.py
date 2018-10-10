from django.contrib.auth import logout as django_logout
from django.core.exceptions import PermissionDenied
from django.shortcuts import (get_object_or_404,
                              redirect,
                              render)
from django.db.models import Max

from .notebooks.models import Notebook
from .base.models import User


def get_user_info_dict(user):
    if user.is_authenticated:
        return {
            'name': user.username,
            'avatar': user.avatar
        }
    return {}


def index(request):
    notebooks = Notebook.objects \
        .annotate(latest_revision=Max('revisions__created')) \
        .order_by('-latest_revision') \
        .values_list('id', 'title', 'owner__username', 'owner__avatar')
    return render(
        request, 'index.html', {
            'page_data': {
                'userInfo': get_user_info_dict(request.user),
                # this is horrible and will not scale
                'notebookList': [
                    {'id': nb_id, 'title': title, 'owner': owner, 'avatar': avatar}
                    for (nb_id, title, owner, avatar) in notebooks
                ]
            }
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
    notebooks = Notebook.objects \
        .filter(owner=user) \
        .annotate(latest_revision=Max('revisions__created')) \
        .order_by('-latest_revision').values_list('id', 'title', 'latest_revision')
    return render(request, 'index.html', {
        'page_data': {
            'userInfo': user_info,
            'thisUser': this_user,
            'notebookList': [{
                'id': nb_id,
                'title': title,
                'last_revision': latest_revision.isoformat(sep=' ')
            } for (nb_id, title, latest_revision) in notebooks]
        }
    })


def login(request):
    if request.user.is_authenticated:
        return redirect('/new')
    return render(request, 'index.html', {'page_data': {}})


def login_success(request):
    if not request.user.is_authenticated:
        raise PermissionDenied
    return render(request, 'login_success.html', {
        'user_info': get_user_info_dict(request.user)
    })


def logout(request):
    django_logout(request)
    return redirect('/')
