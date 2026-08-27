'use client';

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';

interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
}

interface AuthCtx {
  user: User | null;
  loggedIn: boolean;
  loading: boolean;
  signIn: (email?: string, password?: string) => Promise<void>;
  signInAsDemo: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  loggedIn: false,
  loading: true,
  signIn: async () => {},
  signInAsDemo: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('demo-user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('demo-user'); }
    }
    setLoading(false);
  }, []);

  const signIn = async (email?: string, _password?: string) => {
    const demo: User = {
      uid: 'demo-uid-001',
      displayName: email?.split('@')[0] || 'Citizen',
      email: email || 'citizen@citizen.gov.in',
    };
    localStorage.setItem('demo-user', JSON.stringify(demo));
    setUser(demo);
  };

  const signInAsDemo = async () => {
    const demo: User = {
      uid: 'demo-uid-001',
      displayName: 'Demo Citizen',
      email: 'demo@citizen.gov.in',
    };
    localStorage.setItem('demo-user', JSON.stringify(demo));
    setUser(demo);
  };

  const signOut = async () => {
    localStorage.removeItem('demo-user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loggedIn: !!user, loading, signIn, signInAsDemo, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
