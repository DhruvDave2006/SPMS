import { mockRoles, getNextId } from '../data/mockData.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

let roleStore = [...mockRoles];

export const roleService = {
  getAll: async () => {
    if (USE_MOCK) return [...roleStore];
    return apiGet('/roles');
  },

  getById: async (id) => {
    if (USE_MOCK) return roleStore.find(r => r.RoleId === id) || null;
    return apiGet(`/roles/${id}`);
  },

  create: async (data) => {
    if (USE_MOCK) {
      const exists = roleStore.find(r => r.RoleName.toLowerCase() === data.RoleName.toLowerCase());
      if (exists) throw new Error(`Role "${data.RoleName}" already exists.`);
      const newRole = { ...data, RoleId: getNextId(roleStore, 'RoleId') };
      roleStore = [...roleStore, newRole];
      return newRole;
    }
    return apiPost('/roles', data);
  },

  update: async (id, data) => {
    if (USE_MOCK) {
      const conflict = roleStore.find(r => r.RoleName.toLowerCase() === data.RoleName.toLowerCase() && r.RoleId !== id);
      if (conflict) throw new Error(`Role name "${data.RoleName}" is already taken.`);
      roleStore = roleStore.map(r => r.RoleId === id ? { ...r, ...data } : r);
      return roleStore.find(r => r.RoleId === id);
    }
    return apiPut(`/roles/${id}`, data);
  },

  delete: async (id) => {
    if (USE_MOCK) {
      roleStore = roleStore.filter(r => r.RoleId !== id);
      return { success: true };
    }
    return apiDelete(`/roles/${id}`);
  },
};
