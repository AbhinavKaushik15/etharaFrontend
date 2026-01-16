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
  
  // In production (Vercel), try to auto-detect backend URL
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    const currentHost = window.location.hostname;
    
    // Try common backend URL patterns
    const possibleBackendUrls = [
      // Pattern 1: ethara-frontend -> ethara-backend
      currentHost.replace('frontend', 'backend'),
      // Pattern 2: ethara-frontend -> ethara-api
      currentHost.replace('frontend', 'api'),
      // Pattern 3: ethara-frontend -> ethara-server
      currentHost.replace('frontend', 'server'),
      // Pattern 4: Remove frontend suffix
      currentHost.replace('-frontend', ''),
      // Pattern 5: Add backend suffix
      currentHost.replace('ethara-', 'ethara-backend-'),
      // Pattern 6: Common backend naming
      'ethara-backend.vercel.app',
      'ethara-api.vercel.app',
      'ethara-server.vercel.app',
    ];
    
    // Try the first pattern (most common)
    const autoDetectedUrl = `https://${possibleBackendUrls[0]}/api`;
    
    console.warn('⚠️ VITE_API_URL not set. Attempting auto-detection...');
    console.warn('Current frontend:', currentHost);
    console.warn('Trying backend URL:', autoDetectedUrl);
    console.warn('If this doesn\'t work, set VITE_API_URL in Vercel Dashboard → Settings → Environment Variables');
    
    // Return auto-detected URL (will fail gracefully if wrong)
    return autoDetectedUrl;
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
    // Allow requests even if URL might be auto-detected (will fail gracefully)
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
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error') || error.code === 'ERR_NAME_NOT_RESOLVED') {
      const backendUrl = error.config?.baseURL || 'Not set';
      console.error('❌ Network Error: Cannot connect to backend API');
      console.error('Attempted Backend URL:', backendUrl);
      console.error('');
      console.error('🔧 To fix this:');
      console.error('1. Go to Vercel Dashboard → Your Frontend Project');
      console.error('2. Settings → Environment Variables');
      console.error('3. Add: VITE_API_URL = https://your-backend-url.vercel.app/api');
      console.error('4. Replace "your-backend-url" with your actual backend Vercel URL');
      console.error('5. Redeploy the frontend');
      console.error('');
      console.error('💡 Your backend URL should be something like:');
      console.error('   https://ethara-backend-xxxxx.vercel.app/api');
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
