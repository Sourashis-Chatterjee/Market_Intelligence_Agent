import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('mia_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // token stored separately so it's easy to attach to requests
  const [token, setToken] = useState(() => sessionStorage.getItem('mia_token') || null);

  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    sessionStorage.setItem('mia_user', JSON.stringify(userData));
    sessionStorage.setItem('mia_token', jwt);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('mia_user');
    sessionStorage.removeItem('mia_token');
  };

  // ── Real API calls ─────────────────────────────────────────
  const register = async (name, email, password) => {
    const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    login(data.user, data.token);
    return data.user;
  };

  const loginWithCredentials = async (email, password) => {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    login(data.user, data.token);
    return data.user;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, loginWithCredentials }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
