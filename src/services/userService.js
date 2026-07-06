import { mockUsers, getNextId } from '../data/mockData.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// In-memory mutable store
let userStore = [...mockUsers];

export const userService = {
  getAll: async () => {
    if (USE_MOCK) return userStore.filter(u => !u.IsDeleted);
    return apiGet('/users');
  },

  getById: async (id) => {
    if (USE_MOCK) return userStore.find(u => u.UserId === id && !u.IsDeleted) || null;
    return apiGet(`/users/${id}`);
  },

  create: async (data) => {
    if (USE_MOCK) {
      const exists = userStore.find(u => u.Email === data.Email && !u.IsDeleted);
      if (exists) throw new Error('A user with this email already exists.');
      const newUser = { ...data, UserId: getNextId(userStore, 'UserId'), IsActive: true, IsDeleted: false };
      userStore = [...userStore, newUser];
      return newUser;
    }
    return apiPost('/users', data);
  },

  update: async (id, data) => {
    if (USE_MOCK) {
      const idx = userStore.findIndex(u => u.UserId === id);
      if (idx === -1) throw new Error('User not found.');
      // Check email uniqueness (exclude self)
      const emailConflict = userStore.find(u => u.Email === data.Email && u.UserId !== id && !u.IsDeleted);
      if (emailConflict) throw new Error('Email already in use by another user.');
      userStore = userStore.map(u => u.UserId === id ? { ...u, ...data } : u);
      return userStore.find(u => u.UserId === id);
    }
    return apiPut(`/users/${id}`, data);
  },

  toggleActive: async (id) => {
    if (USE_MOCK) {
      userStore = userStore.map(u => u.UserId === id ? { ...u, IsActive: !u.IsActive } : u);
      return userStore.find(u => u.UserId === id);
    }
    return apiPut(`/users/${id}/toggle-active`, {});
  },

  softDelete: async (id) => {
    if (USE_MOCK) {
      userStore = userStore.map(u => u.UserId === id ? { ...u, IsDeleted: true, IsActive: false } : u);
      return { success: true };
    }
    return apiDelete(`/users/${id}`);
  },
};
