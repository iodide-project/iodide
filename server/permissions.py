from django.conf import settings
from rest_framework.permissions import BasePermission, IsAuthenticated, IsAuthenticatedOrReadOnly


class RestrictedOrNot(BasePermission):
    def has_permission(self, request, view):
        """Enable the restrived API access mode,
        which only allows authenticated users, or allow readonly access.
        """
        if settings.RESTRICT_API:
            permission = IsAuthenticated()
        else:
            permission = IsAuthenticatedOrReadOnly()
        return permission.has_permission(request, view)
