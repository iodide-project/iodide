import json

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.template import loader

from server.views import get_user_info_dict
from .models import Notebook


def notebook_view(request, pk):
    template = loader.get_template('notebook.html')
    notebook = get_object_or_404(Notebook, pk=pk)
    latest_revision = notebook.revisions.last()
    if request.user.is_authenticated:
        user_info = json.dumps(get_user_info_dict(request.user))
    else:
        user_info = json.dumps({})
    return HttpResponse(
        template.render({
            'user_info': user_info,
            'jsmd': latest_revision.content
        }, request))
