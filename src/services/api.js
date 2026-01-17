// API service for employees, attendance, and dashboard
import axios from 'axios';

const API_BASE_URL = 'https://etharabackend-1.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employees API
export const employeesAPI = {
  getAll: async () => {
    const response = await api.get('/employees');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },
  
  create: async (employee) => {
    const response = await api.post('/employees', employee);
    return response.data;
  },
  
  update: async (id, employee) => {
    const response = await api.put(`/employees/${id}`, employee);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },
};

// Attendance API
export const attendanceAPI = {
  getAll: async (date = null) => {
    const params = date ? { date } : {};
    const response = await api.get('/attendance', { params });
    return response.data;
  },
  
  getByEmployeeId: async (employeeId) => {
    const response = await api.get(`/attendance/${employeeId}`);
    return response.data;
  },
  
  markAttendance: async (employeeId, date, status) => {
    const response = await api.post('/attendance', {
      employeeId,
      date,
      status,
    });
    return response.data;
  },
  
  getTodayAttendance: async () => {
    const today = new Date().toISOString().split('T')[0];
    const response = await api.get('/attendance', { params: { date: today } });
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};
