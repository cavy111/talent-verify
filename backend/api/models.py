from django.db import models

# Create your models here.
class Company(models.Model):
    name = models.CharField(max_length=150, unique=True)
    reg_dete = models.DateField()
    reg_number = models.CharField(max_length=150, unique=True)
    address = models.CharField(max_length=150, unique=True)
    contact_person = models.CharField(max_length=150, unique=True)
    list_of_departments = models.CharField(max_length=150, unique=True)
    num_of_employees = models.IntegerField()
    contact_phone = models.CharField(max_length=150, unique=True)
    email = models.EmailField(max_length=150, unique=True)

    def __str__(self):
        return self.name

class Employee(models.Model):
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    employee_id = models.CharField(max_length=150, blank=True, null=True)
    department = models.CharField(max_length=150)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
class Role(models.Model):
    name=models.CharField(max_length=150)
    duties=models.CharField(max_length=150)
    date_started=models.DateField()
    date_left=models.DateField()
    employee=models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='roles')

    def __str__(self):
        return self.name