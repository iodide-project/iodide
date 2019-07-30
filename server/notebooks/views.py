import urllib.parse

from django.db import transaction
from django.http import HttpResponseBadRequest
from django.shortcuts import get_object_or_404, redirect, render
from django.template.loader import get_template
from django.urls import reverse
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import ensure_csrf_cookie

from ..base.models import User
from ..files.models import File
from ..settings import EVAL_FRAME_ORIGIN, MAX_FILE_SIZE, MAX_FILENAME_LENGTH, SITE_URL
from ..views import get_user_info_dict
from .models import Notebook, NotebookRevision
from .names import get_random_compound


def _get_user_info_json(user):
    if user.is_authenticated:
        return get_user_info_dict(user)
    return {}


@xframe_options_exempt
def eval_frame_view(request):
    return render(request, "notebook_eval_frame.html", {"editor_origin": SITE_URL})


def _get_iframe_src():
    return urllib.parse.urljoin(EVAL_FRAME_ORIGIN, reverse(eval_frame_view))


@ensure_csrf_cookie
def notebook_view(request, pk):
    notebook = get_object_or_404(Notebook, pk=pk)
    if "revision" in request.GET:
        try:
            revision_id = int(request.GET["revision"])
        except ValueError:
            return HttpResponseBadRequest(content=f'Invalid revision id: {request.GET["revision"]}')
        revision = get_object_or_404(NotebookRevision, notebook=notebook, pk=revision_id)
        latest_revision_id = notebook.revisions.latest("created").id
    else:
        revision = notebook.revisions.first()
        latest_revision_id = revision.id

    files = [
        {"filename": file.filename, "id": file.id, "lastUpdated": file.last_updated.isoformat()}
        for file in File.objects.filter(notebook_id=pk).order_by("-last_updated")
    ]
    notebook_info = {
        "username": notebook.owner.username,
        "user_can_save": notebook.owner_id == request.user.id,
        "notebook_id": notebook.id,
        "revision_id": revision.id,
        "revision_is_latest": revision.id == latest_revision_id,
        "connectionMode": "SERVER",
        "title": revision.title,
        "files": files,
        "max_filename_length": MAX_FILENAME_LENGTH,
        "max_file_size": MAX_FILE_SIZE,
    }
    if notebook.forked_from is not None:
        notebook_info["forked_from"] = notebook.forked_from.id
    else:
        notebook_info["forked_from"] = False
    return render(
        request,
        "notebook.html",
        {
            "title": revision.title,
            "user_info": _get_user_info_json(request.user),
            "notebook_info": notebook_info,
            "iomd": revision.content,
            "iframe_src": _get_iframe_src(),
            "eval_frame_origin": EVAL_FRAME_ORIGIN,
        },
    )


@ensure_csrf_cookie
def notebook_revisions(request, pk):
    pk = int(pk)
    nb = get_object_or_404(Notebook, pk=pk)
    owner = get_object_or_404(User, pk=nb.owner_id)
    owner_info = {
        "username": owner.username,
        "full_name": owner.get_full_name(),
        "avatar": owner.avatar,
        "title": nb.title,
        "notebookId": nb.id,
    }
    if nb.forked_from is not None:
        owner_info["forkedFromTitle"] = nb.forked_from.title
        owner_info["forkedFromRevisionID"] = nb.forked_from.id
        owner_info["forkedFromNotebookID"] = nb.forked_from.notebook_id
        owner_info["forkedFromUsername"] = nb.forked_from.notebook.owner.username

    files = [
        {
            "filename": file.filename,
            "id": file.id,
            "last_updated": file.last_updated.isoformat(),
            "size": len(file.content),
        }
        for file in File.objects.filter(notebook_id=pk).order_by("-last_updated")
    ]
    revisions = list(
        [
            {
                "id": revision.id,
                "notebookId": revision.notebook_id,
                "title": revision.title,
                "date": revision.created.isoformat(),
            }
            for revision in NotebookRevision.objects.filter(notebook_id=pk)
        ]
    )
    return render(
        request,
        "../templates/index.html",
        {
            "title": f"Revisions - {nb.title}",
            "page_data": {
                "userInfo": get_user_info_dict(request.user),
                "ownerInfo": owner_info,
                "revisions": revisions,
                "files": files,
            },
        },
    )


@ensure_csrf_cookie
def new_notebook_view(request):
    if not request.user.is_authenticated:
        return redirect(reverse("try-it"))

    # create a new notebook and redirect to its view
    new_notebook_content_template = get_template("new_notebook_content.iomd")
    with transaction.atomic():
        notebook = Notebook.objects.create(owner=request.user)
        NotebookRevision.objects.create(
            notebook=notebook,
            content=new_notebook_content_template.render(),
            title=get_random_compound(),
        )
    return redirect(notebook)


@ensure_csrf_cookie
def tryit_view(request):
    """
    A way to let new users experiment with iodide without logging in

    If user is logged in, redirect to `/new/`
    """
    if request.user.is_authenticated:
        return redirect(new_notebook_view)
    # create a new notebook and redirect to its view
    new_notebook_content_template = get_template("new_notebook_content.iomd")
    return render(
        request,
        "notebook.html",
        {
            "user_info": {},
            "notebook_info": {
                "connectionMode": "SERVER",
                "tryItMode": True,
                "title": "Untitled notebook",
            },
            "iomd": new_notebook_content_template.render(),
            "iframe_src": _get_iframe_src(),
            "eval_frame_origin": EVAL_FRAME_ORIGIN,
        },
    )
