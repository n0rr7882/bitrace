from rest_framework import permissions


class IsAdminUserOrOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser or request.user == obj.user:
            return True

        return False
