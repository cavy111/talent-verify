from rest_framework import serializers
from .models import Employee, EmploymentRecord
from api.companies.serializers import CompanySerializer

class EmployeeRecordSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)

    class Meta:
        model = EmploymentRecord
        fields = [ 'id', 'company', 'department',
            'role', 'date_started', 'date_left', 'duties'
            ]
        extra_kwargs = {'date_left': {'required': False, 'allow_null':True},}
        
class EmployeeSerializer(serializers.ModelSerializer):
    employment_records = EmployeeRecordSerializer(many=True, read_only=True)
    class Meta:
        model = Employee
        fields = ['id', 'name', 'employee_id', 'employment_records', 'created_at', 'updated_at']
        extra_kwargs = {'employee_id': {'required': False, 'allow_null':True, 'allow_blank':True},}

class BulkEmployeeUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    company_id = serializers.IntegerField()