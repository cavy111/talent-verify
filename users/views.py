from rest_framework import generics, permissions
from .serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from rest_framework.decorators import throttle_classes
from .throttles import LoginThrottle

class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]  # Allow anyone to register

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    @throttle_classes([LoginThrottle])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

   