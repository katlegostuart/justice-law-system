import { createContext, useContext, useState } from 'react';
import { loginRequest } from '../services/api';

const AuthContext = createContext(null);

export const roleHome = {
  Admin: '/admin',
  Attorney: '/attorney',
  Client: '/client',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const data = await loginRequest(email, password);
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
