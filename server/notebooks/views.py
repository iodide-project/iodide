import json

from django.contrib.auth.decorators import login_required
from django.shortcuts import (get_object_or_404,
                              render)

from .models import Notebook, NotebookRevision
from ..base.models import User
from ..views import get_user_info_dict


def _get_user_info_json(user):
    if user.is_authenticated:
        return json.dumps(get_user_info_dict(user))
    return json.dumps({})


def notebook_view(request, pk):
    notebook = get_object_or_404(Notebook, pk=pk)
    if 'revision' in request.GET:
        notebook_content = get_object_or_404(NotebookRevision, pk=int(request.GET['revision']))
    else:
        notebook_content = notebook.revisions.last()
    return render(request, 'notebook.html', {
        'user_info': _get_user_info_json(request.user),
        'jsmd': notebook_content.content
    })


def notebook_revisions(request, pk):
    pk = int(pk)
    nb = get_object_or_404(Notebook, pk=pk)
    owner = get_object_or_404(User, pk=nb.owner_id)
    owner_info = {
        'username': owner.username,
        'full_name': '{} {}'.format(owner.first_name, owner.last_name),
        'avatar': owner.avatar,
        'title': nb.title,
        'notebookId': nb.id
    }
    revisions = list(reversed([{
        'id': revision.id,
        'notebookId': revision.notebook_id,
        'title': revision.title,
        'date': revision.created.isoformat(sep=' ')}
        for revision in NotebookRevision.objects.filter(notebook_id=pk)]))
    return render(request, '../templates/index.html', {
            'page_data': json.dumps({
                'userInfo': get_user_info_dict(request.user),
                'ownerInfo': owner_info,
                'revisions': revisions,
            })
        }
    )


@login_required
def new_notebook_view(request):
    return render(request, 'notebook.html', {
        'user_info': _get_user_info_json(request.user),
        'jsmd': ''
    })
