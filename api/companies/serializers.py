from rest_framework import serializers
from .models import Company, Department
import re

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'company']

    def validate(self, data):
        company = data.get('company')
        name = data.get('name')

        if Department.objects.filter(company=company, name__iexact=name).exists():
            raise serializers.ValidationError({
                'name': 'A department with this name already exists for this company.'
            })
        return data

class CompanySerializer(serializers.ModelSerializer):
    departments = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    def validate_name(self,value):
        if re.search(r'<[^>]+>', value):
            raise serializers.ValidationError('HTML tags are not allowed in company name')
        return value

    class Meta:
        model = Company
        fields = ['id', 'name', 'registration_date', 'registration_number',
            'address', 'contact_person', 'phone', 'email',
            'employee_count', 'departments', 'created_at', 'updated_at'
            ]