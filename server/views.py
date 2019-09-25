from django.conf import settings
from django.contrib.auth import logout as django_logout
from django.core.exceptions import PermissionDenied
from django.db.models import Count, Max
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.views.decorators.csrf import ensure_csrf_cookie

from .base.models import User
from .notebooks.models import Notebook


def get_user_info_dict(user):
    if user.is_authenticated:
        return {"name": user.username, "avatar": user.avatar}
    return {}


def get_base_page_info_dict():
    if settings.IS_STAGING:
        return {
            "isStaging": settings.IS_STAGING,
            "productionServerURL": settings.PRODUCTION_SERVER_URL,
        }
    return {}


@ensure_csrf_cookie
def index(request):
    user_info = get_user_info_dict(request.user)
    notebooks = (
        Notebook.objects.annotate(
            latest_revision=Max("revisions__created"), num_revisions=Count("revisions")
        )
        .filter(num_revisions__gte=settings.MIN_FIREHOSE_REVISIONS)
        .order_by("-latest_revision")
        .values_list("id", "title", "owner__username", "owner__avatar", "latest_revision")[:100]
    )
    if not request.user.is_anonymous:
        user_info["notebooks"] = [
            {"id": nb_id, "title": title, "latestRevision": latest_revision.isoformat()}
            for (nb_id, title, latest_revision) in get_formatted_notebooks(request.user)
        ]
    return render(
        request,
        "index.html",
        {
            "title": "Iodide",
            "page_data": {
                **get_base_page_info_dict(),
                "userInfo": user_info,
                # this is horrible and will not scale
                "notebookList": [
                    {
                        "id": nb_id,
                        "title": title,
                        "owner": owner,
                        "avatar": avatar,
                        "latestRevision": latest_revision.isoformat(),
                    }
                    for (nb_id, title, owner, avatar, latest_revision) in notebooks
                ],
            },
        },
    )


def get_formatted_notebooks(user):
    return (
        Notebook.objects.filter(owner=user)
        .annotate(latest_revision=Max("revisions__created"))
        .order_by("-latest_revision")
        .values_list("id", "title", "latest_revision")
    )


@ensure_csrf_cookie
def user(request, name=None):
    user_info = get_user_info_dict(request.user)

    user = get_object_or_404(User, username=name)
    this_user = {"full_name": user.get_full_name(), "avatar": user.avatar, "name": user.username}
    # if we're using github, also try to get the user's github page
    if settings.SOCIAL_AUTH_GITHUB_KEY:
        this_user.update({"github_url": "https://github.com/{}/".format(user.username)})

    notebooks = get_formatted_notebooks(user)
    title = f"{this_user['name']}"
    if this_user["full_name"]:
        title += f" ({this_user['full_name']})"
    return render(
        request,
        "index.html",
        {
            "title": title,
            "page_data": {
                **get_base_page_info_dict(),
                "userInfo": user_info,
                "thisUser": this_user,
                "notebookList": [
                    {"id": nb_id, "title": title, "last_revision": latest_revision.isoformat()}
                    for (nb_id, title, latest_revision) in notebooks
                ],
            },
        },
    )


def login(request):
    if request.user.is_authenticated:
        return redirect(reverse("login_success"))
    elif settings.SOCIAL_AUTH_GITHUB_KEY:
        return redirect(reverse("social:begin", kwargs={"backend": "github"}))

    # this shouldn't happen in our current deployments (either we're logged
    # in already or we're using github) but leaving this in for testing and
    # sanity
    return redirect(reverse("index"))


def login_success(request):
    if not request.user.is_authenticated:
        raise PermissionDenied
    return render(request, "login_success.html", {"user_info": get_user_info_dict(request.user)})


def logout(request):
    django_logout(request)
    return redirect(reverse("index"))
