import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    const storedToken = localStorage.getItem('token'); 
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        // ignore
      }
    }
  }, []);

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