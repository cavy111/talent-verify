from rest_framework import permissions

class IsCompanyUser(permissions.BasePermission):
    """
    Permission to only allow users from the same company to access data.
    """
    def has_object_permission(self, request, view, obj):
         # Check if user is a company user
         if not request.user.is_authenticated or request.user.user_type != 'company':
              return False
         
         if hasattr(obj, 'company'):
              return obj.company == request.user.company
         
         if hasattr(obj, 'employment_records'):
              return obj.employment_records.filter(company=request.user.company).exists()
         
         return False

class IsTalentVerifyAdmin(permissions.BasePermission):
    """
    Permission to only allow Talent Verify admins to access.
    """
    def has_permission(self, request, view):
         return request.user.is_authenticated and request.user.user_type == 'admin'
