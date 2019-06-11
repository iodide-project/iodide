from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.views import TokenViewBase

from . import serializers


class TokenObtainPairView(TokenViewBase):
    """
    Returns a token pair if the request comes from an authenticated session

    rest_frame_simplejwt by default requires a username/password post blob for
    its version of this endpoint (which we usually aren't in a position to provide),
    so we provide this alternative version which does the equivalent, using Django's
    existing session-based authentication to identify and validate the user.
    """

    authentication_classes = [SessionAuthentication]

    serializer_class = serializers.TokenObtainPairSerializer
