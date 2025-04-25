from django.urls import path, include

urlpatterns = [
    path('companies/', include('api.companies.urls')),
    path('employees/', include('api.employees.urls')),
]