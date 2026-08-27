'use client';

import React from 'react';
import { useAuth } from '@/components/Providers';
import { Icon } from '@/components/Icon';
import Link from 'next/link';

interface AuthGateProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AuthGate({
  children,
  title = 'Sign in required',
  description = 'Please sign in to access this citizen service.',
}: AuthGateProps) {
  const { loggedIn, toggle } = useAuth();

  if (loggedIn) {
    return <>{children}</>;
  }

  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="bg-white rounded-2xl border border-outline-variant p-8 text-center shadow-card">
        <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto mb-5">
          <Icon name="lock" size={32} />
        </div>
        <h2 className="text-headline-sm font-bold text-on-surface mb-2">{title}</h2>
        <p className="text-body-sm text-on-surface-variant mb-6">{description}</p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={toggle}
            className="btn-primary w-full py-3 justify-center text-label-lg font-semibold"
          >
            Sign in with Citizen ID / Demo
          </button>
          <Link
            href="/"
            className="btn-outline w-full py-2.5 justify-center text-body-sm text-on-surface-variant block text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
