import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = 'nagriksetu_citizen_user_v1';
const DEMO_STORAGE_KEY = 'nagriksetu_demo_session_v1';
const DEMO_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

function getValidStoredUser() {
  try {
    // 1. Check active demo session first (stored in sessionStorage)
    const demoRaw = sessionStorage.getItem(DEMO_STORAGE_KEY);
    if (demoRaw) {
      const demoData = JSON.parse(demoRaw);
      const isExpired = demoData.expiresAt && new Date(demoData.expiresAt).getTime() <= Date.now();
      if (!isExpired && demoData.mode === 'demo') {
        return demoData;
      }
      // Clean up expired demo session
      sessionStorage.removeItem(DEMO_STORAGE_KEY);
    }

    // 2. Fall back to standard persistent user in localStorage
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(getValidStoredUser);

  useEffect(() => {
    try {
      if (!currentUser) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        sessionStorage.removeItem(DEMO_STORAGE_KEY);
        return;
      }

      if (currentUser.mode === 'demo') {
        sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [currentUser]);

  // Standard login for testing with identifier
  const login = (userData) => {
    const user = {
      name: userData.fullName || userData.name || userData.identifier || 'Citizen User',
      mobile: userData.mobile || (userData.identifier && /^\d+$/.test(userData.identifier) ? userData.identifier : ''),
      email: userData.email || (userData.identifier && userData.identifier.includes('@') ? userData.identifier : ''),
      ward: userData.ward || 'Agra Municipal Ward (Agra, Uttar Pradesh)',
      avatar: userData.avatar || '/assets/user_avatar.jpg',
      loggedInAt: new Date().toISOString(),
      mode: 'standard',
      isDemo: false,
    };
    setCurrentUser(user);
    return user;
  };

  // Demo sign-in for hackathons & evaluation: runtime random UUID, 2-hr expiry in sessionStorage
  const loginDemo = (customOptions = {}) => {
    const runtimeSessionId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `demo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const now = Date.now();
    const demoSession = {
      mode: 'demo',
      sessionId: runtimeSessionId,
      displayName: customOptions.displayName || 'Demo Citizen',
      name: customOptions.displayName || 'Demo Citizen',
      mobile: customOptions.mobile || '9876543210',
      email: customOptions.email || 'demo.citizen@nagriksetu.demo',
      ward: customOptions.ward || 'Ward 42, Civil Lines (Agra Municipal Corp)',
      avatar: '/assets/user_avatar.jpg',
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + DEMO_DURATION_MS).toISOString(),
      isDemo: true,
      demoDisclaimer:
        'Demo account: Data and access are for demonstration only. This is not a verified citizen identity.',
    };

    try {
      sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoSession));
    } catch {
      // Ignore
    }

    setCurrentUser(demoSession);
    return demoSession;
  };

  const logout = () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(DEMO_STORAGE_KEY);
    } catch {
      // Ignore
    }
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isDemoSession: currentUser?.mode === 'demo',
        login,
        loginDemo,
        logout,
      }}
    >
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
