import pytest
from django.conf import settings
from django.urls import reverse

from server.base.models import User
from server.notebooks.models import Notebook, NotebookRevision

from .helpers import get_script_block_json, get_title_block


@pytest.fixture
def ten_test_notebooks(fake_user):
    """
    Half of these notebooks have >= MIN_FIREHOSE_REVISIONS revisions.
    """
    notebooks = []
    for i in range(settings.MIN_FIREHOSE_REVISIONS):
        notebook = Notebook.objects.create(owner=fake_user, title="Fake notebook %s" % i)
        NotebookRevision.objects.create(
            notebook=notebook,
            title="First revision of notebook %s" % i,
            content="*fake notebook content %s*" % i,
            is_draft=False,
        )
        # every other notebook gets min # of revisions to show up in the index page list
        if i % 2 == 0:
            for j in range(1, settings.MIN_FIREHOSE_REVISIONS):
                NotebookRevision.objects.create(
                    notebook=notebook,
                    title="Revision %s of notebook %s" % (j, i),
                    content="*fake notebook content %s revision %s" % (i, j),
                    is_draft=False,
                )
        notebooks.append(notebook)
    return notebooks


@pytest.mark.parametrize("logged_in", [True, False])
def test_index_view(client, ten_test_notebooks, fake_user, settings, logged_in):
    if logged_in:
        client.force_login(fake_user)
    resp = client.get(reverse("index"))
    assert resp.status_code == 200

    # if user logged in, they should have an avatar defined
    fake_user.refresh_from_db()
    if logged_in:
        assert fake_user.avatar.startswith("https://www.gravatar.com/avatar/")
    else:
        assert fake_user.avatar is None

    listed_notebooks = ten_test_notebooks[::2]
    revisions = NotebookRevision.objects
    expected_gravatar_url = (
        "https://www.gravatar.com/avatar/eaee5961bc7ad96538a4933cb069fda9?d=identicon"
    )
    # assert that the pageData element has the expected structure
    assert get_title_block(resp.content) == "Iodide"
    assert get_script_block_json(resp.content, "pageData") == {
        "notebookList": [
            {
                "avatar": fake_user.avatar,
                "id": test_notebook.id,
                "latestRevision": (revisions.filter(notebook=test_notebook)[0].created.isoformat()),
                "owner": test_notebook.owner.username,
                "title": test_notebook.title,
            }
            for test_notebook in reversed(listed_notebooks)
        ],
        "userInfo": {
            "name": fake_user.username,
            "avatar": expected_gravatar_url,
            "notebooks": [
                {
                    "id": test_notebook.id,
                    "latestRevision": (
                        revisions.filter(notebook=test_notebook)[0].created.isoformat()
                    ),
                    "title": test_notebook.title,
                }
                for test_notebook in reversed(ten_test_notebooks)
            ],
        }
        if logged_in
        else {},
    }


def test_index_view_staging(transactional_db, client, settings):
    settings.IS_STAGING = True
    settings.PRODUCTION_SERVER_URL = "http://localhost:8001"
    resp = client.get(reverse("index"))
    assert resp.status_code == 200
    assert get_script_block_json(resp.content, "pageData") == {
        "isStaging": settings.IS_STAGING,
        "productionServerURL": settings.PRODUCTION_SERVER_URL,
        "notebookList": [],
        "userInfo": {},
    }


@pytest.mark.parametrize(
    ("username", "first_name", "last_name"),
    [
        ("testuser", "User", "McUserTons"),
        ("testuser@foo.com", "Test", ""),
        ("test-user", "", "User"),
        ("test-user", "", ""),
    ],
)
def test_user_view_with_different_names(transactional_db, client, username, first_name, last_name):
    test_user = User.objects.create(
        username=username,
        first_name=first_name,
        last_name=last_name,
        email="user@foo.com",
        password="123",
    )
    notebook = Notebook.objects.create(owner=test_user, title="Fake notebook")
    revision = NotebookRevision.objects.create(
        notebook=notebook, title="First revision", content="*fake notebook content*", is_draft=False
    )
    resp = client.get(reverse("user", kwargs={"name": test_user.username}))
    assert resp.status_code == 200
    if test_user.get_full_name():
        assert (
            get_title_block(resp.content) == f"{test_user.username} ({test_user.get_full_name()})"
        )
    else:
        assert get_title_block(resp.content) == f"{test_user.username}"

    assert get_script_block_json(resp.content, "pageData") == {
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
    assert get_script_block_json(resp.content, "pageData") == {
        "notebookList": [],
        "thisUser": {
            "avatar": None,
            "full_name": fake_user.get_full_name(),
            "name": fake_user.username,
            "github_url": "https://github.com/{}/".format(fake_user.username),
        },
        "userInfo": {},
    }
