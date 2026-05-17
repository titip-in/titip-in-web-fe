import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://titipin-api.bccdev.id/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout on token expiration or invalid token
      useAuthStore.getState().logout();
    } else if (error.response?.status === 403) {
      const data = error.response.data;
      const errorCode = data?.error_code || data?.message;
      if (
        errorCode === "PROFILE_INCOMPLETE" || 
        errorCode === "EMAIL_UNVERIFIED" || 
        errorCode === "WA_UNVERIFIED"
      ) {
        useAuthStore.getState().setAuthError(errorCode);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
