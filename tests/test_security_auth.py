from django.test import Client
from users.models import CustomUser
from rest_framework.test import APITestCase

class AuthenticationSecurityTests(APITestCase):
    def setUp(self):
        self.client = Client()
        self.user = CustomUser.objects.create_user(
            username='testinguser',
            password ='SecurePass123!'
        )

    def test_brute_force_protection(self):
        login_url = '/users/login/'

        for i in range(10):
             self.client.post(login_url,{
                'username' : 'wrongusername',
                'password': 'wrongpassword'
            })
        
        response = self.client.post(login_url,{
            'username' : 'testinguser',
            'password' : 'SecurePass123!'
        })

        self.assertIn(response.status_code,[429,423])

    def test_session_security(self):
        self.client.login(username='testinguser',password='SecurePass123!')

        response = self.client.get('/api/companies/')

        sessionid_cookie = response.cookies.get('sessionid')
        if sessionid_cookie:
            self.assertTrue(sessionid_cookie['secure'])
            self.assertTrue(sessionid_cookie['httponly'])
            self.assertEqual(sessionid_cookie['samesite'], 'Strict')

    def test_unauthorized_access(self):
        protected_endpoints = ['/api/companies/','/api/employees/']

        for endpoint in protected_endpoints:
            response = self.client.get(endpoint)
            self.assertIn(response.status_code,[401,403])