from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import CompanyViewSet, CompanyDepartmentViewSet
from rest_framework_nested import routers

router = SimpleRouter()
router.register(r'', CompanyViewSet) 

department_router = routers.NestedSimpleRouter(router, r'', lookup='company')
department_router.register(r'departments', CompanyDepartmentViewSet, basename='company-departments')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(department_router.urls) ),
]