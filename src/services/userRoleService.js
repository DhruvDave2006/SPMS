import { mockUserRoles, mockRoles, mockUsers, getNextId } from '../data/mockData.js';
import { apiGet, apiPost, apiDelete } from './api.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

let userRoleStore = [...mockUserRoles];

export const userRoleService = {
  getAll: async () => {
    if (USE_MOCK) return [...userRoleStore];
    return apiGet('/user-roles');
  },

  getByUserId: async (userId) => {
    if (USE_MOCK) return userRoleStore.filter(ur => ur.UserId === userId);
    return apiGet(`/user-roles/user/${userId}`);
  },

  getByRoleId: async (roleId) => {
    if (USE_MOCK) return userRoleStore.filter(ur => ur.RoleId === roleId);
    return apiGet(`/user-roles/role/${roleId}`);
  },

  assign: async (roleId, userId) => {
    if (USE_MOCK) {
      const exists = userRoleStore.find(ur => ur.RoleId === roleId && ur.UserId === userId);
      if (exists) throw new Error('This role is already assigned to this user.');
      const newRecord = {
        RolePermissionId: getNextId(userRoleStore, 'RolePermissionId'),
        RoleId: roleId,
        UserId: userId,
      };
      userRoleStore = [...userRoleStore, newRecord];
      return newRecord;
    }
    return apiPost('/user-roles', { roleId, userId });
  },

  revoke: async (rolePermissionId) => {
    if (USE_MOCK) {
      userRoleStore = userRoleStore.filter(ur => ur.RolePermissionId !== rolePermissionId);
      return { success: true };
    }
    return apiDelete(`/user-roles/${rolePermissionId}`);
  },

  // Enriched view for the UserRole Management page
  getAllEnriched: async () => {
    if (USE_MOCK) {
      return userRoleStore.map(ur => ({
        ...ur,
        User: mockUsers.find(u => u.UserId === ur.UserId),
        Role: mockRoles.find(r => r.RoleId === ur.RoleId),
      }));
    }
    return apiGet('/user-roles/enriched');
  },
};
