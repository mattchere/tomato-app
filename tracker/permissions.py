from rest_framework import permissions

class IsUser(permissions.BasePermission):
    """
    Custom permission to enable only the relevant user to access 
    their objects.
    """

    def has_object_permission(self, request, view, obj):
        """
        Allow access only if the object's user is the current user.
        """
        return obj.user == request.user

class IsUserAccount(permissions.BasePermission):
    """
    Custom permission to enable only the logged in user to access
    their user API endpoint.
    """

    def has_object_permission(self, request, view, obj):
        """
        Allow access only if the object's id is the current
        user's id.
        """
        return obj.id == request.user.id
