import axiosClient from './axiosClient';

export const submissionsApi = {
  submitForm: async (formId, data) => {
    return axiosClient.post(`/forms/${formId}/submissions`, data);
  },
  fetchSubmissions: async (formId, params = {}) => {
    return axiosClient.get(`/forms/${formId}/submissions`, { params });
  },
  fetchSubmissionById: async (formId, submissionId) => {
    return axiosClient.get(`/forms/${formId}/submissions/${submissionId}`);
  },
  deleteSubmission: async (formId, submissionId) => {
    return axiosClient.delete(`/forms/${formId}/submissions/${submissionId}`);
  },
  getExportUrl: (formId) => {
    const base = import.meta.env.VITE_API_BASE_URL || '/api';
    return `${base}/forms/${formId}/submissions/export`;
  }
};
