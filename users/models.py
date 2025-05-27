from django.db import models
from django.contrib.auth.models import AbstractUser
from api.companies.models import Company

# Create your models here.
class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('admin','Talent Verify Admin'),
        ('company','Company User'),
        ('verifier','Verification User'),
    )

    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='company')
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.username