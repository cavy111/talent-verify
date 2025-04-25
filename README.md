# Talent Verify

An employment verification platform that allows companies to manage employee records and verify employment histories.

## Features

- Company registration and profile management
- Employee work history tracking
- Bulk upload capabilities for employee data
- Search functionality for verifying employment history
- Role-based access control

## Tech Stack

- Backend: Django, Django REST Framework
- Frontend: React
- Database: sqlite
- Authentication: JWT

## Setup Instructions

### Backend Setup

1. Clone the repository
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment
4. Install dependencies: `pip install -r requirements.txt`
5. Run migrations: `python manage.py migrate`
6. Start the server: `python manage.py runserver`

### Frontend Setup

1. Navigate to the frontend directory
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## API Documentation

[Link to API documentation]

## Database Schema

### Company
Stores information about registered companies:
- name: Company's official name
- registration_number: Unique government-issued identifier
-...

### Employee
Represents individual employees:
- name: Employee's full name
- employee_id: Optional company-specific identifier
- ...

### Employment Record
Tracks an employee's position within a company:
- Many-to-one relationship with Employee
- Many-to-one relationship with Company
- ...

## Security Features

### Authentication
- JWT-based authentication with token refresh
- Password hashing using Django's built-in PBKDF2 algorithm

### Data Protection
- Employee ID numbers and personal information are encrypted at rest using AES-256
- HTTPS enforced for all API calls

### Access Control
- Role-based permissions (Admin, Company Manager, Verifier)
- Row-level security ensuring companies can only access their own data