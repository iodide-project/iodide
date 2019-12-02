import json
import tempfile

import pytest
from django.urls import reverse

from server.files.models import File

from .helpers import get_rest_framework_time_string


def post_file(f, client, test_notebook):
    f.write("hello")
    f.seek(0)
    return client.post(
        reverse("files-list"),
        {
            "metadata": json.dumps(
                {"filename": "my cool file.csv", "notebook_id": test_notebook.id}
            ),
            "file": open(f.name),
        },
    )


def test_post_to_file_api(fake_user, client, test_notebook):
    client.force_login(user=fake_user)
    with tempfile.NamedTemporaryFile(mode="w+") as f:
        resp = post_file(f, client, test_notebook)
        assert resp.status_code == 201
        assert File.objects.count() == 1
        resp_json = resp.json()
        created_file = File.objects.get(id=resp_json["id"])
        assert created_file.content.tobytes() == b"hello"
        assert resp_json == {
            "id": created_file.id,
            "last_updated": get_rest_framework_time_string(created_file.last_updated),
            "filename": "my cool file.csv",
            "notebook_id": test_notebook.id,
        }


@pytest.mark.parametrize("logged_in", [True, False])
def test_post_to_file_api_restricted(fake_user2, client, test_notebook, logged_in):
    # two cases: logged in as wrong user, not logged in
    if logged_in:
        client.force_login(user=fake_user2)
    with tempfile.NamedTemporaryFile(mode="w+") as f:
        resp = post_file(f, client, test_notebook)
        assert resp.status_code == 403
        assert File.objects.count() == 0


def put_file(f, api_client, test_file, test_notebook):
    f.write("new-information")
    f.seek(0)
    return api_client.put(
        reverse("files-detail", kwargs={"pk": test_file.id}),
        {
            "metadata": json.dumps({"filename": "test-2.csv", "notebook_id": test_notebook.id}),
            "file": open(f.name),
        },
    )


def test_put_to_file_api(fake_user, api_client, test_notebook, test_file):
    # we use the django rest framework's api client for this test, as it
    # lets us use the same payload for a put request as for post
    api_client.force_authenticate(user=fake_user)
    with tempfile.NamedTemporaryFile(mode="w+") as f:
        resp = put_file(f, api_client, test_file, test_notebook)
        assert resp.status_code == 201
        assert File.objects.count() == 1
        updated_file = File.objects.get(id=test_file.id)
        assert updated_file.content.tobytes() == b"new-information"
        assert updated_file.content.tobytes() != test_file.content
        assert resp.json() == {
            "id": updated_file.id,
            "last_updated": get_rest_framework_time_string(updated_file.last_updated),
            "filename": "test-2.csv",
            "notebook_id": test_notebook.id,
        }


@pytest.mark.parametrize("logged_in", [True, False])
def test_put_to_file_api_restricted(fake_user2, api_client, test_notebook, test_file, logged_in):
    # two cases: logged in as wrong user, not logged in
    if logged_in:
        api_client.force_authenticate(user=fake_user2)
    with tempfile.NamedTemporaryFile(mode="w+") as f:
        resp = put_file(f, api_client, test_file, test_notebook)
        assert resp.status_code == 403
        updated_file = File.objects.get(id=test_file.id)
        assert updated_file.content.tobytes() == test_file.content


def test_list_files_for_notebook(client, test_notebook, test_file, fake_user):
    client.force_login(user=fake_user)
    resp = client.get(reverse("notebook-files-list", kwargs={"notebook_id": test_notebook.id}))
    assert resp.status_code == 200
    assert resp.json() == [
        {
            "filename": test_file.filename,
            "id": test_file.id,
            "notebook_id": test_file.notebook_id,
            "last_updated": test_file.last_updated.isoformat().replace("+00:00", "Z"),
        }
    ]
