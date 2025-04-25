from rest_framework import viewsets, status
from .models import Employee, EmploymentRecord
from .serializers import EmployeeSerializer, EmployeeRecordSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
import io
import csv
from rest_framework import filters

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'employee_id', 'employment_records__company__name', 
                     'employment_records__department__name', 'employment_records__role',
                     'employment_records__date_started', 'employment_records__date_left']

    @action(detail=False, methods=['get'])
    def search(self, request):
         
         
        queryset = self.get_queryset()

        # Get search parameters
        name = request.query_params.get('name', None)
        employer = request.query_params.get('employer', None)
        position = request.query_params.get('position', None)
        department = request.query_params.get('department', None)
        year_started = request.query_params.get('year_started', None)
        year_left = request.query_params.get('year_left', None)

        # Apply filters based on search parameters
        if name:
            queryset = queryset.filter(name__icontains=name)
        if employer:
            queryset = queryset.filter(employment_records__company__name__icontains=employer)
        if position:
            queryset = queryset.filter(employment_records__role__icontains=position)
        if department:
            queryset = queryset.filter(employment_records__department__name__icontains=department)
        if year_started:
            queryset = queryset.filter(employment_records__date_started__year=year_started)
        if year_left:
            queryset = queryset.filter(employment_records__date_left__year=year_left)

        queryset = queryset.distinct()

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        decoded_file = file.read().decode('utf-8')
        io_string = io.StringIO(decoded_file)

        reader = csv.DictReader(io_string)

        created_count = 0
        updated_count = 0
        errors = []

        for row in reader:
            try:
                # Create or update employee
                employee, created = Employee.objects.get_or_create(
                    name=row['name'],
                    defaults={
                        'employee_id': row.get('employee_id', None),
                    }
                )
                if created:
                    created_count += 1
                else:
                    updated_count += 1
            except Exception as e:
                errors.append(f"Error processing row {row}: {str(e)}")

        return Response({
            'created_count': created_count,
            'updated_count': updated_count,
            'errors': errors
        })
    
class EmploymentRecordViewSet(viewsets.ModelViewSet):

    serializer_class = EmployeeRecordSerializer

    def get_queryset(self):
        employee_id = self.kwargs['employee_pk']
        return EmploymentRecord.objects.filter(employee_id=employee_id)
    
    def perform_create(self, serializer):
        employee_id = self.kwargs['employee_pk']
        serializer.save(employee_id=employee_id)