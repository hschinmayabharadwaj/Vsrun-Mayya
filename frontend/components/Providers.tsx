'use client';

import { ClerkProvider as RawClerkProvider } from '@clerk/nextjs';
import { useState, useEffect, createContext, useContext } from 'react';

// Simple auth context for demo mode (works without Clerk keys)
interface AuthCtx {
  loggedIn: boolean;
  toggle: () => void;
}

const AuthContext = createContext<AuthCtx>({ loggedIn: false, toggle: () => {} });
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setLoggedIn(localStorage.getItem('demo-auth') === 'true');
  }, []);
  const toggle = () => {
    const next = !loggedIn;
    setLoggedIn(next);
    localStorage.setItem('demo-auth', String(next));
  };
  return <AuthContext.Provider value={{ loggedIn, toggle }}>{children}</AuthContext.Provider>;
}

// Clerk provider wraps the app when CLERK_PUBLISHABLE_KEY is set
export function Providers({ children }: { children: React.ReactNode }) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <AuthProvider>{children}</AuthProvider>;

  if (clerkKey) {
    return (
      <RawClerkProvider publishableKey={clerkKey}>
        <AuthProvider>{children}</AuthProvider>
      </RawClerkProvider>
    );
  }

  return <AuthProvider>{children}</AuthProvider>;
}
