import axios from 'axios';

// Determine the base URL based on environment
const getBaseURL = () => {
  // Check for explicit environment variable first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  if (typeof window !== 'undefined') {
    // Client-side
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000/';
    }
    // In production, make requests relative to the current domain
    return '/';
  }
  // Server-side fallback
  return 'http://localhost:5000/';
};

const customAxios = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

customAxios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

customAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default customAxios;
