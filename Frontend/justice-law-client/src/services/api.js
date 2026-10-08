import axios from 'axios';

// TODO: replace with the URL Katlego gives you for the API
const api = axios.create({ baseURL: 'https://localhost:7000/api' });

// true = fake users for testing, false = real API
const USE_MOCK = true;

const mockUsers = [
  { email: 'admin@justicelaw.com', password: 'Admin123', name: 'Admin User', role: 'Admin' },
  { email: 'attorney@justicelaw.com', password: 'Attorney123', name: 'Attorney User', role: 'Attorney' },
  { email: 'client@justicelaw.com', password: 'Client123', name: 'Client User', role: 'Client' },
];

export async function loginRequest(email, password) {
  if (USE_MOCK) {
    const found = mockUsers.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password');
    return { token: 'mock-token', name: found.name, role: found.role };
  }
  const res = await api.post('/auth/login', { email, password });
  return res.data; // expected: { token, name, role }
}

export default api;
