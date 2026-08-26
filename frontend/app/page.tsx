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
      {/* Notice bar */}
      {notices.map((notice) => (
        <div key={notice.id} className="bg-secondary/5 border-b border-secondary/10">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-2.5">
            <p className="text-body-sm text-on-surface">
              <strong className="text-secondary">Notice:</strong> {notice.text}{' '}
              <Link href={notice.link} className="text-secondary font-semibold hover:underline min-h-0">
                {notice.linkLabel} &rarr;
              </Link>
            </p>
          </div>
        </div>
      ))}

      {/* Hero section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-[0.03]" />
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20">
          <FadeIn>
            <Breadcrumbs items={[{ label: 'Home' }]} />
          </FadeIn>

          <div className="max-w-3xl">
            <FadeIn delay={0.1}>
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

          {/* Quick access cards */}
          <FadeIn delay={0.3}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {[
                { href: '/services', label: 'Services Directory', desc: 'Browse and apply for services', icon: 'apps' },
                { href: '/track', label: 'Track Application', desc: 'Check status by reference ID', icon: 'track_changes' },
                { href: '/helpline', label: 'Helpline', desc: 'Emergency and department numbers', icon: 'phone_in_talk' },
                { href: '/grievance', label: 'Grievance', desc: 'File and track complaints', icon: 'report_problem' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="gov-card flex items-start gap-3 group min-h-0"
                >
                  <div className="w-10 h-10 rounded-xl bg-gov-red/8 flex items-center justify-center shrink-0 group-hover:bg-gov-red/12 transition-colors">
                    <Icon name={item.icon} size={20} className="text-gov-red" />
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
              { label: 'Services Available', value: '12+', icon: 'apps' },
              { label: 'Applications Processed', value: '1,250+', icon: 'task_alt' },
              { label: 'Average Processing', value: '3-5 Days', icon: 'schedule' },
              { label: 'Satisfaction Rate', value: '98%', icon: 'thumb_up' },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center">
                  <Icon name={stat.icon} size={24} className="text-secondary mx-auto mb-2" />
                  <p className="text-headline-md font-bold text-on-surface">{stat.value}</p>
                  <p className="text-label-sm text-on-surface-variant mt-0.5">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

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
