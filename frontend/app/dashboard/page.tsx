'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ApplicationCard } from '@/components/ApplicationTimeline';
import { Icon } from '@/components/Icon';
import { FadeIn, SlideUp } from '@/components/MotionWrappers';
import type { Application, Notification } from '@/lib/types';
import { useAuth } from '@/components/Providers';

const DEMO_APPLICATIONS: Application[] = [
  { id: 'APP-2026-001', serviceId: 'aadhaar-update', serviceName: 'Aadhaar Card Update', citizenId: 'demo-uid-001', citizenName: 'Demo Citizen', status: 'approved', submittedAt: '2026-08-20T10:30:00Z', updatedAt: '2026-08-22T14:00:00Z', formData: {}, timeline: [
    { stage: 'submitted', label: 'Submitted', completed: true, active: false, timestamp: '2026-08-20T10:30:00Z' },
    { stage: 'under_review', label: 'Under Review', completed: true, active: false, timestamp: '2026-08-21T09:00:00Z' },
    { stage: 'approved', label: 'Approved', completed: true, active: true, timestamp: '2026-08-22T14:00:00Z' },
  ] },
  { id: 'APP-2026-002', serviceId: 'income-cert', serviceName: 'Income Certificate', citizenId: 'demo-uid-001', citizenName: 'Demo Citizen', status: 'under_review', submittedAt: '2026-08-24T09:15:00Z', updatedAt: '2026-08-25T11:00:00Z', formData: {}, timeline: [
    { stage: 'submitted', label: 'Submitted', completed: true, active: false, timestamp: '2026-08-24T09:15:00Z' },
    { stage: 'under_review', label: 'Under Review', completed: false, active: true, timestamp: '2026-08-25T11:00:00Z' },
  ] },
  { id: 'APP-2026-003', serviceId: 'caste-cert', serviceName: 'Caste Certificate', citizenId: 'demo-uid-001', citizenName: 'Demo Citizen', status: 'submitted', submittedAt: '2026-08-26T16:45:00Z', updatedAt: '2026-08-26T16:45:00Z', formData: {}, timeline: [
    { stage: 'submitted', label: 'Submitted', completed: true, active: true, timestamp: '2026-08-26T16:45:00Z' },
  ] },
];

const DEMO_NOTIFICATIONS: Notification[] = [
  { id: 'n1', citizenId: 'demo-uid-001', message: 'Your Aadhaar Card Update application has been approved.', createdAt: '2026-08-22T14:00:00Z', read: true },
  { id: 'n2', citizenId: 'demo-uid-001', message: 'Income Certificate is now under review by the issuing authority.', createdAt: '2026-08-25T11:00:00Z', read: false },
  { id: 'n3', citizenId: 'demo-uid-001', message: 'Caste Certificate application received. Processing will begin shortly.', createdAt: '2026-08-26T16:45:00Z', read: false },
];

const DEMO_DRAFTS = [
  { id: 'd1', serviceName: 'Domicile Certificate', lastSaved: '2026-08-25T18:30:00Z' },
  { id: 'd2', serviceName: 'PAN Card Application', lastSaved: '2026-08-23T12:00:00Z' },
];

function LoginModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { signIn, signInAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
    onClose();
    router.refresh();
  };

  const handleDemo = async () => {
    await signInAsDemo();
    onClose();
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-elevated w-full max-w-md p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          aria-label="Close"
        >
          <Icon name="close" size={20} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Emblem_of_India.svg" alt="" className="w-8 h-8" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.webp" alt="" className="w-8 h-8 rounded-lg" />
          <span className="text-headline-sm text-on-surface">Sign In</span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full px-3 py-2.5 text-body-sm border border-outline-variant rounded-xl min-h-[44px]"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-3 py-2.5 text-body-sm border border-outline-variant rounded-xl min-h-[44px]"
          />
          <button type="submit" className="btn-primary w-full py-2.5 min-h-[44px] text-body-sm font-semibold rounded-xl">
            Sign In
          </button>
        </form>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-outline-variant" />
          <span className="text-label-sm text-on-surface-variant">or</span>
          <div className="flex-1 h-px bg-outline-variant" />
        </div>

        <button
          type="button"
          onClick={handleDemo}
          className="w-full py-2.5 min-h-[44px] text-body-sm font-semibold rounded-xl border-2 border-dashed border-secondary/40 text-secondary hover:bg-secondary/5 transition-colors"
        >
          Try Demo Account
        </button>
        <p className="text-label-sm text-on-surface-variant text-center mt-3">
          Experience the portal with sample data — no registration needed
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loggedIn, signOut } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(true);

  if (!loggedIn) {
    return (
      <>
        {loginModalOpen && <LoginModal onClose={() => { setLoginModalOpen(false); router.push('/'); }} />}
        <div className="max-w-container-max mx-auto p-margin-mobile md:p-margin-desktop">
          <div className="skeleton h-20 w-96 rounded-xl" />
        </div>
      </>
    );
  }

  const firstName = (user?.displayName || 'Citizen').split(' ')[0];
  const unreadCount = DEMO_NOTIFICATIONS.filter((n) => !n.read).length;

  const formatRelative = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="max-w-container-max mx-auto p-margin-mobile md:p-margin-desktop">
      {/* Welcome header */}
      <FadeIn>
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-1">
            <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-white text-2xl font-bold shadow-soft shrink-0">
              {firstName[0]}
            </div>
            <div className="flex-1">
              <h1 className="text-display-lg text-on-surface leading-tight">
                Welcome back, <span className="gradient-text-accent">{firstName}</span>
              </h1>
              <p className="text-body-md text-on-surface-variant mt-0.5">
                Here is an overview of your active applications and documents.
              </p>
            </div>
            <button
              type="button"
              onClick={async () => { await signOut(); router.push('/'); }}
              className="flex items-center gap-2 px-4 py-2 text-body-sm font-medium text-error border border-error/30 rounded-xl hover:bg-error/5 transition-colors shrink-0 min-h-[40px]"
            >
              <Icon name="log_out" size={18} />
              Sign Out
            </button>
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
                {DEMO_APPLICATIONS.map((app) => (
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
                {DEMO_DRAFTS.map((draft) => (
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
                {unreadCount > 0 && (
                  <span className="bg-error text-white text-label-sm px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              <ul className="divide-y divide-outline-variant/50">
                {DEMO_NOTIFICATIONS.map((n) => (
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
                  <Icon name="info" size={16} className="text-secondary" />
                </div>
                <p className="text-label-md text-secondary font-bold">Demo Mode</p>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                You are viewing the dashboard with sample data. All information shown is for demonstration purposes.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
