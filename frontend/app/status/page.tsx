'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { Application } from '@/lib/mock-data';

const STATUS_STYLE: Record<string, { label: string; bg: string; text: string }> = {
  submitted: { label: 'Submitted', bg: 'bg-secondary/10', text: 'text-secondary' },
  'under-review': { label: 'Under Review', bg: 'bg-warning/10', text: 'text-warning' },
  approved: { label: 'Approved', bg: 'bg-success/10', text: 'text-success' },
  rejected: { label: 'Rejected', bg: 'bg-error/10', text: 'text-error' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function StatusPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/status')
      .then((r) => { if (!r.ok) throw new Error('Failed to load'); return r.json(); })
      .then((d) => setApps(d.data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-headline-lg text-on-surface">Check Status</h1>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-headline-lg text-on-surface">Check Status</h1>
        <div className="p-4 bg-error/5 border border-error rounded-xl">
          <p className="text-error font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary mt-3 text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Check Status' }]} />

      <div className="flex items-center justify-between">
        <h1 className="text-headline-lg text-on-surface">Check Status</h1>
        <Link href="/apply" className="btn-primary text-sm">
          <Icon name="arrow_forward" size={14} /> New Application
        </Link>
      </div>

      {apps.length === 0 ? (
        <div className="text-center p-10 bg-surface rounded-xl border border-outline-variant border-dashed">
          <Icon name="search_off" size={40} className="text-on-surface-variant mx-auto mb-3" />
          <p className="text-body-lg text-on-surface-variant mb-4">No applications found</p>
          <Link href="/apply" className="btn-primary inline-flex">
            Start a New Application
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/20 text-body-sm text-on-surface">
            Demo OTP: <span className="font-mono font-bold">123456</span>
          </div>

          {apps.map((app) => {
            const st = STATUS_STYLE[app.status] || STATUS_STYLE.submitted;
            return (
              <div
                key={app.id}
                className="bg-surface rounded-xl border border-outline-variant p-5 hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-body-lg font-semibold text-on-surface">{app.title}</h2>
                    <p className="text-body-sm text-on-surface-variant mt-0.5">Ref: {app.id}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-label-md whitespace-nowrap ${st.bg} ${st.text}`}>
                    {st.label}
                  </span>
                </div>

                <p className="text-body-sm text-on-surface-variant mb-4">{app.description}</p>

                <div className="grid grid-cols-2 gap-2 text-body-sm mb-4">
                  <div>
                    <span className="text-on-surface-variant">Submitted:</span>{' '}
                    <span className="font-medium text-on-surface">{formatDate(app.submittedAt)}</span>
                  </div>
                  {app.expectedResolutionDate && (
                    <div>
                      <span className="text-on-surface-variant">Expected:</span>{' '}
                      <span className="font-medium text-on-surface">{formatDate(app.expectedResolutionDate)}</span>
                    </div>
                  )}
                  {app.notes && (
                    <div className="col-span-2">
                      <span className="text-on-surface-variant">Update:</span>{' '}
                      <span className="font-medium text-on-surface">{app.notes}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link href={`/apply/${app.id}`} className="btn-primary flex-1 text-center text-sm py-2">
                    View Details
                  </Link>
                  <Link href="/help" className="btn-outline flex-1 text-center text-sm py-2">
                    Get Help
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
