// src/services/api.js
// Base HTTP helpers that attach JWT and handle 401 globally.
// All service files import from here for real-API calls.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7000/api';

const getToken = () => {
  try {
    const stored = localStorage.getItem('spms_auth');
    if (!stored) return null;
    return JSON.parse(stored).token || null;
  } catch {
    return null;
  }
};

const handleUnauthorized = () => {
  localStorage.removeItem('spms_auth');
  window.location.href = '/login';
};

const buildHeaders = (extra = {}) => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
};

const handleResponse = async (res) => {
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
};

export const apiGet = (path) =>
  fetch(`${BASE_URL}${path}`, { method: 'GET', headers: buildHeaders() }).then(handleResponse);

export const apiPost = (path, body) =>
  fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  }).then(handleResponse);

export const apiPut = (path, body) =>
  fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  }).then(handleResponse);

export const apiDelete = (path) =>
  fetch(`${BASE_URL}${path}`, { method: 'DELETE', headers: buildHeaders() }).then(handleResponse);
