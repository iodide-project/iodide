import pytest
from rest_framework.test import APIClient

from server.base.models import User
from server.notebooks.models import (Notebook,
                                     NotebookRevision)


@pytest.fixture
def client():
    """
    A django-rest-framework APIClient instance:
    http://www.django-rest-framework.org/api-guide/testing/#apiclient
    """
    return APIClient()


@pytest.fixture
def fake_user(transactional_db):
    return User.objects.create(username="testuser1",
                               email="user@foo.com",
                               password="123")


@pytest.fixture
def fake_user2(transactional_db):
    return User.objects.create(username="testuser2",
                               email="user@bar.com",
                               password="123")


@pytest.fixture
def test_notebook(fake_user):
    notebook = Notebook.objects.create(owner=fake_user,
                                       title='Fake notebook')
    NotebookRevision.objects.create(notebook=notebook,
                                    title="First revision",
                                    content="*fake notebook content*")
    return notebook


@pytest.fixture
def two_test_notebooks(fake_user):
    notebooks = []
    for i in range(2):
        notebook = Notebook.objects.create(owner=fake_user,
                                           title='Fake notebook %s' % i)
        NotebookRevision.objects.create(notebook=notebook,
                                        title="First revision of notebook %s" % i,
                                        content="*fake notebook content %s*" % i)
        notebooks.append(notebook)
    return notebooks
