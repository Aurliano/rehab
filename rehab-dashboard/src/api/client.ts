import axios from 'axios';

// Base URL از appsettings.json - پورت رو بر اساس پروژه خودت تنظیم کن
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5271/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor برای لاگ کردن خطاها
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
