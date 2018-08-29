import pytest
from django.urls import reverse
from freezegun import freeze_time

from server.notebooks.models import (Notebook,
                                     NotebookRevision)


def test_notebook_list(client, two_test_notebooks):
    resp = client.get(reverse('notebooks-list'))
    assert resp.status_code == 200
    assert resp.json() == [
        {
            "id": notebook.id,
            "owner": "testuser1",
            "title": notebook.title
        } for notebook in Notebook.objects.all()
    ]


@freeze_time('2018-07-01 13:00')
def test_notebook_detail(client, test_notebook):
    resp = client.get(reverse('notebooks-detail', kwargs={'pk': test_notebook.id}))
    assert resp.status_code == 200
    assert resp.json() == {
        "id": test_notebook.id,
        "owner": "testuser1",
        "title": test_notebook.title,
        "latest_revision": None
    }

    # add a revision, make sure it displays
    NotebookRevision.objects.create(notebook=test_notebook,
                                    title="First revision",
                                    content="*fake notebook content*")
    resp = client.get(reverse('notebooks-detail', kwargs={'pk': test_notebook.id}))
    assert resp.status_code == 200
    assert resp.json() == {
        "id": test_notebook.id,
        "owner": "testuser1",
        "title": "First revision",
        "latest_revision": {
            "content": "*fake notebook content*",
            "created": "2018-07-01T13:00:00Z",
            "id": 1,
            "title": "First revision"
        }
    }

    # add another revision, make sure all return values are updated
    # appropriately
    NotebookRevision.objects.create(notebook=test_notebook,
                                    title="Second revision",
                                    content="*updated fake notebook content*")
    resp = client.get(reverse('notebooks-detail', kwargs={'pk': test_notebook.id}))
    assert resp.status_code == 200
    assert resp.json() == {
        "id": test_notebook.id,
        "owner": "testuser1",
        "title": "Second revision",
        "latest_revision": {
            "content": "*updated fake notebook content*",
            "created": "2018-07-01T13:00:00Z",
            "id": 2,
            "title": "Second revision"
        }
    }


@pytest.fixture
def notebook_post_blob():
    # this blob should be sufficient to create a new notebook (assuming the user of
    # the api is authorized to do so)
    return {
        'title': 'My cool notebook',
        'content': 'Fake notebook content'
    }


def test_create_notebook_not_logged_in(transactional_db, client, notebook_post_blob):
    # should not be able to create a notebook if not logged in
    resp = client.post(reverse('notebooks-list'), notebook_post_blob)
    assert resp.status_code == 403
    assert Notebook.objects.count() == 0


def test_create_notebook_logged_in(fake_user, client, notebook_post_blob):
    # should be able to create notebook if logged in
    client.force_authenticate(user=fake_user)
    resp = client.post(reverse('notebooks-list'), notebook_post_blob)
    assert resp.status_code == 201
    assert Notebook.objects.count() == 1
    notebook = Notebook.objects.first()
    assert notebook.title == notebook_post_blob['title']
    assert notebook.owner == fake_user

    # should have a first revision to go along with the new notebook
    assert NotebookRevision.objects.count() == 1


def test_delete_notebook_not_logged_in(test_notebook, client):
    # should not be able to delete a notebook if not logged in
    resp = client.delete(reverse('notebooks-detail', kwargs={'pk': test_notebook.id}))
    assert resp.status_code == 403


def test_delete_notebook_not_owner(fake_user, fake_user2, test_notebook, client):
    # should not be able to delete if not owner of the notebook
    client.force_authenticate(user=fake_user2)
    resp = client.delete(reverse('notebooks-detail', kwargs={'pk': test_notebook.id}))
    assert resp.status_code == 403


def test_delete_notebook_owner(fake_user, test_notebook, client):
    # however, it should succeed if we are the owner
    client.force_authenticate(user=fake_user)
    resp = client.delete(reverse('notebooks-detail', kwargs={'pk': test_notebook.id}))
    assert resp.status_code == 204
    assert Notebook.objects.count() == 0
    assert NotebookRevision.objects.count() == 0
