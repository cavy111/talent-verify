from rest_framework import serializers
from users.models import CustomUser
from api.companies.serializers import CompanySerializer
from api.companies.models import Company
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    company = CompanySerializer(required=True)

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'password', 'user_type', 'company')

    def create(self, validated_data):

        company_data = validated_data.pop('company')

        # Create the company instance
        company_instance = Company.objects.create(**company_data)

        # create the user
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            user_type=validated_data.get('user_type', 'company'),
            company=company_instance
        )
        return user
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Add extra user data in the response
        data['id'] = self.user.id
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['user_type'] = self.user.user_type

        if self.user.company:
            data['company'] = {
                'id': self.user.company.id,
                'name': self.user.company.name,
            }

        return data