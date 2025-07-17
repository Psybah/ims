import axios from 'axios';

const apiV1 = axios.create({
  baseURL: import.meta.env.VITE_API_V1_URL,
});

const apiV2 = axios.create({
  baseURL: import.meta.env.VITE_API_V2_URL,
});

const addAuthToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

apiV1.interceptors.request.use(addAuthToken);
apiV2.interceptors.request.use(addAuthToken);

const handleResponseError = (error) => {
  if (error.response && error.response.status === 401) {
    // Token expired or invalid, log out the user
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/'; // Redirect to login page
  }
  return Promise.reject(error);
};

apiV1.interceptors.response.use(response => response, handleResponseError);
apiV2.interceptors.response.use(response => response, handleResponseError);

export { apiV1, apiV2 };
