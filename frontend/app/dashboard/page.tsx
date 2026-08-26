'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ApplicationCard } from '@/components/ApplicationTimeline';
import { Icon } from '@/components/Icon';
import { FadeIn, SlideUp } from '@/components/MotionWrappers';
import type { Application, Notification } from '@/lib/types';
import { AuthGate } from '@/components/AuthGate';
import { authApiFetch } from '@/lib/auth-api';

interface DashboardData {
  citizen: { name: string };
  applications: Application[];
  notifications: Notification[];
  drafts: { id: string; serviceName: string; lastSaved: string }[];
  unreadCount: number;
}

function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authApiFetch<DashboardData>('/api/dashboard')
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto p-margin-mobile md:p-margin-desktop space-y-5">
        <div className="skeleton h-20 w-96 rounded-xl" />
        <div className="skeleton h-72 rounded-xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-container-max mx-auto p-margin-desktop">
        <div className="p-5 bg-error/5 text-error rounded-xl border border-error/20 flex items-start gap-3" role="alert">
          <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center shrink-0">
            <Icon name="error" size={20} className="text-error" />
          </div>
          <div>
            <p className="font-semibold">Could not load dashboard</p>
            <p className="text-body-sm mt-1">{error}</p>
            <button type="button" onClick={() => window.location.reload()} className="mt-3 btn-primary px-5 py-2 min-h-[40px]">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatRelative = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const firstName = data.citizen.name.split(' ')[0];

  return (
    <div className="max-w-container-max mx-auto p-margin-mobile md:p-margin-desktop">
      {/* Welcome header */}
      <FadeIn>
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Emblem_of_India.svg" alt="" className="w-10 h-10 shrink-0" />
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white text-xl font-bold shadow-soft">
              {firstName[0]}
            </div>
            <div>
              <h1 className="text-display-lg text-on-surface leading-tight">
                Welcome back, <span className="gradient-text-accent">{firstName}</span>
              </h1>
              <p className="text-body-md text-on-surface-variant mt-0.5">
                Here is an overview of your active applications and documents.
              </p>
            </div>
          </div>
        </header>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Applications */}
          <SlideUp delay={0.1}>
            <section className="bg-surface border border-outline-variant rounded-2xl shadow-card overflow-hidden">
              <div className="flex justify-between items-center px-5 py-4 border-b border-outline-variant/50">
                <h2 className="text-headline-md text-on-surface flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-secondary/8 flex items-center justify-center">
                    <Icon name="task" size={18} className="text-secondary" />
                  </div>
                  My Applications
                </h2>
                <Link href="/track" className="text-secondary text-label-md hover:underline flex items-center gap-1 group">
                  Track by ID
                  <Icon name="chevron_right" size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              <div className="p-5 flex flex-col gap-4">
                {data.applications.map((app) => (
                  <ApplicationCard key={app.id} application={app} />
                ))}
              </div>
            </section>
          </SlideUp>

          {/* Drafts */}
          <SlideUp delay={0.2}>
            <section className="bg-surface border border-outline-variant rounded-2xl shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-outline-variant/50">
                <h2 className="text-headline-md text-on-surface flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Icon name="edit_document" size={18} className="text-warning" />
                  </div>
                  Saved Drafts
                </h2>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.drafts.map((draft) => (
                  <div key={draft.id} className="gov-card min-h-[120px] flex flex-col justify-between cursor-pointer group">
                    <div>
                      <h3 className="text-body-md font-semibold text-on-surface">{draft.serviceName}</h3>
                      <p className="text-label-sm text-on-surface-variant mt-1 flex items-center gap-1">
                        <Icon name="schedule" size={12} />
                        Last saved: {formatRelative(draft.lastSaved)}
                      </p>
                    </div>
                    <span className="text-secondary text-label-md flex items-center gap-1 mt-3 justify-end group-hover:gap-2 transition-all">
                      Resume <Icon name="arrow_forward" size={16} />
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </SlideUp>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-6">
          {/* Notifications */}
          <SlideUp delay={0.15}>
            <section className="bg-surface border border-outline-variant rounded-2xl shadow-card overflow-hidden">
              <div className="flex justify-between items-center px-5 py-4 border-b border-outline-variant/50">
                <h2 className="text-headline-md text-on-surface flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Icon name="notifications" size={18} className="text-indigo-600" />
                  </div>
                  Notifications
                </h2>
                {data.unreadCount > 0 && (
                  <span className="bg-error text-white text-label-sm px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                    {data.unreadCount}
                  </span>
                )}
              </div>
              <ul className="divide-y divide-outline-variant/50">
                {data.notifications.map((n) => (
                  <li key={n.id} className={`px-5 py-3.5 flex items-start gap-3 transition-colors hover:bg-neutral-50 ${n.read ? 'opacity-60' : ''}`}>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0 pulse-dot" />}
                    {n.read && <div className="w-2 shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-body-sm text-on-surface leading-relaxed">{n.message}</p>
                      <span className="text-label-sm text-on-surface-variant mt-0.5 block">{formatRelative(n.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </SlideUp>

          {/* Account note */}
          <FadeIn delay={0.25}>
            <div className="p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Icon name="science" size={16} className="text-secondary" />
                </div>
                <p className="text-label-md text-secondary font-bold">Citizen account</p>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                Your activity is linked to your verified Firebase account.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <AuthGate><DashboardContent /></AuthGate>;
}
