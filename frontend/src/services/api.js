import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Auto-correct missing /api suffix if backend URL was configured without it
if (baseURL && !baseURL.endsWith('/api') && !baseURL.endsWith('/api/')) {
  baseURL = baseURL.replace(/\/+$/, '') + '/api';
}

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

