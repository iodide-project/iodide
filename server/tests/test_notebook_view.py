import random

import pytest
from django.urls import reverse

from server.notebooks.models import Notebook, NotebookRevision
from server.settings import MAX_FILE_SIZE, MAX_FILENAME_LENGTH

from .helpers import get_script_block, get_script_block_json, get_title_block


def test_notebook_view(client, test_notebook):
    initial_revision = NotebookRevision.objects.filter(notebook=test_notebook).last()
    resp = client.get(reverse("notebook-view", args=[str(test_notebook.id)]))
    assert resp.status_code == 200
    assert get_title_block(resp.content) == initial_revision.title
    expected_content = '<script id="iomd" type="text/iomd">{}</script>'.format(
        initial_revision.content
    )
    assert expected_content in str(resp.content)
    assert get_script_block_json(resp.content, "notebookInfo") == {
        "connectionMode": "SERVER",
        "forked_from": False,
        "notebook_id": test_notebook.id,
        "revision_id": initial_revision.id,
        "revision_is_latest": True,
        "title": "First revision",
        "user_can_save": False,
        "username": "testuser1",
        "max_filename_length": MAX_FILENAME_LENGTH,
        "max_file_size": MAX_FILE_SIZE,
    }

    # add a new revision, verify that a fresh load gets it
    new_revision_content = "My new fun content"
    new_revision = NotebookRevision.objects.create(
        content=new_revision_content,
        notebook=test_notebook,
        title="Second revision",
        is_draft=False,
    )
    resp = client.get(reverse("notebook-view", args=[str(test_notebook.id)]))
    assert resp.status_code == 200
    assert get_title_block(resp.content) == new_revision.title
    new_expected_content = '<script id="iomd" type="text/iomd">{}</script>'.format(
        new_revision_content
    )
    assert new_expected_content in str(resp.content)


def test_notebook_view_escapes_iomd(client, fake_user):
    notebook = Notebook.objects.create(owner=fake_user, title="Fake notebook")
    iomd_content = "<>'\"&abcd="
    expected_escaped_iomd_content = "&lt;&gt;&#x27;&quot;&amp;abcd="
    NotebookRevision.objects.create(
        notebook=notebook, title="First revision", content=iomd_content, is_draft=False
    )

    resp = client.get(reverse("notebook-view", args=[str(notebook.id)]))
    expected_content = '<script id="iomd" type="text/iomd">{}</script>'.format(
        expected_escaped_iomd_content
    )
    assert expected_content in str(resp.content)


def test_notebook_view_old_revision(client, test_notebook):
    initial_revision = NotebookRevision.objects.filter(notebook=test_notebook).last()
    new_revision_content = "My new fun content"
    NotebookRevision.objects.create(
        content=new_revision_content,
        notebook=test_notebook,
        title="Second revision",
        is_draft=False,
    )
    resp = client.get(
        reverse("notebook-view", args=[str(test_notebook.id)]) + f"?revision={initial_revision.id}"
    )
    assert resp.status_code == 200
    assert get_title_block(resp.content) == initial_revision.title
    assert get_script_block(resp.content, "iomd", "text/iomd") == initial_revision.content
    assert get_script_block_json(resp.content, "notebookInfo") == {
        "connectionMode": "SERVER",
        "forked_from": False,
        "notebook_id": test_notebook.id,
        "revision_id": initial_revision.id,
        "revision_is_latest": False,
        "title": "First revision",
        "user_can_save": False,
        "username": "testuser1",
        "max_filename_length": MAX_FILENAME_LENGTH,
        "max_file_size": MAX_FILE_SIZE,
    }


@pytest.mark.parametrize("logged_in", [True, False])
def test_new_notebook_view(client, fake_user, logged_in):
    random.seed(0)
    if logged_in:
        client.force_login(fake_user)

    response = client.get(reverse("new-notebook"), follow=True)
    (last_url, _) = response.redirect_chain[-1]
    if logged_in:
        assert NotebookRevision.objects.count() == 1
        assert Notebook.objects.count() == 1
        assert Notebook.objects.values_list("title", flat=True).first() == "neodymium(III) iodide"
        assert last_url == Notebook.objects.all()[0].get_absolute_url()
    else:
        assert NotebookRevision.objects.count() == 0
        assert Notebook.objects.count() == 0
        assert last_url == reverse("try-it")


@pytest.mark.parametrize("logged_in", [True, False])
def test_tryit_view(client, fake_user, logged_in):
    if logged_in:
        client.force_login(fake_user)
    response = client.get(reverse("try-it"), follow=True)

    if logged_in:
        # if we are logged in, this view should redirect to /new`
        assert NotebookRevision.objects.count() == 1
        assert Notebook.objects.count() == 1
        assert len(response.redirect_chain) == 2
        (last_url, _) = response.redirect_chain[-1]
        assert last_url == Notebook.objects.all()[0].get_absolute_url()
    else:
        # if we are not logged in, all the action should happen on the
        # client
        assert NotebookRevision.objects.count() == 0
        assert Notebook.objects.count() == 0
        assert len(response.redirect_chain) == 0


def test_notebook_revisions_page(fake_user, test_notebook, client):
    # create another notebook revision
    NotebookRevision.objects.create(
        notebook=test_notebook,
        title="second revision",
        content="*fake notebook content 2*",
        is_draft=False,
    )
    resp = client.get(reverse("notebook-revisions", args=[str(test_notebook.id)]))
    assert get_title_block(resp.content) == f"Revisions - {test_notebook.title}"
    assert get_script_block_json(resp.content, "pageData") == {
        "files": [],
        "ownerInfo": {
            "avatar": None,
            "full_name": fake_user.get_full_name(),
            "notebookId": test_notebook.id,
            "title": test_notebook.title,
            "username": fake_user.username,
        },
        "revisions": [
            {
                "date": r.created.isoformat(),
                "id": r.id,
                "notebookId": test_notebook.id,
                "title": r.title,
            }
            for r in NotebookRevision.objects.filter(notebook_id=test_notebook.id)
        ],
        "userInfo": {},
    }


def test_eval_frame_view(client):
    uri = reverse("eval-frame-view")
    resp = client.get(uri)
    assert resp.status_code == 200
    assert '<div id="eval-container"></div>' in str(resp.content)
