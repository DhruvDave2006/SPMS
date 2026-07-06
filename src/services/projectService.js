import { mockProjects, mockUsers, mockStatuses, getNextId } from '../data/mockData.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

let projectStore = [...mockProjects];

export const projectService = {
  getAll: async () => {
    if (USE_MOCK) return projectStore.filter(p => !p.IsDeleted);
    return apiGet('/projects');
  },

  getById: async (id) => {
    if (USE_MOCK) return projectStore.find(p => p.ProjectId === id && !p.IsDeleted) || null;
    return apiGet(`/projects/${id}`);
  },

  getByFaculty: async (facultyId) => {
    if (USE_MOCK) return projectStore.filter(p => p.FacultyId === facultyId && !p.IsDeleted);
    return apiGet(`/projects?facultyId=${facultyId}`);
  },

  getByStudent: async (studentId) => {
    if (USE_MOCK) return projectStore.filter(p => p.StudentId === studentId && !p.IsDeleted);
    return apiGet(`/projects?studentId=${studentId}`);
  },

  create: async (data) => {
    if (USE_MOCK) {
      const newProject = {
        ...data,
        ProjectId: getNextId(projectStore, 'ProjectId'),
        IsDeleted: false,
        TotalTasks: 0,
        CompletedTasks: 0,
        ProgressPercentage: 0,
        AssignedDate: new Date().toISOString().split('T')[0],
      };
      projectStore = [...projectStore, newProject];
      return newProject;
    }
    return apiPost('/projects', data);
  },

  update: async (id, data) => {
    if (USE_MOCK) {
      projectStore = projectStore.map(p => p.ProjectId === id ? { ...p, ...data } : p);
      return projectStore.find(p => p.ProjectId === id);
    }
    return apiPut(`/projects/${id}`, data);
  },

  softDelete: async (id) => {
    if (USE_MOCK) {
      projectStore = projectStore.map(p => p.ProjectId === id ? { ...p, IsDeleted: true } : p);
      return { success: true };
    }
    return apiDelete(`/projects/${id}`);
  },

  // Enriched with user names and status
  getAllEnriched: async () => {
    if (USE_MOCK) {
      return projectStore.filter(p => !p.IsDeleted).map(p => ({
        ...p,
        Student: mockUsers.find(u => u.UserId === p.StudentId),
        Faculty: mockUsers.find(u => u.UserId === p.FacultyId),
        Status: mockStatuses.find(s => s.StatusID === p.ProjectStatus),
      }));
    }
    return apiGet('/projects/enriched');
  },
};
