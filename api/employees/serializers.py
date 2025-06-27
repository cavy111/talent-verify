from rest_framework import serializers
from .models import Employee, EmploymentRecord
from api.companies.serializers import CompanySerializer
from .models import Company
from api.companies.models import Department
from api.companies.serializers import DepartmentSerializer
from django.core.exceptions import ValidationError

class EmployeeRecordSerializer(serializers.ModelSerializer):
    company = serializers.PrimaryKeyRelatedField( queryset = Company.objects.all(), write_only=True)
    company_details = CompanySerializer(source='company', read_only=True)

    department = serializers.PrimaryKeyRelatedField( queryset = Department.objects.all(), write_only=True)
    department_details = DepartmentSerializer(source='department', read_only=True)

    class Meta:
        model = EmploymentRecord
        fields = [ 'id', 'company', 'department',
            'role', 'date_started', 'date_left', 'duties', 'department_details', 'company_details'
            ]
        extra_kwargs = {'date_left': {'required': False, 'allow_null':True},}
    
    def validate(self, data):
        date_started = data.get('date_started')
        date_left = data.get('date_left')
        if date_left and date_left < date_started:
            raise serializers.ValidationError({"date_left":"Date left cannot be earlier than date started"})
        return data
        
class EmployeeSerializer(serializers.ModelSerializer):
    employment_records = EmployeeRecordSerializer(many=True, read_only=True)
    class Meta:
        model = Employee
        fields = ['id', 'name', 'employee_id', 'employment_records', 'created_at', 'updated_at']
        extra_kwargs = {'employee_id': {'required': False, 'allow_null':True, 'allow_blank':True},}

class BulkEmployeeUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    company_id = serializers.IntegerField()