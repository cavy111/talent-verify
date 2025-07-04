import axios from 'axios';
import {jwtDecode} from 'jwt-decode'

const API_URL = 'http://localhost:8000/';

export const register = async (userData) => {
  try{
    const response = await axios.post(`${API_URL}users/register/`, userData);
    return response.data;
  }catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}users/login/`, {
      username,
      password,
    });

    if (response.data.access) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export const logout = () => {
  localStorage.removeItem('user');
}

export const getCurrentUser = () => {
  const userString = localStorage.getItem('user');
  if (userString) {
    return JSON.parse(userString)
  }
  return null;
}