import mock
from django.conf import settings
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import Resolver404

from server.openidc.middleware import OpenIDCAuthMiddleware


class OpenIDCAuthMiddlewareTests(TestCase):
    def setUp(self):
        self.response = "Response"
        self.middleware = OpenIDCAuthMiddleware(lambda request: self.response)

        mock_resolve_patcher = mock.patch("server.openidc.middleware.resolve")
        self.mock_resolve = mock_resolve_patcher.start()
        self.addCleanup(mock_resolve_patcher.stop)

    def test_request_missing_headers_still_works(self):
        request = mock.Mock()
        request.META = {}

        response = self.middleware(request)

        self.assertEqual(response, self.response)

    def test_user_created_with_correct_email_from_header(self):
        user_email = "user@example.com"

        request = mock.Mock()
        request.META = {settings.OPENIDC_EMAIL_HEADER: user_email}

        User = get_user_model()

        self.assertEqual(User.objects.all().count(), 0)

        with self.settings(OPENIDC_AUTH_WHITELIST=[]):
            response = self.middleware(request)

        self.assertEqual(response, self.response)
        self.assertEqual(User.objects.all().count(), 1)

        self.assertEqual(request.user.email, user_email)
        self.assertFalse(request.user.is_staff)
