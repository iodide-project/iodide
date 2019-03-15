from django.urls import reverse
from rest_framework.authtoken.models import Token

from server.notebooks.models import Notebook, NotebookRevision


def test_create_notebook_auth_token(fake_user, api_client, notebook_post_blob):
    token = Token.objects.create(user=fake_user)
    api_client.credentials(HTTP_AUTHORIZATION="Token " + token.key)

    resp = api_client.post(reverse("notebooks-list"), notebook_post_blob)
    assert resp.status_code == 201
    assert Notebook.objects.count() == 1
    notebook = Notebook.objects.first()
    assert notebook.title == notebook_post_blob["title"]
    assert notebook.owner == fake_user

    # should have a first revision to go along with the new notebook
    assert NotebookRevision.objects.count() == 1


def test_create_notebook_incorrect_auth_token(fake_user, api_client, notebook_post_blob):
    token = Token.objects.create(user=fake_user)
    api_client.credentials(HTTP_AUTHORIZATION="Token " + token.key + "BAD")

    resp = api_client.post(reverse("notebooks-list"), notebook_post_blob)
    assert resp.status_code == 403
    assert Notebook.objects.count() == 0
    assert NotebookRevision.objects.count() == 0
