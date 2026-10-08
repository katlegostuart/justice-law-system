import axios from 'axios';

// TODO: replace with the URL Katlego gives you for the API
const api = axios.create({ baseURL: 'https://localhost:7000/api' });

// true = fake users for testing, false = real API
const USE_MOCK = true;

// The Attorney and Client users carry the number of their own record,
// so their dashboards know whose data to show.
const mockUsers = [
  { email: 'admin@justicelaw.com', password: 'Admin123', name: 'Admin User', role: 'Admin' },
  { email: 'attorney@justicelaw.com', password: 'Attorney123', name: 'Thabo Sithole', role: 'Attorney', staffNumber: 'STF-102' },
  { email: 'client@justicelaw.com', password: 'Client123', name: 'Eleanor Vance', role: 'Client', clientNumber: 'CLI-4029' },
];

export async function loginRequest(email, password) {
  if (USE_MOCK) {
    const found = mockUsers.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password');
    const { password: _unused, ...safeUser } = found;
    return { token: 'mock-token', ...safeUser };
  }
  const res = await api.post('/auth/login', { email, password });
  return res.data; // expected: { token, name, role } (plus clientNumber / staffNumber)
}

export default api;
