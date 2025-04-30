from rest_framework import viewsets, generics
from .models import Company, Department
from .serializers import CompanySerializer, DepartmentSerializer
from core.permissions import IsCompanyUser, IsTalentVerifyAdmin
from rest_framework.permissions import IsAuthenticated

class CompanyViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing company instances.
    """
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def get_permissions(self):
        """
        - List/retrieve: Any authenticated user
        - Create/update/delete: Only Talent Verify admins
        """
        if self.action in ['retrieve', 'list']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsTalentVerifyAdmin]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """
        Company users can only see their own company.
        Talent Verify admins can see all companies.
        """
        user = self.request.user
        if user.user_type == 'admin':
            return Company.objects.all()
        elif user.user_type == 'company':
            return Company.objects.filter(id=user.company.id)
        return Company.objects.none()

class CompanyDepartmentViewSet(viewsets.ModelViewSet):
    serializer_class = DepartmentSerializer
    
    def get_queryset(self):
        company_id = self.kwargs['company_pk']
        return Department.objects.filter(company_id=company_id)
    
    def perform_create(self, serializer):
        company_id = self.kwargs['company_pk']
        serializer.save(company_id=company_id)