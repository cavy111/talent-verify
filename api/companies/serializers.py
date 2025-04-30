from rest_framework import serializers
from .models import Company, Department

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']

class CompanySerializer(serializers.ModelSerializer):
    departments = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Company
        fields = ['id', 'name', 'registration_date', 'registration_number',
            'address', 'contact_person', 'phone', 'email',
            'employee_count', 'departments', 'created_at', 'updated_at'
            ]