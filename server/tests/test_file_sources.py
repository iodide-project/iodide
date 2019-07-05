import json

import pytest
import responses

from server.files.models import File, FileUpdateOperation
from server.files.tasks import execute_file_update_operation


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

    file = File.objects.get(notebook_id=test_notebook.id, filename=test_file_source.filename)
    assert file.content.tobytes().decode("utf-8") == json.dumps(file_content)
    if file_exists:
        assert file.last_updated > original_file.last_updated
