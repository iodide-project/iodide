import mock
import pytest
from django.core.exceptions import PermissionDenied

from server.notebooks.middleware import NotebookEvalFrameMiddleware


@pytest.fixture
def fake_eval_frame_origin(settings):
    settings.EVAL_FRAME_HOSTNAME = "foobar.com"
    return settings.EVAL_FRAME_HOSTNAME


@pytest.mark.parametrize(
    "test_case", [("/api/v1/notebooks/", False), ("/notebooks/eval-frame/", True)]
)
def test_access_uris_from_eval_frame_origin(fake_eval_frame_origin, test_case):
    (path, should_allow) = test_case
    response = "Response"
    middleware = NotebookEvalFrameMiddleware(lambda request: response)
    request = mock.Mock(**{"get_host.return_value": fake_eval_frame_origin, "path": path})
    if should_allow:
        assert response == middleware(request)
    else:
        with pytest.raises(PermissionDenied):
            middleware(request)
