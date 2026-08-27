'use client';

import { type ReactNode } from 'react';
import { useAuth } from '@/components/Providers';

interface AuthGateProps {
  children: ReactNode;
  title?: string;
}

export function AuthGate({ children }: AuthGateProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto p-margin-mobile md:p-margin-desktop space-y-5">
        <div className="skeleton h-20 w-96 rounded-xl" />
        <div className="skeleton h-72 rounded-xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-container-max mx-auto p-margin-desktop">
        <div className="p-8 bg-surface border border-outline-variant rounded-2xl shadow-card text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-secondary text-2xl font-bold">?</span>
          </div>
          <h2 className="text-headline-md text-on-surface mb-2">Sign in required</h2>
          <p className="text-body-md text-on-surface-variant">
            Please sign in using the login button in the top-right corner to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
