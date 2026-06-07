import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('authUser');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const login = (userData, authToken) => {
    localStorage.setItem('authUser', JSON.stringify(userData));
    localStorage.setItem('token', authToken); 
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem('authUser');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}