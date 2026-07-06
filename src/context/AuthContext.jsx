import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'spms_auth';

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { user: null, role: null, token: null };
    } catch {
      return { user: null, role: null, token: null };
    }
  });

  // Persist to localStorage on every change
  useEffect(() => {
    if (auth.token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [auth]);

  const login = useCallback((user, role, token) => {
    setAuth({ user, role, token });
  }, []);

  const logout = useCallback(() => {
    setAuth({ user: null, role: null, token: null });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const updateProfile = useCallback((updatedUser) => {
    setAuth(prev => ({ ...prev, user: { ...prev.user, ...updatedUser } }));
  }, []);

  const isAuthenticated = Boolean(auth.token && auth.user);

  const hasRole = useCallback((roleName) => {
    if (!auth.role) return false;
    if (Array.isArray(roleName)) return roleName.includes(auth.role);
    return auth.role === roleName;
  }, [auth.role]);

  return (
    <AuthContext.Provider value={{ ...auth, isAuthenticated, login, logout, updateProfile, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
