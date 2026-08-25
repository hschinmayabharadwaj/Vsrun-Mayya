import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { getNotices, getPortalConfig } from '@/lib/portal-api';
import { ServiceCard } from '@/components/ServiceCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
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
    <div className="bg-white">
      {notices.map((notice) => (
        <div key={notice.id} className="bg-neutral-50 border-b border-neutral-200 py-2.5">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <p className="text-body-sm text-on-surface">
              <strong className="text-gov-red">Notice:</strong> {notice.text}{' '}
              <Link href={notice.link} className="text-gov-link font-semibold hover:underline min-h-0">
                {notice.linkLabel} →
              </Link>
            </p>
          </div>
        </div>
      ))}

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-10">
        <Breadcrumbs items={[{ label: 'Home' }]} />

        <h1 className="text-display-lg text-on-surface mb-4">
          {config?.siteName ?? 'Citizen Services Portal'}
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-3xl mb-8 leading-relaxed">
          Access essential citizen services, track applications, file grievances, and find official
          helpline numbers — designed for clarity and ease of use.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { href: '/services', label: 'Services Directory', desc: 'Browse and apply for services' },
            { href: '/track', label: 'Track Application', desc: 'Check status by reference ID' },
            { href: '/helpline', label: 'Helpline', desc: 'Emergency and department numbers' },
            { href: '/grievance', label: 'Grievance', desc: 'File and track complaints' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="gov-card hover:border-gov-red transition-colors block min-h-0"
            >
              <span className="block font-semibold text-on-surface mb-1">{item.label}</span>
              <span className="block text-body-sm text-on-surface-variant">{item.desc}</span>
            </Link>
          ))}
        </div>

        <section>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-headline-md text-on-surface">Popular Services</h2>
            <Link href="/services" className="text-gov-link text-body-sm font-semibold hover:underline min-h-0">
              View all services →
            </Link>
          </div>

          {error ? (
            <div className="p-4 bg-red-50 text-red-800 border border-red-200 text-body-sm" role="alert">
              <p className="font-semibold">Could not load services</p>
              <p className="mt-1">{error}</p>
              <p className="mt-1">Ensure the backend is running on port 4000.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularServices.map((service) => (
                <ServiceCard key={service.id} service={service} compact />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
