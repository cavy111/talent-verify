from django.db import models
from api.companies.models import Company, Department
from encrypted_model_fields.fields import EncryptedCharField
from django.core.exceptions import ValidationError

class Employee(models.Model):
    name = models.CharField(max_length=255, unique=True)
    employee_id = EncryptedCharField(models.CharField(max_length=50,), blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
class EmploymentRecord(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='employment_records')
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    role = models.CharField(max_length=255)
    date_started = models.DateField()
    date_left = models.DateField(null=True, blank=True)
    duties = models.TextField()
    
    def __str__(self):
        return f"{self.employee.name} - {self.role} at {self.company.name}"
    
    def clean(self):
        if self.date_left < self.date_started:
            raise ValidationError("Date left cannot be earlier than date started")
