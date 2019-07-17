from django.contrib import admin

from .models import User


class UserAdmin(admin.ModelAdmin):
    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.is_staff

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_module_permission(self, request):
        return request.user.is_superuser or request.user.is_staff

    fieldsets = [
        (
            None,
            {"fields": ["username", "can_create_on_behalf_of_others", "is_staff", "is_superuser"]},
        )
    ]

    search_fields = ["username"]


admin.site.register(User, UserAdmin)
