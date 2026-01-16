// API service for employees, attendance, and dashboard
import axios from 'axios';

// Determine API URL based on environment
const getApiUrl = () => {
  // First, check if VITE_API_URL is explicitly set (highest priority)
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== '') {
    const url = import.meta.env.VITE_API_URL.trim();
    // Ensure it doesn't end with double slash
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }
  
  // In production (Vercel), show warning but don't break
  if (import.meta.env.PROD) {
    const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
    console.error('❌ VITE_API_URL is not set in Vercel environment variables!');
    console.error('Current host:', currentHost);
    console.error('Please set VITE_API_URL in Vercel Dashboard → Settings → Environment Variables');
    console.error('Value should be: https://your-backend-url.vercel.app/api');
    // Return a placeholder URL that will fail gracefully
    return 'https://api-not-configured.vercel.app/api';
  }
  
  // Development fallback
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiUrl();

// Log the API URL being used (helpful for debugging)
console.log('🔗 API Base URL:', API_BASE_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for error handling
api.interceptors.request.use(
  (config) => {
    if (!config.baseURL || config.baseURL.includes('api-not-configured')) {
      const errorMsg = 'API URL not configured. Please set VITE_API_URL in Vercel environment variables.';
      console.error('❌', errorMsg);
      return Promise.reject(new Error(errorMsg));
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.error('❌ Network Error: Cannot connect to backend API');
      console.error('Backend URL:', error.config?.baseURL || 'Not set');
      console.error('Please check:');
      console.error('1. Backend is deployed and running');
      console.error('2. VITE_API_URL is set correctly in Vercel');
      console.error('3. CORS is configured on backend');
    }
    return Promise.reject(error);
  }
);

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
