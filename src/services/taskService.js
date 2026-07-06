import { mockTasks, mockStatuses, mockPriorities, getNextId } from '../data/mockData.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

let taskStore = [...mockTasks];

export const taskService = {
  getAll: async () => {
    if (USE_MOCK) return taskStore.filter(t => !t.IsDeleted);
    return apiGet('/tasks');
  },

  getById: async (id) => {
    if (USE_MOCK) return taskStore.find(t => t.TaskId === id && !t.IsDeleted) || null;
    return apiGet(`/tasks/${id}`);
  },

  getByProject: async (allocationId) => {
    if (USE_MOCK) return taskStore.filter(t => t.AllocationID === allocationId && !t.IsDeleted);
    return apiGet(`/tasks?allocationId=${allocationId}`);
  },

  create: async (data) => {
    if (USE_MOCK) {
      const newTask = {
        ...data,
        TaskId: getNextId(taskStore, 'TaskId'),
        IsDeleted: false,
        ProgressPercentage: 0,
        EarnedScore: 0,
        CompletedDate: null,
        FacultyRemarks: '',
        StudentRemarks: '',
      };
      taskStore = [...taskStore, newTask];
      return newTask;
    }
    return apiPost('/tasks', data);
  },

  update: async (id, data) => {
    if (USE_MOCK) {
      taskStore = taskStore.map(t => t.TaskId === id ? { ...t, ...data } : t);
      return taskStore.find(t => t.TaskId === id);
    }
    return apiPut(`/tasks/${id}`, data);
  },

  updateStatus: async (id, statusId) => {
    if (USE_MOCK) {
      const completedDate = statusId === 3 ? new Date().toISOString().split('T')[0] : null;
      taskStore = taskStore.map(t =>
        t.TaskId === id ? { ...t, TaskStatus: statusId, CompletedDate: completedDate } : t
      );
      return taskStore.find(t => t.TaskId === id);
    }
    return apiPut(`/tasks/${id}/status`, { statusId });
  },

  softDelete: async (id) => {
    if (USE_MOCK) {
      taskStore = taskStore.map(t => t.TaskId === id ? { ...t, IsDeleted: true } : t);
      return { success: true };
    }
    return apiDelete(`/tasks/${id}`);
  },

  // Enriched with status/priority labels
  getByProjectEnriched: async (allocationId) => {
    if (USE_MOCK) {
      return taskStore.filter(t => t.AllocationID === allocationId && !t.IsDeleted).map(t => ({
        ...t,
        Status: mockStatuses.find(s => s.StatusID === t.TaskStatus),
        Priority: mockPriorities.find(p => p.PriorityID === t.PriorityID),
      }));
    }
    return apiGet(`/tasks/enriched?allocationId=${allocationId}`);
  },
};
