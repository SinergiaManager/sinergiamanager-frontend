import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || '/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 secondi
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const tokenString = localStorage.getItem('token');
    if (tokenString) {
      try {
      const token = JSON.parse(tokenString);
      config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
      console.error('Error parsing token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor per gestire le risposte e gli errori
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gestione errori globali
    if (error.response?.status === 401) {
     /*  localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; */
    }
    return Promise.reject(error);
  }
);

export { apiClient };
export type { AxiosRequestConfig };