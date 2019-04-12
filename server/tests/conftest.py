import os
import sys

import pytest
from rest_framework.test import APIClient

from server.base.models import User
from server.files.models import File
from server.notebooks.models import Notebook, NotebookRevision

sys.path.append(os.path.join(os.path.dirname(__file__), "helpers"))


@pytest.fixture
def api_client():
    """
    A django-rest-framework APIClient instance:
    http://www.django-rest-framework.org/api-guide/testing/#apiclient
    """
    return APIClient()


@pytest.fixture
def fake_user(transactional_db):
    user = User.objects.create(username="testuser1", email="user@foo.com")
    return user


@pytest.fixture
def fake_user2(transactional_db):
    user = User.objects.create(username="testuser2", email="user@bar.com")
    return user


@pytest.fixture
def test_notebook(fake_user):
    notebook = Notebook.objects.create(owner=fake_user, title="Fake notebook")
    NotebookRevision.objects.create(
        notebook=notebook, title="First revision", content="*fake notebook content*"
    )
    return notebook


@pytest.fixture
def test_file(test_notebook):
    return File.objects.create(
        notebook=test_notebook, filename="test.csv", content=b"a,b\n12,34\n56,78"
    )


@pytest.fixture
def two_test_notebooks(fake_user):
    notebooks = []
    for i in range(2):
        notebook = Notebook.objects.create(owner=fake_user, title="Fake notebook %s" % i)
        NotebookRevision.objects.create(
            notebook=notebook,
            title="First revision of notebook %s" % i,
            content="*fake notebook content %s*" % i,
        )
        notebooks.append(notebook)
    return notebooks


@pytest.fixture
def ten_test_notebooks(fake_user):
    """
    Half of these notebooks have >= 10 revisions.
    """
    notebooks = []
    for i in range(10):
        notebook = Notebook.objects.create(owner=fake_user, title="Fake notebook %s" % i)
        NotebookRevision.objects.create(
            notebook=notebook,
            title="First revision of notebook %s" % i,
            content="*fake notebook content %s*" % i,
        )
        # every other notebook gets 10 revisions so it will show up in the index page list
        if i % 2 == 0:
            for j in range(1, 10):
                NotebookRevision.objects.create(
                    notebook=notebook,
                    title="Revision %s of notebook %s" % (j, i),
                    content="*fake notebook content %s revision %s" % (i, j),
                )
        notebooks.append(notebook)
    return notebooks


@pytest.fixture
def notebook_post_blob():
    # this blob should be sufficient to create a new notebook (assuming the user of
    # the api is authorized to do so)
    return {"title": "My cool notebook", "content": "Fake notebook content"}
