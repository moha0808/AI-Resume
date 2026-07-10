import axios from 'axios';
import { useAuthStore } from '../store';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

// Request interceptor: attach token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, Promise.reject);

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });
        useAuthStore.getState().setAuth(useAuthStore.getState().user, data.token);
        original.headers.Authorization = `Bearer ${data.token}`;
        return api(original);
      } catch {
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const resumeAPI = {
  upload: (formData) => api.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: () => api.get('/resume'),
  getOne: (id) => api.get(`/resume/${id}`),
  analyze: (id) => api.post(`/resume/${id}/analyze`),
  improve: (id) => api.post(`/resume/${id}/improve`),
  delete: (id) => api.delete(`/resume/${id}`),
};

export const jobAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getRecommended: () => api.get('/jobs/recommend'),
  getSaved: () => api.get('/jobs/saved'),
  save: (jobId) => api.post('/jobs/save', { jobId }),
  unsave: (jobId) => api.delete(`/jobs/save/${jobId}`),
};

export const interviewAPI = {
  generate: (data) => api.post('/interview/generate', data),
  getAll: () => api.get('/interview'),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getDashboardStats: () => api.get('/user/dashboard-stats'),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;
