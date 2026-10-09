import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = 'nagriksetu_citizen_user_v1';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
  }, [currentUser]);

  const login = (userData) => {
    const user = {
      name: userData.fullName || userData.name || userData.identifier || 'Citizen User',
      mobile: userData.mobile || (userData.identifier && /^\d+$/.test(userData.identifier) ? userData.identifier : ''),
      email: userData.email || (userData.identifier && userData.identifier.includes('@') ? userData.identifier : ''),
      ward: userData.ward || 'Agra Municipal Ward (Agra, Uttar Pradesh)',
      avatar: userData.avatar || '/assets/user_avatar.jpg',
      loggedInAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated: Boolean(currentUser), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
