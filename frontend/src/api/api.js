import axios from 'axios';
import { getCurrentUser } from './auth';

const API_URL = 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in the headers
api.interceptors.request.use(
  (config) => {
    const user = getCurrentUser();
    if (user && user.access) {
      config.headers['Authorization'] = `Bearer ${user.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);  

// company API calls
export const getCompanies = () => {
    return api.get('companies/');
}

export const getCompany = (id) => {
    return api.get(`companies/${id}/`);
}

export const createCompany = (companyData) => {
    return api.post('companies/', companyData);
}

export const createCompanyDepartment = (companyId,companyDepartmentData) => {
    return api.post(`companies/${companyId}/departments/`, companyDepartmentData);
}

export const updateCompany = (id, companyData) => {
    return api.put(`companies/${id}/`, companyData);
}

export const getCompanyDepartments = (companyId) => {
    return api.get(`companies/${companyId}/departments/`);
}

// employee API calls
export const getEmployees = () => {
    return api.get('employees/');
}

export const getEmployee = (id) => {
    return api.get(`employees/${id}/`);
}

export const searchEmployees = (params) => {
    return api.get('employees/search/', {params});
}

export const createEmployee = (employeeData) => {
    return api.post('employees/', employeeData);
}

export const getEmploymentRecords = (employeeId) => {
    return api.get(`employees/${employeeId}/employment_records/`);
}

export const createEmploymentRecord = (employeeId, employmentRecordData) => {
    return api.post(`employees/${employeeId}/employment-records/`, employmentRecordData);
}

// bulk upload
export const bulkUploadEmployees = (file, companyId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('company_id', companyId);

    return api.post('employees/bulk_create/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}