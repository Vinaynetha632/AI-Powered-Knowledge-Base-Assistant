import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const message = error.response.data?.message || '';
      if (message.includes('expired') || message.includes('token') || message.includes('authorized')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);


export const authService = {
  signup: async (userData: any) => {
    const response = await api.post('/signup', userData);
    return response.data;
  },
  login: async (credentials: any) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/me');
    return response.data;
  },
};


export const documentService = {
  list: async (search?: string) => {
    const params = search ? { search } : {};
    const response = await api.get('/documents', { params });
    return response.data;
  },
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },
};


export const chatService = {
  ask: async (documentId: string, question: string) => {
    const response = await api.post('/ask', { documentId, question });
    return response.data;
  },
  getHistory: async (search?: string) => {
    const params = search ? { search } : {};
    const response = await api.get('/history', { params });
    return response.data;
  },
};

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },
};

export default api;
