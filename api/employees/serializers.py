from rest_framework import serializers
from .models import Employee, EmploymentRecord

class EmployeeRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmploymentRecord
        fields = [ 'id', 'company', 'company_name', 'department', 'department_name',
            'role', 'date_started', 'date_left', 'duties'
            ]
        
class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'name', 'employee_id', 'employment_records', 'created_at', 'updated_at']

class BulkEmployeeUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    company_id = serializers.IntegerField()