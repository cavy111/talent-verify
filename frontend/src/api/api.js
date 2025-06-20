import axios from 'axios';
import { getCurrentUser } from './auth';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in the headers
api.interceptors.request.use(
  async(config) => {
    const user = getCurrentUser();
    if (user) {
        const now = Date.now()/1000
        const decoded = jwtDecode(user.access)
        
        if (decoded.exp < now){
            try {
                const response = await axios.post('http://localhost:8000/users/token/refresh/', {refresh: user.refresh});
                user.access = response.data.access
                localStorage.setItem('user',JSON.stringify(user))
                config.headers['Authorization'] = `Bearer ${response.data.access}`                
            } catch (error) {
                console.error("Refresh token failed or expired")
                localStorage.removeItem('user')
                window.location.href='/login'
                return Promise.reject(error)
            }
        }else{
            config.headers['Authorization'] = `Bearer ${user.access}`;
        }
        
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

export const getEmploymentRecord = (employeeId, recordId) => {
    return api.get(`employees/${employeeId}/employment_records/${recordId}/`);
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