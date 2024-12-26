import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000', // Base URL without /api
  headers: {
    'Content-Type': 'application/json'
  }
});

// Ajoutez un intercepteur pour les requêtes
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
  
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Token ${token}`;
}