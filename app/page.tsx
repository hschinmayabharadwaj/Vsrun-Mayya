'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-12 w-3/4 rounded-lg"></div>
        <div className="skeleton h-20 w-full rounded-lg"></div>
        <div className="skeleton h-12 w-1/2 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          Public Service Platform
        </h1>
        <p className="text-base text-neutral-text">
          Check your application status and manage your services
        </p>
      </div>

      {/* Main CTA Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Status Check */}
        <Link href="/status">
          <div className="block p-6 bg-white border-2 border-neutral-border rounded-lg hover:border-accent hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📋</span>
              <h2 className="text-xl font-semibold text-primary">Check Status</h2>
            </div>
            <p className="text-sm text-neutral-text">
              Track your application or grievance in real-time
            </p>
          </div>
        </Link>

        {/* New Application */}
        <Link href="/apply">
          <div className="block p-6 bg-white border-2 border-neutral-border rounded-lg hover:border-accent hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📝</span>
              <h2 className="text-xl font-semibold text-primary">New Application</h2>
            </div>
            <p className="text-sm text-neutral-text">
              Start a new grievance or application
            </p>
          </div>
        </Link>
      </div>

      {/* Info Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary">How it works</h2>
        <div className="space-y-3">
          <div className="flex gap-3 p-4 bg-white border-l-4 border-accent rounded">
            <span className="text-2xl flex-shrink-0">1️⃣</span>
            <div>
              <h3 className="font-semibold text-primary">Submit</h3>
              <p className="text-sm text-neutral-text">
                Fill out and submit your application or grievance online
              </p>
            </div>
          </div>
          <div className="flex gap-3 p-4 bg-white border-l-4 border-accent rounded">
            <span className="text-2xl flex-shrink-0">2️⃣</span>
            <div>
              <h3 className="font-semibold text-primary">Track</h3>
              <p className="text-sm text-neutral-text">
                Monitor the status and get updates in real-time
              </p>
            </div>
          </div>
          <div className="flex gap-3 p-4 bg-white border-l-4 border-accent rounded">
            <span className="text-2xl flex-shrink-0">3️⃣</span>
            <div>
              <h3 className="font-semibold text-primary">Resolve</h3>
              <p className="text-sm text-neutral-text">
                Receive updates and resolution notifications
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
