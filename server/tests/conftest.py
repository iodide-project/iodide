import datetime

import pytest
from rest_framework.test import APIClient

from server.base.models import User
from server.celery import celery
from server.files.models import File, FileSource
from server.notebooks.models import Notebook, NotebookRevision


def pytest_configure(config):
    # work-around for https://github.com/ktosiek/pytest-freezegun/issues/13
    config.addinivalue_line(
        "markers",
        "freeze_time(timestamp): freeze time to the given timestamp for the duration of the test.",
    )


@pytest.fixture(scope="session")
def celery_includes():
    """You can override this include modules when a worker start.
    You can have this return a list of module names to import,
    these can be task modules, modules registering signals, and so on.
    """
    return ["celery.contrib.testing.tasks"]


@pytest.fixture
def celery_worker_parameters():
    """Redefine this fixture to change the init parameters of Celery workers.

    This can be used e. g. to define queues the worker will consume tasks from.

    The dict returned by your fixture will then be used
    as parameters when instantiating :class:`~celery.worker.WorkController`.
    """
    return {
        # For some reason this `celery.ping` is not registed IF our own worker is still
        # running. To avoid failing tests in that case, we disable the ping check.
        # see: https://github.com/celery/celery/issues/3642#issuecomment-369057682
        # here is the ping task: `from celery.contrib.testing.tasks import ping`
        "perform_ping_check": False
    }


@pytest.fixture
def celery_app(transactional_db):
    return celery


@pytest.fixture
def api_client():
    """
    A django-rest-framework APIClient instance:
    http://www.django-rest-framework.org/api-guide/testing/#apiclient
    """
    return APIClient()


@pytest.fixture
def restricted_api(settings):
    settings.RESTRICT_API = True


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
def notebook_post_blob():
    # this blob should be sufficient to create a new notebook (assuming the user of
    # the api is authorized to do so)
    return {"title": "My cool notebook", "content": "Fake notebook content"}


@pytest.fixture
def test_file_source(test_notebook):
    return FileSource.objects.create(
        notebook=test_notebook,
        filename="foo.csv",
        url="https://iodide.io/foo",
        update_interval=datetime.timedelta(days=1),
    )
