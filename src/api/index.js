import axios from 'axios';

// Set your API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api'; // You can use environment variables for flexibility

// Create Axios instance with base URL and any other default configurations
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add a request interceptor to include the authentication token in headers if available
api.interceptors.request.use(
  (config) => {
    // Get the auth token from localStorage (or sessionStorage if preferred)
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Attach token to request headers if it exists
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor for handling token expiration or other errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error, like redirect to login if token is expired
      console.error('Unauthorized access - token might be expired');
      // Redirect to login page (for example)
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
