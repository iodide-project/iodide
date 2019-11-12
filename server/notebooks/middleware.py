from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.urls import reverse


class NotebookEvalFrameMiddleware(object):
    """
    A piece of middleware which denies access to any resource aside from the
    eval frame view and its resources when accessing using the eval frame
    middleware

    Should only be enabled if serving the eval frame from a seperate origin
    """

    MIDDLEWARE_PATHS = set(
        [reverse("eval-frame-view"), "iodide.eval-frame.css", "iodide.eval-frame.js"]
    )

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if (
            request.get_host() == settings.EVAL_FRAME_HOSTNAME
            and request.path not in self.MIDDLEWARE_PATHS
        ):
            raise PermissionDenied()

        # otherwise just pass through
        return self.get_response(request)
