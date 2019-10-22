import datetime
import json
from unittest.mock import call, patch

import pytest
import responses
from django.urls import reverse
from django.utils import timezone
from freezegun import freeze_time

from server.files.models import File, FileSource, FileUpdateOperation
from server.files.tasks import execute_file_update_operation, execute_scheduled_file_operations


@responses.activate
@pytest.mark.parametrize("file_exists", [True, False])
def test_execute_file_update_operation(test_notebook, test_file_source, file_exists):
    if file_exists:
        original_file = File.objects.create(
            notebook_id=test_notebook.id, filename=test_file_source.filename, content=b"1234"
        )

    update_operation = FileUpdateOperation.objects.create(file_source=test_file_source)
    assert update_operation.status == FileUpdateOperation.PENDING

    file_content = {"result": "foo"}

    def request_callback(request):
        update_operation.refresh_from_db()
        assert update_operation.status == FileUpdateOperation.RUNNING
        return (200, {}, json.dumps(file_content))

    # this somewhat awkward construction is due to the fact that responses
    # doesn't yet support streaming with callbacks, see:
    # https://github.com/getsentry/responses/issues/228
    with responses.RequestsMock() as requests_mock:
        requests_mock._matches.append(
            responses.CallbackResponse("GET", test_file_source.url, request_callback, stream=True)
        )
        execute_file_update_operation(update_operation.id)

    update_operation.refresh_from_db()
    assert update_operation.status == FileUpdateOperation.COMPLETED
    assert update_operation.started_at and update_operation.ended_at
    assert update_operation.ended_at > update_operation.started_at

    file = File.objects.get(notebook_id=test_notebook.id, filename=test_file_source.filename)
    assert file.content.tobytes().decode("utf-8") == json.dumps(file_content)
    if file_exists:
        assert file.last_updated > original_file.last_updated


@responses.activate
def test_execute_file_update_operation_file_too_big(settings, test_notebook, test_file_source):
    # if the file is too big, we should just fail and not create the file
    settings.MAX_FILE_SIZE = 128

    responses.add(
        responses.GET,
        test_file_source.url,
        body="s" * (settings.MAX_FILE_SIZE * 2),
        status=200,
        stream=True,
    )

    update_operation = FileUpdateOperation.objects.create(file_source=test_file_source)
    execute_file_update_operation(update_operation.id)

    # the operation should have failed
    update_operation.refresh_from_db()
    assert update_operation.status == FileUpdateOperation.FAILED
    assert update_operation.started_at and update_operation.ended_at
    assert update_operation.ended_at > update_operation.started_at
    assert update_operation.failure_reason == "File too large"
    assert File.objects.count() == 0


@responses.activate
def test_execute_file_update_operation_permission_denied(test_notebook, test_file_source):
    # test that we set the failure status correctly if the operation itself
    # fails due to a permissions error on the server
    responses.add(responses.GET, test_file_source.url, body="DENIED", status=403, stream=True)
    update_operation = FileUpdateOperation.objects.create(file_source=test_file_source)
    execute_file_update_operation(update_operation.id)

    # the operation should have failed
    update_operation.refresh_from_db()
    assert update_operation.status == FileUpdateOperation.FAILED
    assert update_operation.started_at and update_operation.ended_at
    assert update_operation.ended_at > update_operation.started_at
    assert (
        update_operation.failure_reason
        == f"403 Client Error: Forbidden for url: {test_file_source.url}"
    )
    assert File.objects.count() == 0


@pytest.mark.parametrize("date", ["2019-07-08", "2019-07-10"])
def test_run_scheduled_file_operations(fake_user, test_notebook, date):
    # three file source operations: one should be executed daily, one weekly,
    # one never
    file_sources = []
    for (i, interval) in enumerate([datetime.timedelta(days=1), datetime.timedelta(weeks=1), None]):
        file_sources.append(
            FileSource.objects.create(
                notebook=test_notebook,
                filename=f"{i}.json",
                url=f"https://iodide.io/{i}.json",
                update_interval=interval,
            )
        )
    weekly_ids = set([file_sources[0].id, file_sources[1].id])
    daily_ids = set([file_sources[0].id])

    with freeze_time(date):
        with patch("server.files.tasks.tasks.schedule") as mock_schedule:
            execute_scheduled_file_operations()
            update_operations = FileUpdateOperation.objects.all()
            if date == "2019-07-08":
                # 2019-07-08 is a monday, so the weekly task should have run
                assert set(update_operations.values_list("file_source_id", flat=True)) == weekly_ids
            else:  # 2019-07-10
                # only the daily task should have run
                assert set(update_operations.values_list("file_source_id", flat=True)) == daily_ids
            # also make sure we queued the relevant async tasks
            mock_schedule.assert_has_calls(
                [
                    call(execute_file_update_operation, id)
                    for id in update_operations.values_list("id", flat=True)
                ]
            )


@pytest.mark.freeze_time("2017-05-21")
def test_post_file_update_operation(fake_user, test_notebook, test_file_source, client):
    with patch("server.files.tasks.tasks.schedule") as mock_schedule:
        client.force_login(user=fake_user)
        resp = client.post(
            reverse("file-update-operations-list"), {"file_source_id": test_file_source.id}
        )
        assert resp.status_code == 201

        # verify that we have a file update operation with the expected status
        assert FileUpdateOperation.objects.count() == 1
        file_update_operation = FileUpdateOperation.objects.first()
        assert file_update_operation.file_source_id == test_file_source.id
        assert file_update_operation.status == FileUpdateOperation.PENDING
        assert file_update_operation.scheduled_at == timezone.now()
        assert file_update_operation.started_at is None
        assert file_update_operation.ended_at is None

        # verify that the expected task has been queued
        mock_schedule.assert_has_calls(
            [call(execute_file_update_operation, file_update_operation.id)]
        )
