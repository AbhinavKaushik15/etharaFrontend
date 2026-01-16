// API service for employees, attendance, and dashboard
import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    return { data: response.data.data || response.data, success: response.data.success };
  },
  
  getById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return { data: response.data.data || response.data, success: response.data.success };
  },
  
  create: async (employee) => {
    const response = await api.post('/employees', employee);
    return { data: response.data.data || response.data, success: response.data.success };
  },
  
  update: async (id, employee) => {
    const response = await api.put(`/employees/${id}`, employee);
    return { data: response.data.data || response.data, success: response.data.success };
  },
  
  delete: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return { data: response.data.data || response.data, success: response.data.success };
  },
};

// Attendance API
export const attendanceAPI = {
  getAll: async (date = null) => {
    const params = date ? { date } : {};
    const response = await api.get('/attendance', { params });
    return { data: response.data.data || response.data, success: response.data.success };
  },
  
  getByEmployeeId: async (employeeId) => {
    const response = await api.get(`/attendance/${employeeId}`);
    return { data: response.data.data || response.data, success: response.data.success };
  },
  
  markAttendance: async (employeeId, date, status) => {
    const response = await api.post('/attendance', {
      employeeId,
      date,
      status,
    });
    return { data: response.data.data || response.data, success: response.data.success };
  },
  
  getTodayAttendance: async () => {
    const today = new Date().toISOString().split('T')[0];
    const response = await api.get('/attendance', { params: { date: today } });
    return { data: response.data.data || response.data, success: response.data.success };
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return { data: response.data.data || response.data, success: response.data.success };
  },
};
