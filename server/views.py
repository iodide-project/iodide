import json
from django.contrib.auth import logout as django_logout
from django.core.exceptions import PermissionDenied
from django.shortcuts import (get_object_or_404,
                              redirect,
                              render)

from .notebooks.models import Notebook, NotebookRevision
from .base.models import User
from .shared.get_user_info_dict import get_user_info_dict

def index(request):
    return render(
        request, 'index.html', {
            'page_data': json.dumps({
                'userInfo': get_user_info_dict(request.user),
                # this is horrible and will not scale
                'notebookList': [
                    {'id': v[0], 'title': v[1], 'owner': v[2]} for v in
                    Notebook.objects.values_list('id', 'title', 'owner__username')
                ]
            })
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
    return render(request, 'index.html', {
        'page_data': json.dumps({
            'userInfo': user_info,
            'thisUser': this_user,
            'notebookList': [{
                'id': v[0],
                'title': v[1],
                'last_revision': NotebookRevision.objects
                .filter(notebook_id=v[0]).last().created.isoformat(sep=' ')
            } for v in Notebook.objects.filter(owner=user).values_list('id', 'title')]
        })
    })


def revisions(request, pk):
    pk = int(pk)
    nb = get_object_or_404(Notebook, pk=pk)
    owner = get_object_or_404(User, pk=nb.owner_id)
    owner_info = {
        'username': owner.username,
        'full_name': '{} {}'.format(owner.first_name, owner.last_name),
        'avatar': owner.avatar,
        'title': nb.title
    }
    revisions = list(reversed([{
        'id': revision.id,
        'title': revision.title,
        'date': revision.created.isoformat(sep=' ')}
        for revision in NotebookRevision.objects.filter(notebook_id=pk)]))
    
    return render(request, 'index.html', {
            'page_data': json.dumps({
                'userInfo': get_user_info_dict(request.user),
                'ownerInfo': owner_info,
                'revisions': revisions,
            })
        }
    )


def login(request):
    if request.user.is_authenticated:
        return redirect('/new')
    return render(request, 'index.html', {'page_data': json.dumps({})})


def login_success(request):
    if not request.user.is_authenticated:
        raise PermissionDenied
    return render(request, 'login_success.html', {
        'user_info': json.dumps(get_user_info_dict(request.user))
    })


def logout(request):
    django_logout(request)
    return redirect('/')
