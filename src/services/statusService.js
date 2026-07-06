import { mockStatuses } from '../data/mockData.js';
import { apiGet } from './api.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const statusService = {
  getAll: async () => {
    if (USE_MOCK) return [...mockStatuses];
    return apiGet('/statuses');
  },

  getById: async (id) => {
    if (USE_MOCK) return mockStatuses.find(s => s.StatusID === id) || null;
    return apiGet(`/statuses/${id}`);
  },
};
