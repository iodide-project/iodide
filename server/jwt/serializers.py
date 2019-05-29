from rest_framework import exceptions, serializers
from rest_framework_simplejwt.tokens import RefreshToken


class TokenObtainPairSerializer(serializers.Serializer):
    def validate(self, attrs):
        request = self.context["request"]
        if not request.user.is_authenticated:
            raise exceptions.NotAuthenticated
        refresh = RefreshToken.for_user(request.user)
        return {"refresh": str(refresh), "access": str(refresh.access_token)}
