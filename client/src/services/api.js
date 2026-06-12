import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const refreshToken = localStorage.getItem('refreshToken');

    if (error.response?.status === 401 && refreshToken && !original._retry) {
      original._retry = true;
      const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
      localStorage.setItem('accessToken', data.accessToken);
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    }

    return Promise.reject(error);
  }
);

export default api;
