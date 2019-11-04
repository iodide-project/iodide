import json

import pytest
from django.urls import reverse

from server.kernels.remote.models import RemoteOperation

from .helpers import get_rest_framework_time_string


def test_create_remote_operation_success(fake_user, client, test_notebook):
    client.force_login(user=fake_user)
    resp = client.post(
        reverse("remote-operations-list"),
        {
            "metadata": json.dumps({"backend": "query", "notebook_id": test_notebook.id}),
            "content": """
data_source = "telemetry"
output_name = "result"
filename = "user_count_query.json"
-----
select count(*) from telemetry.users
""",
        },
    )
    assert resp.status_code == 201
    assert RemoteOperation.objects.count() == 1
    remote_operation = RemoteOperation.objects.first()
    assert resp.json() == {
        "id": remote_operation.pk,
        "notebook_id": test_notebook.pk,
        "backend": "query",
        "status": remote_operation.STATUS_PENDING,
        "parameters": {"data_source": "telemetry", "output_name": "result"},
        "filename": "user_count_query.json",
        "snippet": "select count(*) from telemetry.users",
        "scheduled_at": get_rest_framework_time_string(remote_operation.scheduled_at),
        "started_at": None,
        "ended_at": None,
        "failed_at": None,
    }


def test_create_remote_operation_parse_error(fake_user, client, test_notebook):
    client.force_login(user=fake_user)
    resp = client.post(
        reverse("remote-operations-list"),
        {
            "metadata": json.dumps({"backend": "query", "notebook_id": test_notebook.id}),
            "content": """
broken = parameter
-----
select count(*) from telemetry.users
""",
        },
    )
    assert resp.status_code == 400
    assert RemoteOperation.objects.count() == 0
    assert resp.json() == {
        "detail": "The remote chunk couldn't be parsed, please check the syntax and "
        "evaluate again."
    }


@pytest.mark.parametrize("logged_in", [True, False])
def test_create_remote_operation_permission_denied(fake_user2, client, test_notebook, logged_in):
    # two cases: logged in as wrong user, not logged in
    if logged_in:
        client.force_login(user=fake_user2)
    resp = client.post(
        reverse("remote-operations-list"),
        {
            "metadata": json.dumps({"backend": "query", "notebook_id": test_notebook.id}),
            "content": "",
        },
    )
    assert resp.status_code == 403
    assert RemoteOperation.objects.count() == 0
    if logged_in:
        assert resp.json() == {
            "detail": "Remote chunks can only be executed by the notebook owner."
        }
    else:
        assert resp.json() == {"detail": "Authentication credentials were not provided."}
