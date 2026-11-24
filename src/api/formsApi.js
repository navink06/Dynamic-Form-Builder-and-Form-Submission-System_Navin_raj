import axiosClient from './axiosClient';

export const formsApi = {
  fetchForms: async (params = {}) => {
    return axiosClient.get('/forms', { params });
  },
  fetchFormById: async (id, preview = false) => {
    return axiosClient.get(`/forms/${id}`, { params: { preview } });
  },
  createForm: async (formData) => {
    return axiosClient.post('/forms', formData);
  },
  updateForm: async (id, formData) => {
    return axiosClient.put(`/forms/${id}`, formData);
  },
  deleteForm: async (id) => {
    return axiosClient.delete(`/forms/${id}`);
  },
  fetchFormStats: async (id) => {
    return axiosClient.get(`/forms/${id}/stats`);
  }
};
