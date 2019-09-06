from django.contrib import admin

from .models import RemoteOperation


class RemoteOperationAdmin(admin.ModelAdmin):
    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.is_staff

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.is_staff

    def has_module_permission(self, request):
        return request.user.is_superuser or request.user.is_staff


admin.site.register(RemoteOperation, RemoteOperationAdmin)
