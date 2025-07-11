from django.test import Client
from users.models import CustomUser
from rest_framework.test import APITestCase
from django.core.cache import cache
import json

class RegisterSecurityTests(APITestCase):
    def setUp(self):
        self.client = Client()
        self.register_url = '/users/register/'

    def test_any_user_can_register(self):
        response = self.client.post(self.register_url,data=json.dumps({
            'username' : 'testinguser2',
            'password': 'ariksahfjkhmjbsdih',
            'company':{
                'name': 'testinguser2company@test.com',
                'email': 'testinguser2comp@test.com',
                'employee_count': 5
            }
        }),content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_register_missing_fields_returns_400(self):
        response = self.client.post(self.register_url,{
            'username' : 'someusr',
            'password': '7uyghcv55*9',
            'company':{}
        })

        self.assertEqual(response.status_code,400)

    def test_xss_prevention(self):
        response = self.client.post(self.register_url,json.dumps({
            'username' : 'xssuserguy',
            'password' : 'StrongpAA!hahaha',
            'company': {
                'name' : '<script>',
                'email' : 'some@some.com',
                'employee_count':4
            }
        }),content_type='application/json')

        self.assertEqual(response.status_code,400)

class LoginSecurityTests(APITestCase):
    def setUp(self):
        self.client = Client()
        self.user = CustomUser.objects.create_user(
            username='testinguser',
            password ='SecurePass123!',
        )
        self.login_url = '/users/login/'

    def tearDown(self):
        cache.clear()

    def test_valid_login_returns_tokens(self):
        
        response = self.client.post(self.login_url,{
            'username' : 'testinguser',
            'password' : 'SecurePass123!'
        })

        self.assertEqual(response.status_code,200)
        self.assertIn('access',response.data)
        self.assertIn('refresh', response.data)

    def test_invalid_login_returns_401(self):
        response = self.client.post(self.login_url,{
                'username' : 'wrongusername',
                'password': 'wrongpassword'
            })

        self.assertEqual(response.status_code, 401)

    def test_command_injection_fails_safely(self):
        response = self.client.post(self.login_url,{
            'username' : 'testinguser; rm -rf /',
            'password' : 'SecurePass123!'
        })

        self.assertIn(response.status_code,[400,401])

    def test_brute_force_protection(self):

        for i in range(10):
             self.client.post(self.login_url,{
                'username' : 'wrongusername',
                'password': 'wrongpassword'
            })
        
        response = self.client.post(self.login_url,{
            'username' : 'testinguser',
            'password' : 'SecurePass123!'
        })

        self.assertIn(response.status_code,[429,423])

    def test_unauthorized_access(self):
        protected_endpoints = ['/api/companies/','/api/employees/']

        for endpoint in protected_endpoints:
            response = self.client.get(endpoint)
            self.assertIn(response.status_code,[401,403])