import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_React_BASE_API_URL;
console.log("API_BASE_URL =", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
});

const token = localStorage.getItem('jwt');
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
api.defaults.headers.post['Content-Type'] = 'application/json';

export default api;
