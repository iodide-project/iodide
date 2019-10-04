from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from django.http import HttpResponse
from django.urls import Resolver404, resolve
from rest_framework.authentication import SessionAuthentication


class OpenIDCAuthMiddleware(object):
    """
    An authentication middleware that depends on a header being set in the
    request. This header will be populated by nginx configured to authenticate
    with OpenIDC.

    If the URL matches a whitelist regular expression, we will bypass it
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.User = get_user_model()

    def __call__(self, request):
        if any(
            [whitelist_re.match(request.path) for whitelist_re in settings.OPENIDC_AUTH_WHITELIST]
        ):
            # If the requested path is in our auth whitelist,
            # skip authentication entirely
            return self.get_response(request)
        try:
            resolve(request.path)
        except Resolver404:
            # if 404, we should not go any further either
            return self.get_response(request)

        openidc_email = request.META.get(settings.OPENIDC_EMAIL_HEADER, None)

        if openidc_email is None:
            # If a user has bypassed the OpenIDC flow entirely and no header
            # is set then we reject the request entirely
            return HttpResponse("Please login using OpenID Connect", status=401)

        try:
            user = self.User.objects.get(username=openidc_email)
            if not user.email:
                with transaction.atomic():
                    user.email = openidc_email
                    user.save()
        except self.User.DoesNotExist:
            user = self.User(username=openidc_email, email=openidc_email)
            with transaction.atomic():
                user.save()

        request.user = user

        return self.get_response(request)


class OpenIDCRestFrameworkAuthenticator(SessionAuthentication):
    def authenticate(self, request):
        authenticated_user = getattr(request._request, "user", None)

        if authenticated_user:
            return (authenticated_user, None)

        return super().authenticate(request)
