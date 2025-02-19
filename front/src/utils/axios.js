import axios from 'axios';
import { getCookie } from './cookie';

const URL = import.meta.env.VITE_API_URL + '/api/';

const API = axios.create({
  baseURL: URL,
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    const token = getCookie('token');
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

export default API;
