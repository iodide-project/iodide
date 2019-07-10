import json

import pytest
import responses
from django.urls import reverse
from unittest.mock import (call, patch)

from server.files.models import (File, FileUpdateOperation)
from server.files.tasks import execute_file_update_operation


@responses.activate
@pytest.mark.parametrize("file_exists", [True, False])
def test_execute_file_update_operation(test_notebook, test_file_source, file_exists):
    if file_exists:
        original_file = File.objects.create(notebook_id=test_notebook.id,
                                            filename=test_file_source.filename,
                                            content=b'1234')

    update_operation = FileUpdateOperation.objects.create(
        file_source=test_file_source
    )
    assert update_operation.status == FileUpdateOperation.PENDING

    file_content = {'result': 'foo'}
    def request_callback(request):
        update_operation.refresh_from_db()
        assert update_operation.status == FileUpdateOperation.RUNNING
        return (200, {}, json.dumps(file_content))
    # this somewhat awkward construction is due to the fact that responses
    # doesn't yet support streaming with callbacks, see:
    # https://github.com/getsentry/responses/issues/228
    with responses.RequestsMock() as requests_mock:
        requests_mock._matches.append(responses.CallbackResponse(
            'GET',
            test_file_source.url,
            request_callback, stream=True
        ))
        execute_file_update_operation(update_operation.id)

    update_operation.refresh_from_db()
    assert update_operation.status == FileUpdateOperation.COMPLETED

    file = File.objects.get(notebook_id=test_notebook.id,
                            filename=test_file_source.filename)
    assert file.content.tobytes().decode("utf-8") == json.dumps(file_content)
    if file_exists:
        assert file.last_updated > original_file.last_updated


@responses.activate
def test_execute_file_update_operation_file_too_big(settings, test_notebook, test_file_source):
    # if the file is too big, we should just fail and not create the file
    settings.MAX_FILE_SIZE = 128

    responses.add(responses.GET, test_file_source.url,
                  body='s' * (settings.MAX_FILE_SIZE * 2), status=200, stream=True)

    update_operation = FileUpdateOperation.objects.create(
        file_source=test_file_source
    )
    execute_file_update_operation(update_operation.id)

    # the operation should have failed
    update_operation.refresh_from_db()
    assert update_operation.status == FileUpdateOperation.FAILED
    assert update_operation.failure_reason == "File too large"
    assert File.objects.count() == 0


def test_post_file_update_operation(fake_user, test_notebook, test_file_source, client):
    with patch('server.files.tasks.execute_file_update_operation.apply_async') as mock_task:
        client.force_login(user=fake_user)
        resp = client.post(reverse("file-update-operations-list"), { 'file_source_id': test_file_source.id })
        assert resp.status_code == 201

        # verify that we have a file update operation with the expected status
        assert FileUpdateOperation.objects.count() == 1
        file_update_operation = FileUpdateOperation.objects.first()
        assert file_update_operation.file_source_id == test_file_source.id
        assert file_update_operation.status == FileUpdateOperation.PENDING

        # verify that the expected task has been queued
        mock_task.assert_has_calls([call(args=[file_update_operation.id])])
