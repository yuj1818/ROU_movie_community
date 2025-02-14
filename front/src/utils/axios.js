import axios from 'axios';

const URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
