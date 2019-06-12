import pytest
from django.urls import reverse
from freezegun import freeze_time

from server.notebooks.models import Notebook, NotebookRevision


@pytest.fixture
def verify_can_create_notebook(fake_user, notebook_post_blob):
    def _verify(api_client):
        resp = api_client.post(reverse("notebooks-list"), notebook_post_blob)
        assert resp.status_code == 201

        assert Notebook.objects.count() == 1
        notebook = Notebook.objects.first()
        assert notebook.title == notebook_post_blob["title"]
        assert notebook.owner == fake_user
        # should have a first revision to go along with the new notebook
        assert NotebookRevision.objects.count() == 1

    return _verify


@pytest.mark.parametrize("logged_in", [True, False])
def test_create_notebook_jwt_token(
    fake_user, client, api_client, verify_can_create_notebook, logged_in
):
    if logged_in:
        client.force_login(user=fake_user)
    resp = client.post(reverse("token_obtain_pair"), {})
    if not logged_in:
        assert resp.status_code == 401
        assert resp.content == b'{"detail":"Authentication credentials were not provided."}'
    else:
        assert resp.status_code == 200
        token_data = resp.json()
        assert set(token_data.keys()) == set(["access", "refresh"])

        # should be able to create a notebook with the returned access token
        api_client.credentials(HTTP_AUTHORIZATION="Bearer " + token_data["access"])
        verify_can_create_notebook(api_client)


def test_refresh_jwt_token(
    fake_user, client, api_client, notebook_post_blob, verify_can_create_notebook
):
    client.force_login(user=fake_user)

    # get an original token
    resp = client.post(reverse("token_obtain_pair"), {})
    assert resp.status_code == 200
    original_token_data = resp.json()

    # refresh the token
    resp = client.post(reverse("token_refresh"), {"refresh": original_token_data["refresh"]})
    assert resp.status_code == 200
    refreshed_token_data = resp.json()
    assert set(refreshed_token_data.keys()) == set(["access"])

    # verify that the new one is valid
    api_client.credentials(HTTP_AUTHORIZATION="Bearer " + refreshed_token_data["access"])
    verify_can_create_notebook(api_client)


def test_jwt_token_expiry(fake_user, client, api_client, notebook_post_blob):
    client.force_login(user=fake_user)

    # get an original token at some point in the distant past
    with freeze_time("2012-01-14"):
        resp = client.post(reverse("token_obtain_pair"), {})
        assert resp.status_code == 200
        token_data = resp.json()

    # token should be unusable, since it will already have expired
    api_client.credentials(HTTP_AUTHORIZATION="Bearer " + token_data["access"])
    resp = api_client.post(reverse("notebooks-list"), notebook_post_blob)
    assert resp.status_code == 403

    # likewise, attempting to refresh the token should fail
    resp = api_client.post(reverse("token_refresh"), {"refresh": token_data["refresh"]})
    assert resp.status_code == 401
