import json

from django.contrib.auth.decorators import login_required
from django.shortcuts import (get_object_or_404,
                              render)

from server.views import get_user_info_dict
from .models import Notebook


def _get_user_info_json(user):
    if user.is_authenticated:
        return json.dumps(get_user_info_dict(user))
    return json.dumps({})


def notebook_view(request, pk):
    notebook = get_object_or_404(Notebook, pk=pk)
    latest_revision = notebook.revisions.last()
    return render(request, 'notebook.html', {
        'user_info': _get_user_info_json(request.user),
        'jsmd': latest_revision.content
    })


@login_required
def new_notebook_view(request):
    return render(request, 'notebook.html', {
        'user_info': _get_user_info_json(request.user),
        'jsmd': ''
    })
