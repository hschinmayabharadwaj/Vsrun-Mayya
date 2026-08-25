'use client';

import { useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { ApplicationCard } from '@/components/ApplicationTimeline';
import { Icon } from '@/components/Icon';
import type { Application } from '@/lib/types';

export default function TrackPage() {
  const [refId, setRefId] = useState('');
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refId.trim()) {
      setError('Please enter your application reference ID.');
      return;
    }
    setLoading(true);
    setError(null);
    setApplication(null);
    try {
      const data = await apiFetch<Application>(`/api/applications/track/${encodeURIComponent(refId.trim())}`);
      setApplication(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Application not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-margin-mobile md:p-margin-desktop py-10">
      <div className="animate-fade-in">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-6 rounded-full gradient-accent" />
          <h1 className="text-headline-lg font-display text-primary">Track Application</h1>
        </div>
        <p className="text-body-md text-on-surface-variant mb-8 ml-4">
          Enter your application reference ID to check status in real time.
        </p>
      </div>

      <form onSubmit={handleTrack} className="bg-white border border-slate-200/80 rounded-2xl p-6 mb-6 shadow-card animate-slide-up">
        <label htmlFor="refId" className="block text-label-md mb-2 text-on-surface">
          Application Reference ID
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name="tag" size={18} />
            </div>
            <input
              id="refId"
              value={refId}
              onChange={(e) => setRefId(e.target.value.toUpperCase())}
              placeholder="e.g. RES-2026-8842"
              className="w-full pl-10 pr-4 py-3 text-body-md font-mono uppercase border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white min-h-[48px] transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-6 py-3 min-h-[48px] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Checking…
              </>
            ) : (
              <>
                <Icon name="search" size={18} className="text-white/80" />
                Check Status
              </>
            )}
          </button>
        </div>
        {error && (
          <p className="text-red-600 text-body-sm mt-3 flex items-center gap-1.5 animate-fade-in" role="alert">
            <Icon name="error" size={16} /> {error}
          </p>
        )}
      </form>

      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 mb-8 animate-fade-in-delay-1">
        <p className="text-label-md text-on-surface-variant mb-3 flex items-center gap-2">
          <Icon name="lightbulb" size={16} className="text-amber-500" />
          Try these demo IDs:
        </p>
        <div className="flex flex-wrap gap-2">
          {['RES-2026-8842', 'VEH-2026-1190', 'INC-2026-0001'].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setRefId(id)}
              className="font-mono text-body-sm px-4 py-2 bg-white border border-slate-200 rounded-full hover:border-secondary hover:bg-blue-50 text-secondary transition-all min-h-[40px] shadow-sm hover:shadow-glow"
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {application && (
        <section aria-live="polite" className="animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full gradient-accent" />
            <h2 className="text-headline-md font-display text-primary">Application Details</h2>
          </div>
          <ApplicationCard application={application} />
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-secondary text-label-md mt-5 hover:gap-3 transition-all min-h-[44px] group"
          >
            <Icon name="dashboard" size={18} />
            View full dashboard
            <Icon name="arrow_forward" size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </section>
      )}
    </div>
  );
}
