import json

import pytest
from django import VERSION as django_version
from django.conf import settings
from django.core.checks.registry import registry
from django.db import connection
from django.test.utils import CaptureQueriesContext
from dockerflow.django.middleware import DockerflowMiddleware


@pytest.fixture
def dockerflow_enabled():
    settings.DOCKERFLOW_ENABLED = True


@pytest.fixture
def reset_checks():
    if django_version[0] < 2:
        registry.registered_checks = []
        registry.deployment_checks = []
    else:
        registry.registered_checks = set()
        registry.deployment_checks = set()


@pytest.fixture
def dockerflow_middleware():
    return DockerflowMiddleware()


@pytest.fixture
def version_content():
    return {
        "source": "https://github.com/iodide-project/iodide/",
        "version": "release tag or string for humans",
        "commit": "<git hash>",
        "build": "uri to CI build job",
    }


@pytest.mark.django_db
def test_heartbeat(dockerflow_middleware, reset_checks, rf, dockerflow_enabled):
    request = rf.get("/__heartbeat__")
    response = dockerflow_middleware.process_request(request)
    assert response.status_code == 200
    assert (json.loads(response.content.decode()))["status"] == "ok"


@pytest.mark.django_db
def test_lbheartbeat(dockerflow_middleware, rf, dockerflow_enabled):
    queries = CaptureQueriesContext(connection)
    request = rf.get("/__lbheartbeat__")
    with queries:
        response = dockerflow_middleware.process_request(request)
        assert response.status_code == 200


@pytest.mark.django_db
def test_version_exists(dockerflow_middleware, mocker, rf, version_content, dockerflow_enabled):
    mocker.patch("dockerflow.version.get_version", return_value=version_content)
    request = rf.get("/__version__")
    response = dockerflow_middleware.process_request(request)
    assert response.status_code == 200
    assert json.loads(response.content.decode()) == version_content


@pytest.mark.django_db
def test_version_missing(dockerflow_middleware, mocker, rf, dockerflow_enabled):
    mocker.patch("dockerflow.version.get_version", return_value=None)
    request = rf.get("/__version__")
    response = dockerflow_middleware.process_request(request)
    assert response.status_code == 404
