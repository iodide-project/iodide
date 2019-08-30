from django.contrib import admin

from .models import File, FileSource


class FileAdmin(admin.ModelAdmin):
    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.is_staff

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.is_staff

    def has_module_permission(self, request):
        return request.user.is_superuser or request.user.is_staff

    fieldsets = [(None, {"fields": ["notebook", "filename", "last_updated"]})]


class FileSourceAdmin(admin.ModelAdmin):
    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.is_staff

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.is_staff

    def has_module_permission(self, request):
        return request.user.is_superuser or request.user.is_staff

    fieldsets = [(None, {"fields": ["notebook", "source", "filename", "update_interval"]})]


admin.site.register(File, FileAdmin)
admin.site.register(FileSource, FileSourceAdmin)
