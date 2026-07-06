import { mockPriorities } from '../data/mockData.js';
import { apiGet } from './api.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const priorityService = {
  getAll: async () => {
    if (USE_MOCK) return [...mockPriorities];
    return apiGet('/priorities');
  },

  getById: async (id) => {
    if (USE_MOCK) return mockPriorities.find(p => p.PriorityID === id) || null;
    return apiGet(`/priorities/${id}`);
  },
};
