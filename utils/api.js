import axios from 'axios';

// ni hardcode je, guna port 5775
const API_URL = 'http://localhost:5775/document-templates';

export const api = {
  getAllTemplates: () => axios.get(API_URL),
  getTemplateById: (id) => axios.get(`${API_URL}/${id}`),
  createTemplate: (data) => axios.post(API_URL, data),
  updateTemplate: (id, data) => axios.patch(`${API_URL}/${id}`, data),
  deleteTemplate: (id) => axios.delete(`${API_URL}/${id}`),
};