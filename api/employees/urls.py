from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, EmploymentRecordViewSet

router = DefaultRouter()
router.register(r'', EmployeeViewSet)

employment_record_patterns =[
    path('<employee_pk>/employment-records/', EmploymentRecordViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('<employee_pk>/employment-records/<int:pk>/', EmploymentRecordViewSet.as_view({'get': 'retrieve', 'put': 'update','patch':'partial_update', 'delete': 'destroy'})),
]

urlpatterns = [
     path('', include(router.urls)),
     *employment_record_patterns,
]