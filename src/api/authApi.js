import axiosClient from './axiosClient';

export const authApi = {
  login: async (credentials) => {
    return axiosClient.post('/auth/login', credentials);
  },
  register: async (userData) => {
    return axiosClient.post('/auth/register', userData);
  },
  getMe: async () => {
    return axiosClient.get('/auth/me');
  }
};
