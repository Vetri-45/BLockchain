import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Simple JWT payload decoder (no library needed)
function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem('token');
    return t ? decodeJWT(t) : null;
  });

  const loginUser = (jwt) => {
    localStorage.setItem('token', jwt);
    const decoded = decodeJWT(jwt);
    setToken(jwt);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Check token expiry on mount
  useEffect(() => {
    if (user && user.exp && Date.now() / 1000 > user.exp) {
      logout();
    }
  }, []);

  const isAdmin = user?.roles?.includes('ROLE_ADMIN') ||
                  user?.role === 'ROLE_ADMIN' ||
                  user?.authorities?.some(a => a.authority === 'ROLE_ADMIN');

  return (
    <AuthContext.Provider value={{ token, user, isAdmin, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
