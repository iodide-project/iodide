import json

from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.template import loader

from ..shared.get_user_info_dict import get_user_info_dict
from .models import Notebook, NotebookRevision
from ..base.models import User


def _get_user_info_json(user):
    if user.is_authenticated:
        return json.dumps(get_user_info_dict(user))
    return json.dumps({})


def notebook_view(request, pk):
    template = loader.get_template('notebook.html')
    notebook = get_object_or_404(Notebook, pk=pk)
    latest_revision = notebook.revisions.last()
    return HttpResponse(
        template.render({
            'user_info': _get_user_info_json(request.user),
            'jsmd': latest_revision.content
        }, request))


def revisions_view(request, pk):
    template = loader.get_template('revisions.html')
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
    return HttpResponse(
        template.render({
            'user_info': _get_user_info_json(request.user),
            'owner_info': owner_info,
            'revisions': revisions,
        }, request))


@login_required
def new_notebook_view(request):
    template = loader.get_template('notebook.html')
    return HttpResponse(
        template.render({
            'user_info': _get_user_info_json(request.user),
            'jsmd': ''
        }, request))
