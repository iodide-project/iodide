import pytest
from django.urls import reverse

from helpers import get_script_block, get_title_block
from server.base.models import User
from server.notebooks.models import Notebook, NotebookRevision


@pytest.mark.parametrize("logged_in", [True, False])
def test_index_view(client, two_test_notebooks, fake_user, logged_in):
    if logged_in:
        client.force_login(fake_user)
    resp = client.get(reverse("index"))
    assert resp.status_code == 200

    # if user logged in, they should have an avatar defined
    fake_user.refresh_from_db()
    if logged_in:
        assert fake_user.avatar.startswith("http://www.gravatar.com/avatar/")
    else:
        assert fake_user.avatar is None

    # assert that the pageData element has the expected structure
    assert get_title_block(resp.content) == "Iodide"
    assert get_script_block(resp.content, "pageData") == {
        "notebookList": [
            {
                "avatar": fake_user.avatar,
                "id": test_notebook.id,
                "latestRevision": (
                    NotebookRevision.objects.get(notebook=test_notebook).created.isoformat()
                ),
                "owner": test_notebook.owner.username,
                "title": test_notebook.title,
            }
            for test_notebook in reversed(two_test_notebooks)
        ],
        "userInfo": {
            "name": fake_user.username,
            "avatar": "http://www.gravatar.com/avatar/eaee5961bc7ad96538a4933cb069fda9?d=identicon",
            "notebooks": [
                {
                    "id": test_notebook.id,
                    "latestRevision": (
                        NotebookRevision.objects.get(notebook=test_notebook).created.isoformat()
                    ),
                    "title": test_notebook.title,
                }
                for test_notebook in reversed(two_test_notebooks)
            ],
        }
        if logged_in
        else {},
    }


@pytest.mark.parametrize("username", ["testuser", "test-user", "testuser@foo.com"])
def test_user_view_with_different_names(transactional_db, client, username):
    test_user = User.objects.create(
        username=username,
        first_name="User",
        last_name="McUsertons",
        email="user@foo.com",
        password="123",
    )
    notebook = Notebook.objects.create(owner=test_user, title="Fake notebook")
    revision = NotebookRevision.objects.create(
        notebook=notebook, title="First revision", content="*fake notebook content*"
    )
    resp = client.get(reverse("user", kwargs={"name": test_user.username}))
    assert resp.status_code == 200
    assert get_title_block(resp.content) == f"{test_user.username} ({test_user.get_full_name()})"
    assert get_script_block(resp.content, "pageData") == {
        "notebookList": [
            {
                "id": notebook.id,
                "last_revision": revision.created.isoformat(),
                "title": revision.title,
            }
        ],
        "thisUser": {"avatar": None, "full_name": test_user.get_full_name(), "name": username},
        "userInfo": {},
    }


def test_user_view_github(settings, transactional_db, client, fake_user):
    settings.SOCIAL_AUTH_GITHUB_KEY = "yabbadabbadoo"
    resp = client.get(reverse("user", kwargs={"name": fake_user.username}))
    assert resp.status_code == 200
    assert get_script_block(resp.content, "pageData") == {
        "notebookList": [],
        "thisUser": {
            "avatar": None,
            "full_name": fake_user.get_full_name(),
            "name": fake_user.username,
            "github_url": "https://github.com/{}/".format(fake_user.username),
        },
        "userInfo": {},
    }
