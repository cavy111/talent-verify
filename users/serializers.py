from rest_framework import serializers
from users.models import CustomUser
from api.companies.serializers import CompanySerializer
from api.companies.models import Company

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
            user_type=validated_data.get('user_type', 'verifier'),
            company=company_instance
        )
        return user