import pytest
from django.urls import reverse

from helpers import get_rest_framework_time_string
from server.notebooks.models import Notebook, NotebookRevision


def test_notebook_list(client, two_test_notebooks):
    resp = client.get(reverse("notebooks-list"))
    assert resp.status_code == 200
    assert resp.json() == [
        {"id": notebook.id, "owner": "testuser1", "title": notebook.title, "forked_from": None}
        for notebook in Notebook.objects.all()
    ]


def test_notebook_detail(client, test_notebook):
    initial_revision = NotebookRevision.objects.filter(notebook=test_notebook).last()
    resp = client.get(reverse("notebooks-detail", kwargs={"pk": test_notebook.id}))
    assert resp.status_code == 200
    assert resp.json() == {
        "id": test_notebook.id,
        "owner": "testuser1",
        "title": initial_revision.title,
        "forked_from": None,
        "latest_revision": {
            "content": initial_revision.content,
            "created": get_rest_framework_time_string(initial_revision.created),
            "id": initial_revision.id,
            "title": initial_revision.title,
        },
    }

    # add another revision, make sure all return values are updated
    # appropriately
    new_revision = NotebookRevision.objects.create(
        notebook=test_notebook, title="Second revision", content="*updated fake notebook content*"
    )
    resp = client.get(reverse("notebooks-detail", kwargs={"pk": test_notebook.id}))
    assert resp.status_code == 200
    assert resp.json() == {
        "id": test_notebook.id,
        "owner": "testuser1",
        "title": "Second revision",
        "forked_from": None,
        "latest_revision": {
            "content": new_revision.content,
            "created": get_rest_framework_time_string(new_revision.created),
            "id": new_revision.id,
            "title": new_revision.title,
        },
    }


def test_create_notebook_not_logged_in(transactional_db, client, notebook_post_blob):
    # should not be able to create a notebook if not logged in
    resp = client.post(reverse("notebooks-list"), notebook_post_blob)
    assert resp.status_code == 403
    assert Notebook.objects.count() == 0


@pytest.mark.parametrize("specify_owner", [True, False])
def test_create_notebook_logged_in(fake_user, client, notebook_post_blob, specify_owner):
    # should be able to create notebook if logged in
    client.force_login(user=fake_user)
    post_blob = {**notebook_post_blob}
    if specify_owner:
        post_blob.update({"owner": fake_user.username})
    resp = client.post(reverse("notebooks-list"), post_blob)
    assert resp.status_code == 201
    assert Notebook.objects.count() == 1
    notebook = Notebook.objects.first()
    assert notebook.title == post_blob["title"]
    assert notebook.owner == fake_user
    notebook_revision = NotebookRevision.objects.get(notebook=notebook)

    # the response should also contain the revision id and other
    # data that we want
    assert resp.json() == {
        "forked_from": None,
        "id": notebook.id,
        "owner": fake_user.username,
        "title": notebook.title,
        "latest_revision": {
            "content": notebook_revision.content,
            "created": get_rest_framework_time_string(notebook_revision.created),
            "id": notebook_revision.id,
            "title": notebook_revision.title,
        },
    }
    # should have a first revision to go along with the new notebook
    assert NotebookRevision.objects.count() == 1


@pytest.mark.parametrize("authorized", [True, False])
def test_create_notebook_for_another_user(
    fake_user, fake_user2, client, notebook_post_blob, authorized
):
    post_blob = {**notebook_post_blob, **{"owner": fake_user2.username}}
    fake_user.can_create_on_behalf_of_others = authorized
    fake_user.save()
    client.force_login(user=fake_user)
    resp = client.post(reverse("notebooks-list"), post_blob)
    if authorized:
        assert resp.status_code == 201
        assert Notebook.objects.count() == 1
        notebook = Notebook.objects.first()
        assert notebook.title == post_blob["title"]
        assert notebook.owner == fake_user2
    else:
        assert resp.status_code == 403
        assert Notebook.objects.count() == 0
        assert NotebookRevision.objects.count() == 0


def test_delete_notebook_not_logged_in(test_notebook, client):
    # should not be able to delete a notebook if not logged in
    resp = client.delete(reverse("notebooks-detail", kwargs={"pk": test_notebook.id}))
    assert resp.status_code == 403


def test_delete_notebook_not_owner(fake_user, fake_user2, test_notebook, client):
    # should not be able to delete if not owner of the notebook
    client.force_login(fake_user2)
    resp = client.delete(reverse("notebooks-detail", kwargs={"pk": test_notebook.id}))
    assert resp.status_code == 403


def test_delete_notebook_owner(fake_user, test_notebook, client):
    # however, it should succeed if we are the owner
    client.force_login(user=fake_user)
    resp = client.delete(reverse("notebooks-detail", kwargs={"pk": test_notebook.id}))
    assert resp.status_code == 204
    assert Notebook.objects.count() == 0
    assert NotebookRevision.objects.count() == 0


@pytest.fixture
def notebook_fork_post_blob():
    # this blob should be sufficient to create a new notebook (assuming the user of
    # the api is authorized to do so)
    return {"title": "My cool notebook", "content": "Fake notebook content", "forked_from": 11}


@pytest.fixture
def incorrect_notebook_fork_post_blob():
    # this blob should be sufficient to create a new notebook (assuming the user of
    # the api is authorized to do so)
    return {"title": "My cool notebook", "content": "Fake notebook content", "forked_from": 1}


def test_fork_notebook_not_logged_in(client, notebook_fork_post_blob):
    resp = client.post(reverse("notebooks-list"), notebook_fork_post_blob)
    assert resp.status_code == 403


def test_incorrect_fork_notebook(client, fake_user, incorrect_notebook_fork_post_blob):
    client.force_login(user=fake_user)
    resp = client.post(reverse("notebooks-list"), incorrect_notebook_fork_post_blob)
    assert resp.status_code == 400


def test_fork_notebook_logged_in(client, fake_user, fake_user2, test_notebook):
    client.force_login(user=fake_user)
    blob = {
        "title": "My cool notebook",
        "content": "Fake notebook content",
        "forked_from": test_notebook.revisions.latest("created").id,
    }
    resp = client.post(reverse("notebooks-list"), blob)
    assert resp.status_code == 201
    assert resp.json()["forked_from"] == test_notebook.revisions.get().id


def test_fork_notebook_and_delete_original(
    client, fake_user, fake_user2, test_notebook, notebook_fork_post_blob
):
    client.force_login(user=fake_user)
    revision = test_notebook.revisions.latest("created")
    response = client.post(
        reverse("notebooks-list"),
        {"title": "test", "content": "some fantastic content", "forked_from": revision.id},
    )
    forked_notebook = Notebook.objects.get(id=response.json()["id"])
    client.delete(reverse("notebooks-detail", kwargs={"pk": test_notebook.id}))
    forked_response = client.get(reverse("notebooks-detail", kwargs={"pk": forked_notebook.id}))
    forked_notebook_after_deletion = Notebook.objects.get(id=forked_response.json()["id"])
    assert Notebook.objects.count() == 1
    assert forked_notebook_after_deletion.forked_from is None
    assert forked_notebook_after_deletion.title == "test"
    assert forked_response.status_code == 200
