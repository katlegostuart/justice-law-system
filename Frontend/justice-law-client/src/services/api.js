import axios from 'axios';

// Backend API URL
const api = axios.create({ 
  baseURL: 'https://localhost:54082/api' 
});

// Change this to false to use the real API
const USE_MOCK = false;

// Automatically attach the JWT token to every request if the user is logged in
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export async function loginRequest(email, password) {
  if (USE_MOCK) {
    // keeping the mock users code for fallback if the backend auth isn't ready
    const mockUsers = [
      { email: 'admin@justicelaw.com', password: 'Admin123', name: 'Admin User', role: 'Admin' },
      { email: 'attorney@justicelaw.com', password: 'Attorney123', name: 'Thabo Sithole', role: 'Attorney', staffNumber: 'STF-102' },
      { email: 'client@justicelaw.com', password: 'Client123', name: 'Eleanor Vance', role: 'Client', clientNumber: 'CLI-4029' }
    ];
    const found = mockUsers.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password');
    delete found.password;
    return { token: 'mock-token', ...found };
  }
  
    // 1. Real API call to get token
    const loginRes = await api.post('/auth/login', { email, password });
    const { token, role, email: userEmail } = loginRes.data;

    // 2. Immediately fetch the user profile to get name, staffNumber, clientNumber
    const meRes = await api.get('/Me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    // 3. Merge and return the full user object
    return { token, role, email: userEmail, ...meRes.data };
}

export default api;
