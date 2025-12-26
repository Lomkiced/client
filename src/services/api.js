import axios from 'axios';

// 1. Configuration
const API_URL = "http://localhost:5000/api";

// 2. Create Axios Instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 4. Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// --- AUTHENTICATION ---
export const loginUser = async (credentials) => {
  const response = await api.post('/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/register', userData);
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};

// --- USER PROFILE ---
export const getUserProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put('/profile', profileData, {
    headers: { 'Content-Type': undefined }
  });
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put('/profile/password', passwordData);
  return response.data;
};

// --- DASHBOARD & LOGS ---
export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const getLogs = async (params = {}) => {
  const response = await api.get('/logs', { params });
  return response.data;
};

export const clearLogs = async (password, retentionDays = 0) => {
  const response = await api.delete('/logs', { 
    data: { password, retentionDays } 
  });
  return response.data;
};

// --- RECORDS ---
export const getRecords = async (search = '', page = 1, category = '', limit = 10, filterStatus = 'Active') => {
  const response = await api.get('/records', { 
    params: { search, page, category, limit, filterStatus }
  });
  return response.data;
};

export const createRecord = async (formData) => {
  const response = await api.post('/records', formData, { 
    headers: { 'Content-Type': 'multipart/form-data' } 
  });
  return response.data;
};

export const updateRecord = async (id, formData) => {
  const response = await api.put(`/records/${id}`, formData, { 
    headers: { 'Content-Type': 'multipart/form-data' } 
  });
  return response.data;
};

export const updateRecordStatus = async (id, status) => {
  const response = await api.patch(`/records/${id}/status`, { status });
  return response.data;
};

export const deleteRecord = async (id) => {
  const response = await api.delete(`/records/${id}`);
  return response.data;
};

// --- CODEX ---
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const getTypes = async () => {
  const response = await api.get('/types');
  return response.data;
};

export const createType = async (data) => {
  const response = await api.post('/types', data);
  return response.data;
};

export const deleteType = async (id) => {
  const response = await api.delete(`/types/${id}`);
  return response.data;
};

// --- USERS MANAGEMENT ---
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const createUser = async (data) => {
  const response = await api.post('/users', data);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

export const updateUserStatus = async (id, status) => {
  const response = await api.patch(`/users/${id}/status`, { status });
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// --- BRANDING & SECURITY ---
export const getSecurityActivity = async () => {
  const response = await api.get('/profile/activity');
  return response.data;
};

export const getSystemSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

export const updateSystemSettings = async (formData) => {
  const response = await api.put('/settings', formData, {
    headers: { 'Content-Type': undefined } 
  });
  return response.data;
};

// --- DATABASE BACKUP (STREAMING) ---
export const downloadBackup = async () => {
  // We use standard fetch here to handle the blob stream better than Axios defaults
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/backup', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Backup failed');
  }

  // Create Blob from Stream
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  
  // Trigger Download
  const link = document.createElement('a');
  link.href = url;
  
  // Try to get filename from header
  const contentDisp = response.headers.get('Content-Disposition');
  let fileName = `dost_rms_backup_${new Date().toISOString().split('T')[0]}.sql`;
  if (contentDisp && contentDisp.indexOf('filename=') !== -1) {
      fileName = contentDisp.split('filename=')[1].replace(/"/g, '');
  }

  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const restoreDatabase = async (formData) => {
  const response = await api.post('/restore', formData);
  return response.data;
};

export default api;