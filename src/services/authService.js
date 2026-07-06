import { mockUsers, mockUserRoles, mockRoles, getPrimaryRoleByUserId } from '../data/mockData.js';
import { apiPost } from './api.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Fake JWT generator (mock only)
const makeFakeToken = (userId, role) =>
  btoa(JSON.stringify({ sub: userId, role, iat: Date.now(), exp: Date.now() + 86400000 }));

// Credentials map for mock login (email → password)
const MOCK_CREDENTIALS = {
  'admin@spms.edu':             'Admin@123',
  'nvoss@spms.edu':             'Faculty@123',
  'esinclair@spms.edu':         'Faculty@123',
  'rashford@spms.edu':          'Faculty@123',
  'lcalloway@student.spms.edu': 'Student@123',
  'psharma@student.spms.edu':   'Student@123',
  'mosei@student.spms.edu':     'Student@123',
  'ypark@student.spms.edu':     'Student@123',
  'fbergmann@student.spms.edu': 'Student@123',
  'aokonkwo@student.spms.edu':  'Student@123',
};

export const authService = {
  login: async (email, password) => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 600)); // simulate latency
      const user = mockUsers.find(u => u.Email === email && !u.IsDeleted);
      if (!user) throw new Error('No account found with that email address.');
      if (!user.IsActive) throw new Error('Your account has been deactivated. Contact admin.');
      if (MOCK_CREDENTIALS[email] !== password) throw new Error('Incorrect password.');

      const role = getPrimaryRoleByUserId(user.UserId);
      if (!role) throw new Error('No role assigned. Contact admin.');

      const token = makeFakeToken(user.UserId, role.RoleName);
      return { user, role: role.RoleName, token };
    }
    const data = await apiPost('/auth/login', { email, password });
    return data; // expects { user, role, token }
  },

  logout: async () => {
    if (USE_MOCK) return;
    await apiPost('/auth/logout', {}).catch(() => {});
  },

  validateToken: async (token) => {
    if (USE_MOCK) {
      try {
        const payload = JSON.parse(atob(token));
        return payload.exp > Date.now();
      } catch {
        return false;
      }
    }
    const data = await apiPost('/auth/validate', { token });
    return data.valid;
  },
};
