from datetime import timedelta

import pytest
from django.urls import reverse

from server.files.models import FileSource


@pytest.fixture
def test_file_source(test_notebook):
    return FileSource.objects.create(
        notebook=test_notebook,
        filename="foo.csv",
        source="https://iodide.io/foo",
        update_interval=timedelta(days=1)
    )


@pytest.fixture
def file_source_post_blob(test_notebook):
    return {
        "notebook_id": test_notebook.id,
        "filename": "foo2.csv",
        "source": "https://iodide.io/foo2",
        "update_interval": "1 00"
    }


@pytest.fixture
def file_source_update_blob(test_notebook):
    return {
        "notebook_id": test_notebook.id,
        "filename": "foo3.csv",
        "source": "https://iodide.io/foo3",
        "update_interval": "2 00"
    }


def test_delete_file_source(client, test_file_source, fake_user):
    client.force_login(user=fake_user)
    resp = client.delete(reverse("file-sources-detail", kwargs={"pk": test_file_source.id}))
    assert resp.status_code == 204
    assert FileSource.objects.count() == 0


@pytest.mark.parametrize("logged_in", [True, False])
def test_delete_file_source_unauthorized(client, test_file_source, fake_user2,
                                         logged_in):
    # two cases: logged in as wrong user, not logged in
    if logged_in:
        client.force_login(user=fake_user2)
    resp = client.delete(reverse("file-sources-detail", kwargs={"pk": test_file_source.id}))
    assert resp.status_code == 403
    assert FileSource.objects.count() == 1


def test_create_file_source(client, test_notebook, fake_user, file_source_post_blob):
    client.force_login(user=fake_user)
    resp = client.post(reverse("file-sources-list"), file_source_post_blob)
    assert resp.status_code == 201
    # fixme: verify return value
    assert FileSource.objects.count() == 1
    file_source = FileSource.objects.first()
    assert file_source.notebook_id == test_notebook.id


@pytest.mark.parametrize("logged_in", [True, False])
def test_create_file_source_unauthorized(client, fake_user2,
                                         file_source_post_blob, logged_in):
    # two cases: logged in as wrong user, not logged in
    if logged_in:
        client.force_login(user=fake_user2)
    resp = client.post(reverse("file-sources-list"), file_source_post_blob)
    assert resp.status_code == 403
    assert FileSource.objects.count() == 0


def test_update_file_source(api_client, test_file_source, file_source_update_blob,
                            test_notebook, fake_user):
    # we use the django rest framework's api client for this test, as it
    # lets us use the same payload for a put request as for post
    api_client.force_authenticate(user=fake_user)
    resp = api_client.put(reverse("file-sources-detail",
                                  kwargs={"pk": test_file_source.id}),
                          file_source_update_blob)
    assert resp.status_code == 200
    # fixme: verify return value
    assert FileSource.objects.count() == 1
    file_source = FileSource.objects.first()
    assert file_source.notebook_id == test_notebook.id
    assert file_source.filename == file_source_update_blob['filename']
    assert file_source.source == file_source_update_blob['source']
    assert file_source.update_interval == timedelta(days=2)


@pytest.mark.parametrize("logged_in", [True, False])
def test_update_file_source_unauthorized(api_client, test_file_source,
                                         fake_user2, file_source_update_blob, logged_in):
    # two cases: logged in as wrong user, not logged in
    if logged_in:
        api_client.force_authenticate(user=fake_user2)
    resp = api_client.put(reverse("file-sources-detail",
                                  kwargs={"pk": test_file_source.id}),
                          file_source_update_blob)
    assert resp.status_code == 403
    file_source = FileSource.objects.first()
    assert file_source.filename == 'foo.csv'
    assert file_source.source == 'https://iodide.io/foo'
    assert file_source.update_interval == timedelta(days=1)
