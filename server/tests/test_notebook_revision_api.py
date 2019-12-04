import pytest
from django.urls import reverse

from server.notebooks.models import NotebookRevision

from .helpers import get_rest_framework_time_string


@pytest.fixture
def two_test_notebooks_and_revisions(two_test_notebooks):
    test_notebook = two_test_notebooks[0]

    # add another revision to the main notebook that we are testing
    NotebookRevision.objects.create(
        notebook=test_notebook,
        title="Revision 2",
        content="*fake notebook content 2*",
        is_draft=False,
    )

    # add a revision for another notebook, to make sure that doesn't get mixed in
    NotebookRevision.objects.create(
        notebook=two_test_notebooks[1],
        title="Revision for another notebook",
        content="*fake notebook 2 content 2*",
        is_draft=False,
    )
    return two_test_notebooks


def test_read_notebook_revisions(fake_user, two_test_notebooks_and_revisions, client):
    test_notebook = two_test_notebooks_and_revisions[0]

    # verify that we can list notebook revisions and that we only get what we
    # expect in the expected order (latest first)
    resp = client.get(reverse("notebook-revisions-list", kwargs={"notebook_id": test_notebook.id}))
    assert resp.status_code == 200
    assert resp.json() == [
        {
            "created": get_rest_framework_time_string(revision.created),
            "id": revision.id,
            "title": revision.title,
        }
        for revision in NotebookRevision.objects.filter(notebook=test_notebook)
    ]

    # verify that the full parameter gives us the content for each revision
    # as well
    resp = client.get(
        reverse("notebook-revisions-list", kwargs={"notebook_id": test_notebook.id}) + "?full=1"
    )
    assert resp.status_code == 200
    assert resp.json() == [
        {
            "content": revision.content,
            "created": get_rest_framework_time_string(revision.created),
            "id": revision.id,
            "title": revision.title,
            "is_draft": False,
        }
        for revision in NotebookRevision.objects.filter(notebook=test_notebook)
    ]

    # verify that we can get the details of a single revision as well
    test_revision = NotebookRevision.objects.filter(notebook=test_notebook).first()
    resp = client.get(
        reverse(
            "notebook-revisions-detail",
            kwargs={"notebook_id": test_notebook.id, "pk": test_revision.id},
        )
    )
    assert resp.json() == {
        "content": test_revision.content,
        "created": get_rest_framework_time_string(test_revision.created),
        "id": test_revision.id,
        "title": test_revision.title,
        "is_draft": False,
    }


def test_read_notebook_revisions_restricted(
    fake_user, two_test_notebooks_and_revisions, client, restricted_api
):
    """
    tests that in restricted API mode listing of revisions returns a permission
    denied response
    """
    test_notebook = two_test_notebooks_and_revisions[0]
    resp = client.get(reverse("notebook-revisions-list", kwargs={"notebook_id": test_notebook.id}))
    assert resp.status_code == 403


def test_read_multiple_revisions(fake_user, test_notebook, client):
    """
    tests that reading multiple revisions at the same time (but not all of
    them) works
    """
    secondary_revisions = [
        NotebookRevision.objects.create(
            notebook=test_notebook,
            title="Revision %s" % i,
            content="*fake notebook content %s*" % i,
            is_draft=False,
        )
        for i in range(2, 4)
    ]
    secondary_revisions.reverse()
    url = (
        reverse("notebook-revisions-list", kwargs={"notebook_id": test_notebook.id})
        + "?"
        + "&".join(["id=%s" % str(revision.id) for revision in secondary_revisions])
    )

    resp = client.get(url)
    assert resp.status_code == 200
    assert resp.json() == [
        {
            "created": get_rest_framework_time_string(revision.created),
            "id": revision.id,
            "title": revision.title,
        }
        for revision in secondary_revisions
    ]


def test_read_revisions_non_existent_notebook(fake_user, test_notebook, client):
    resp = client.get(
        reverse("notebook-revisions-list", kwargs={"notebook_id": test_notebook.id + 1})
    )
    assert resp.status_code == 404


def test_create_notebook_revision_not_logged_in(fake_user, test_notebook, client):

    post_blob = {"title": "My cool notebook", "content": "*modified test content"}

    # should not be able to add a revision if not logged in
    resp = client.post(
        reverse("notebook-revisions-list", kwargs={"notebook_id": test_notebook.id}), post_blob
    )
    assert resp.status_code == 403
    assert NotebookRevision.objects.count() == 1


def test_create_notebook_revision_non_owner(fake_user, fake_user2, test_notebook, client):
    post_blob = {"title": "My cool notebook", "content": "*modified test content"}
    # should not be able to add a revision if not owner of notebook
    client.force_login(fake_user2)
    resp = client.post(
        reverse("notebook-revisions-list", kwargs={"notebook_id": test_notebook.id}), post_blob
    )
    assert resp.status_code == 403
    assert NotebookRevision.objects.count() == 1


def test_create_notebook_revision(fake_user, test_notebook, client):
    last_revision = NotebookRevision.objects.filter(notebook_id=test_notebook.id).first()
    post_blob = {
        "parent_revision_id": last_revision.id,
        "title": "My cool notebook",
        "content": "*modified test content",
    }

    # should be able to create a revision if we are the owner
    client.force_login(user=fake_user)
    resp = client.post(
        reverse("notebook-revisions-list", kwargs={"notebook_id": test_notebook.id}), post_blob
    )
    assert resp.status_code == 201
    assert NotebookRevision.objects.count() == 2
    new_notebook_revision = NotebookRevision.objects.first()
    assert new_notebook_revision.title == post_blob["title"]
    assert new_notebook_revision.content == post_blob["content"]

    # make sure that the title gets updated too
    test_notebook.refresh_from_db()
    assert test_notebook.title == post_blob["title"]

    # also validate that the response is what we expect
    assert resp.json() == {
        "content": post_blob["content"],
        "created": get_rest_framework_time_string(new_notebook_revision.created),
        "id": new_notebook_revision.id,
        "title": post_blob["title"],
        "is_draft": True,
    }


@pytest.mark.parametrize("bad_revision_id", [10, "abc"])
def test_create_notebook_revision_incorrect_parent_id(
    fake_user, test_notebook, client, bad_revision_id
):
    last_revision = NotebookRevision.objects.filter(notebook_id=test_notebook.id).first()
    if type(bad_revision_id) == int:
        bad_revision_id = last_revision.id + bad_revision_id
    post_blob = {
        "parent_revision_id": bad_revision_id,
        "title": "My cool notebook",
        "content": "*modified test content",
    }
    client.force_login(user=fake_user)
    resp = client.post(
        reverse("notebook-revisions-list", kwargs={"notebook_id": test_notebook.id}), post_blob
    )
    assert resp.status_code == 400

    # no new notebook revisions should be created
    assert NotebookRevision.objects.count() == 1
    only_notebook_revision = NotebookRevision.objects.first()
    assert only_notebook_revision.title == last_revision.title
    assert only_notebook_revision.content == last_revision.content

    # be sure that we get the expected error
    assert resp.json() == [
        f"Based on non-latest revision {bad_revision_id} (expected: {last_revision.id})"
    ]


def test_dont_create_unmodified_notebook_revision(fake_user, test_notebook, client):
    client.force_login(user=fake_user)

    # get latest (only) revision for test notebook
    notebook_revision = NotebookRevision.objects.first()
    original_creation_time = notebook_revision.created
    original_id = notebook_revision.id

    # unmodified post
    unmodified_post_blob = {"title": notebook_revision.title, "content": notebook_revision.content}

    resp = client.post(
        reverse("notebook-revisions-list", kwargs={"notebook_id": test_notebook.id}),
        unmodified_post_blob,
    )
    assert resp.status_code == 400

    # no new notebook revisions should be created, and the existing (only)
    # revision should be unchanged
    assert NotebookRevision.objects.count() == 1
    notebook_revision = NotebookRevision.objects.first()
    assert notebook_revision.title == unmodified_post_blob["title"]
    assert notebook_revision.content == unmodified_post_blob["content"]
    assert notebook_revision.created == original_creation_time
    assert notebook_revision.id == original_id

    # be sure that we get the expected error
    assert resp.json() == {"non_field_errors": ["Revision unchanged from previous"]}


def test_create_notebook_revision_content_empty_string(fake_user, test_notebook, client):
    last_revision = NotebookRevision.objects.filter(notebook_id=test_notebook.id).first()
    post_blob = {"parent_revision_id": last_revision.id, "title": "new title", "content": ""}
    client.force_login(user=fake_user)

    resp = client.post(
        reverse("notebook-revisions-list", kwargs={"notebook_id": test_notebook.id}), post_blob
    )

    assert resp.status_code == 201
    assert NotebookRevision.objects.count() == 2
    new_notebook_revision = NotebookRevision.objects.first()
    assert new_notebook_revision.content == post_blob["content"]
    assert new_notebook_revision.title == post_blob["title"]


def test_delete_notebook_revision_not_logged_in(test_notebook, client):
    # should not be able to delete a notebook revision if not logged in
    resp = client.delete(
        reverse(
            "notebook-revisions-detail",
            kwargs={"notebook_id": test_notebook.id, "pk": test_notebook.revisions.last().id},
        )
    )
    assert resp.status_code == 403


def test_delete_notebook_revision_not_owner(fake_user, fake_user2, test_notebook, client):
    # should not be able to delete if not owner of the notebook revision
    client.force_login(fake_user2)
    resp = client.delete(
        reverse(
            "notebook-revisions-detail",
            kwargs={"notebook_id": test_notebook.id, "pk": test_notebook.revisions.last().id},
        )
    )
    assert resp.status_code == 403


def test_delete_notebook_revision_owner(fake_user, test_notebook, client):
    # however, it should succeed if we are the owner
    client.force_login(user=fake_user)
    resp = client.delete(
        reverse(
            "notebook-revisions-detail",
            kwargs={"notebook_id": test_notebook.id, "pk": test_notebook.revisions.last().id},
        )
    )
    assert resp.status_code == 204
    assert NotebookRevision.objects.count() == 0
