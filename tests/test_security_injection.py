from django.test import TestCase, Client
from users.models import CustomUser
from api.companies.models import Company
from django.core.files.uploadedfile import SimpleUploadedFile

class InjectionSecurityTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.company = Company.objects.create(name='testing company', email='testingcompany@test.com', employee_count=5)
        self.user = CustomUser.objects.create_user(
            username = 'testinguser',
            password = 'SecurePassword123!',
            company=self.company
        )

        self.client.login(username='testinguser', password='SecurePassword123!')

    def test_sql_injection_prevention(self):
        """Test SQL injection prevention"""
        malicious_inputs = [
            "'; DROP TABLE users; --",
            "' OR '1'='1",
            "1' UNION SELECT * FROM sensitive_table --",
            "'; UPDATE users SET password='hacked' WHERE id=1; --"
        ]

        for malicious_input in malicious_inputs:
            response = self.client.get('/api/employees/search/',{'query':malicious_input})
            self.assertNotEqual(response.status_code,500)
            if response.status_code == 200:
                content = response.content.decode()
                sql_errors = ['syntax error', 'mysql', 'postgresql', 'sqlite']
                for sql_error in sql_errors:
                    self.assertNotIn(sql_error.lower(), content.lower())

    def test_xss_prevention(self):
        """Test XSS prevention in API responses"""
        xss_payloads = [
            "<script>alert('XSS')</script>",
            "javascript:alert('XSS')",
            "<img src=x onerror=alert('XSS')>",
            "';alert('XSS');//"
        ]

        company_id = self.company.id
        for payload in xss_payloads:
            response = self.client.post(f'/api/companies/{company_id}/departments/',{'name':payload})

            if response.status_code in [200,201]:
                content = response.content.decode()
                self.assertNotIn('<script>',content)
                self.assertNotIn('javascript:',content)
                self.assertNotIn('onerror=',content)

    def test_command_injection_prevention(self):
         """Test command injection prevention in file names"""
         command_payloads = [
            "; ls -la",
            "| cat /etc/passwd",
            "&& rm -rf /",
            "; curl malicious-site.com"
         ]
         
         # Minimal valid CSV content
         csv_content = b"employee_name,department_name,role,date_started\nJohn Doe,IT,Developer,2023-01-01"

         for payload in command_payloads:
             malicious_filename = f'test_{payload}.csv'
             mock_file = SimpleUploadedFile(malicious_filename,csv_content,'text/csv')

             response = self.client.post('/api/employees/bulk_create/',data={'file':mock_file, 'company_id': self.company.id},format='multipart')

             self.assertNotEqual(response.status_code,500, msg=f'Failed with payload: {payload}')