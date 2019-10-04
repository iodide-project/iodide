import re

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

    def test_whitelisted_url_is_not_authed(self):
        whitelisted_view_name = "whitelisted-view"
        whitelisted_path = "/whitelisted-view/"
        request = mock.Mock()
        request.path = whitelisted_path

        with self.settings(OPENIDC_AUTH_WHITELIST=[re.compile(f"^{whitelisted_path}$")]):
            mock_view = mock.Mock()
            mock_view.url_name = whitelisted_view_name
            self.mock_resolve.return_value = mock_view

            response = self.middleware(request)
            self.assertEqual(response, self.response)

    def test_404_pass_through(self):
        request = mock.Mock()
        request.path = "/foo/"
        request.META = {}

        self.mock_resolve.side_effect = Resolver404

        response = self.middleware(request)
        self.assertEqual(response, self.response)

    def test_request_missing_headers_raises_401(self):
        request = mock.Mock()
        request.path = "/foo/"
        request.META = {}

        with self.settings(OPENIDC_AUTH_WHITELIST=[]):
            response = self.middleware(request)

        self.assertEqual(response.status_code, 401)

    def test_user_created_with_correct_email_from_header(self):
        user_email = "user@example.com"

        request = mock.Mock()
        request.path = "/foo/"
        request.META = {settings.OPENIDC_EMAIL_HEADER: user_email}

        User = get_user_model()

        self.assertEqual(User.objects.all().count(), 0)

        with self.settings(OPENIDC_AUTH_WHITELIST=[]):
            response = self.middleware(request)

        self.assertEqual(response, self.response)
        self.assertEqual(User.objects.all().count(), 1)

        self.assertEqual(request.user.email, user_email)
        self.assertFalse(request.user.is_staff)

    def test_add_email_when_not_present(self):
        user_email = "user@example.com"
        User = get_user_model()
        User.objects.create(username=user_email)

        request = mock.Mock()
        request.path = "/foo/"
        request.META = {settings.OPENIDC_EMAIL_HEADER: user_email}

        with self.settings(OPENIDC_AUTH_WHITELIST=[]):
            response = self.middleware(request)

        self.assertEqual(response, self.response)

        # should not create any extra users
        self.assertEqual(User.objects.all().count(), 1)

        # user should now have email address
        self.assertEqual(request.user.email, user_email)
        self.assertFalse(request.user.is_staff)
