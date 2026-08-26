import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { getNotices, getPortalConfig } from '@/lib/portal-api';
import { ServiceCard } from '@/components/ServiceCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from '@/components/MotionWrappers';
import { Icon } from '@/components/Icon';
import type { Service } from '@/lib/types';

export default async function HomePage() {
  let popularServices: Service[] = [];
  let notices: Awaited<ReturnType<typeof getNotices>> = [];
  let config = null;
  let error: string | null = null;

  try {
    [popularServices, notices, config] = await Promise.all([
      apiFetch<Service[]>('/api/services?popular=true'),
      getNotices(),
      getPortalConfig(),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unable to load portal content';
  }

  return (
    <div className="bg-background">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-50 via-white to-green-50">
        <div className="absolute inset-0 gradient-primary opacity-[0.03]" />
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-15">
          <div className="flex flex-col md:flex-row items-start gap-8 md:items-center">
            {/* National Emblem + Logo */}
            <FadeIn delay={0.05}>
              <div className="shrink-0 flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/Emblem_of_India.svg"
                  alt="National Emblem of India"
                  className="w-24 h-24 md:w-32 md:h-32 object-contain"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.webp"
                  alt="Portal Logo"
                  className="w-20 h-20 md:w-28 md:h-28 rounded-2xl shadow-soft object-cover"
                />
              </div>
            </FadeIn>

            <div className="max-w-3xl">
              <FadeIn delay={0.1}>
                <div className="flex items-center gap-2 mb-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/indian-flag.svg" alt="Indian Flag" className="w-8 h-5 rounded-sm" />
                  <p className="text-label-lg text-on-surface-variant tracking-wide uppercase">Government of India</p>
                </div>
                <h1 className="text-display-lg md:text-display-xl text-on-surface mb-4">
                  {config?.siteName ?? 'Citizen Services Portal'}
                </h1>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-body-lg text-on-surface-variant max-w-2xl mb-8 leading-relaxed">
                  Access essential citizen services, track applications, file grievances, and find official
                  helpline numbers — designed for clarity and ease of use.
                </p>
              </FadeIn>
            </div>
          </div>

          {/* Quick access cards */}
          <FadeIn delay={0.3}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb- 12 mt-4">
              {[
                { href: '/services', label: 'Services Directory', desc: 'Browse and apply for services', icon: 'apps', color: 'text-info', bg: 'bg-info/8' },
                { href: '/track', label: 'Track Application', desc: 'Check status by reference ID', icon: 'track_changes', color: 'text-secondary', bg: 'bg-secondary/8' },
                { href: '/helpline', label: 'Helpline', desc: 'Emergency and department numbers', icon: 'phone_in_talk', color: 'text-success', bg: 'bg-success/8' },
                { href: '/grievance', label: 'Grievance', desc: 'File and track complaints', icon: 'report_problem', color: 'text-error', bg: 'bg-error/8' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="gov-card flex items-start gap-3 group min-h-0"
                >
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0 group-hover:opacity-80 transition-opacity`}>
                    <Icon name={item.icon} size={20} className={item.color} />
                  </div>
                  <div>
                    <span className="block font-semibold text-on-surface mb-0.5">{item.label}</span>
                    <span className="block text-body-sm text-on-surface-variant">{item.desc}</span>
                  </div>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-outline-variant/50 bg-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Services Available', value: '12+', icon: 'apps', color: 'text-info' },
              { label: 'Applications Processed', value: '1,250+', icon: 'task_alt', color: 'text-success' },
              { label: 'Average Processing', value: '3-5 Days', icon: 'schedule', color: 'text-secondary' },
              { label: 'Satisfaction Rate', value: '98%', icon: 'thumb_up', color: 'text-success' },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center">
                  <Icon name={stat.icon} size={24} className={`${stat.color} mx-auto mb-2`} />
                  <p className="text-headline-md font-bold text-on-surface">{stat.value}</p>
                  <p className="text-label-sm text-on-surface-variant mt-0.5">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Digital India banner */}
      <FadeIn>
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-6 px-8 rounded-2xl bg-gradient-to-r from-orange-50 via-white to-green-50 border border-outline-variant/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Emblem_of_India.svg" alt="National Emblem" className="w-14 h-14" />
            <div className="text-center sm:text-left">
              <p className="text-headline-md font-bold text-on-surface">Digital India</p>
              <p className="text-body-sm text-on-surface-variant mt-0.5">Powering Citizen Services Through Technology</p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/digital-india.svg" alt="Digital India Initiative" className="h-12" />
          </div>
        </section>
      </FadeIn>

      {/* Popular services */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-14">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <FadeIn>
            <h2 className="text-headline-lg text-on-surface">Popular Services</h2>
            <p className="text-body-md text-on-surface-variant mt-1">Most used government services by citizens</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Link href="/services" className="text-secondary text-body-sm font-semibold hover:underline min-h-0 flex items-center gap-1 transition-colors">
              View all services
              <Icon name="arrow_forward" size={16} />
            </Link>
          </FadeIn>
        </div>

        {error ? (
          <div className="p-5 bg-error/5 text-error rounded-xl border border-error/20 text-body-sm" role="alert">
            <div className="flex items-start gap-3">
              <Icon name="error" size={20} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Could not load services</p>
                <p className="mt-1">{error}</p>
                <p className="mt-1 text-on-surface-variant">Ensure the backend is running on port 4000.</p>
              </div>
            </div>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularServices.map((service) => (
              <StaggerItem key={service.id}>
                <ServiceCard service={service} compact />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>
    </div>
  );
}
