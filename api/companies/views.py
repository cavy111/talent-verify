from rest_framework import viewsets, generics
from .models import Company, Department
from .serializers import CompanySerializer, DepartmentSerializer

class CompanyViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing company instances.
    """
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

class CompanyDepartmentList(generics.ListCreateAPIView):
    serializer_class = DepartmentSerializer
    
    def get_queryset(self):
        company_id = self.kwargs['company_id']
        return Department.objects.filter(company_id=company_id)
    
    def perform_create(self, serializer):
        company_id = self.kwargs['company_id']
        serializer.save(company_id=company_id)