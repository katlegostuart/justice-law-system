import axios from 'axios';

export const API_BASE_URL = 'https://localhost:54082/api';

// true = real API and database, false = old sample data from mockData.js
export const USE_API = true;

const api = axios.create({ baseURL: API_BASE_URL });

// Send the login token with every request
api.interceptors.request.use((config) => {
  try {
    const saved = JSON.parse(localStorage.getItem('user') || 'null');
    if (saved && saved.token) config.headers.Authorization = `Bearer ${saved.token}`;
  } catch { /* ignore a broken saved value */ }
  return config;
});

// Expired or invalid token: log out and go to the login page
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = (err.config && err.config.url) || '';
    if (err.response && err.response.status === 401 && !url.includes('/auth/login')) {
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Turns an API error into a readable sentence
export function apiErrorMessage(err) {
  if (err.response) {
    const d = err.response.data;
    if (d && d.errors) return Object.values(d.errors).flat().join(' ');
    if (typeof d === 'string' && d) return d;
    if (d && d.title) return d.title;
    return `The API answered with status ${err.response.status}.`;
  }
  if (err.request) return 'Cannot reach the API. Is it running, and is API_BASE_URL in api.js correct?';
  return err.message || 'Something went wrong.';
}

const mockUsers = [
  { email: 'admin@justicelaw.com', password: 'Admin123', name: 'Admin User', role: 'Admin' },
  { email: 'attorney@justicelaw.com', password: 'Attorney123', name: 'Thabo Sithole', role: 'Attorney', staffNumber: 'STF-102' },
  { email: 'client@justicelaw.com', password: 'Client123', name: 'Eleanor Vance', role: 'Client', clientNumber: 'CLI-4029' },
];

export async function loginRequest(email, password) {
  const typed = String(email || '').trim().toLowerCase();

  if (!USE_API) {
    const found = mockUsers.find((u) => u.email === typed && u.password === password);
    if (!found) throw new Error('Invalid email or password');
    const { password: _unused, ...safeUser } = found;
    return { token: 'mock-token', ...safeUser };
  }

  try {
    const res = await api.post('/auth/login', { email: typed, password });
    const d = res.data;
    return {
      token: d.token,
      email: d.email,
      role: d.role,
      name: d.name || d.email,
      staffNumber: d.staffNumber,
      clientNumber: d.clientNumber,
    };
  } catch (err) {
    if (err.response && err.response.status === 401) throw new Error('Invalid email or password');
    throw new Error(apiErrorMessage(err));
  }
}

export default api;