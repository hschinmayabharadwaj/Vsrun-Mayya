'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Application } from '@/lib/mock-data';

const STATUS_CONFIG = {
  'submitted': { label: 'Submitted', color: 'bg-blue-100 text-blue-800', icon: '📋' },
  'under-review': { label: 'Under Review', color: 'bg-yellow-100 text-yellow-800', icon: '🔍' },
  'approved': { label: 'Approved', color: 'bg-green-100 text-green-800', icon: '✅' },
  'rejected': { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: '❌' },
};

export default function StatusPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const response = await fetch('/api/status');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setApplications(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchApplications();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-primary mb-6">Check Status</h1>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-32 w-full rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-primary mb-6">Check Status</h1>
        <div className="p-4 bg-error/10 border-2 border-error rounded-lg">
          <p className="text-error font-semibold">Unable to load your applications</p>
          <p className="text-sm text-error/80 mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-error text-white rounded font-medium hover:bg-red-600 min-h-44px"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Check Status</h1>
        <Link
          href="/"
          className="text-sm text-accent hover:text-accent-dark underline"
        >
          Back to Home
        </Link>
      </div>

      {/* Empty State */}
      {applications.length === 0 ? (
        <div className="text-center p-8 bg-white border-2 border-dashed border-neutral-border rounded-lg">
          <p className="text-neutral-text text-lg mb-4">No applications found</p>
          <Link
            href="/apply"
            className="inline-block px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark"
          >
            Start a New Application
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Dev Mode OTP Display */}
          <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded text-sm">
            <p className="font-mono text-blue-900">
              Dev OTP: <span className="font-bold">123456</span>
            </p>
          </div>

          {/* Applications List */}
          {applications.map((app) => {
            const statusConfig = STATUS_CONFIG[app.status];
            return (
              <div
                key={app.id}
                className="p-4 md:p-6 bg-white border-2 border-neutral-border rounded-lg hover:shadow-md transition-shadow"
              >
                {/* Title and Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-primary">
                      {app.title}
                    </h2>
                    <p className="text-sm text-neutral-text mt-1">
                      Ref: {app.id}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded font-medium text-sm whitespace-nowrap ${statusConfig.color}`}>
                    {statusConfig.icon} {statusConfig.label}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-neutral-text mb-4">
                  {app.description}
                </p>

                {/* Timeline */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-text">Submitted:</span>
                    <span className="font-medium text-primary">
                      {formatDate(app.submittedAt)}
                    </span>
                  </div>
                  {app.expectedResolutionDate && (
                    <div className="flex justify-between">
                      <span className="text-neutral-text">Expected Resolution:</span>
                      <span className="font-medium text-primary">
                        {formatDate(app.expectedResolutionDate)}
                      </span>
                    </div>
                  )}
                  {app.notes && (
                    <div className="flex justify-between">
                      <span className="text-neutral-text">Latest Update:</span>
                      <span className="font-medium text-primary">
                        {app.notes}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-3 bg-accent text-white rounded font-medium hover:bg-accent-dark transition-colors min-h-44px">
                    View Details
                  </button>
                  <button className="flex-1 px-4 py-3 bg-white border-2 border-accent text-accent rounded font-medium hover:bg-blue-50 transition-colors min-h-44px">
                    Get Help
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
