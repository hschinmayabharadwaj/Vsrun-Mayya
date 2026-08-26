import Link from 'next/link';
import { InfoPageLayout, ContentCard, PageLink } from '@/components/InfoPageLayout';
import { Icon } from '@/components/Icon';
import { getFaqs, getPortalConfig } from '@/lib/portal-api';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/MotionWrappers';

export default async function HelpPage() {
  let faqs: Awaited<ReturnType<typeof getFaqs>> = [];
  let config = null;
  let error: string | null = null;

  try {
    [faqs, config] = await Promise.all([getFaqs(), getPortalConfig()]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load help content';
  }

  return (
    <InfoPageLayout
      title="Help Center"
      description="Find answers, get support, and learn how to use the citizen services portal."
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Help' }]}
    >
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { href: '/track', icon: 'track_changes', label: 'Track Application', desc: 'Check status by ID' },
          { href: '/services', icon: 'apps', label: 'Find a Service', desc: 'Browse all services' },
          { href: '/grievance', icon: 'report_problem', label: 'File Grievance', desc: 'Report an issue' },
        ].map((item) => (
          <StaggerItem key={item.href}>
            <Link href={item.href} className="gov-card text-center block min-h-0 group">
              <div className="w-12 h-12 rounded-xl bg-gov-red/8 flex items-center justify-center mx-auto mb-3 group-hover:bg-gov-red/12 transition-colors">
                <Icon name={item.icon} size={24} className="text-gov-red" />
              </div>
              <span className="block font-semibold text-on-surface">{item.label}</span>
              <span className="block text-body-sm text-on-surface-variant mt-1">{item.desc}</span>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {error ? (
        <div className="p-4 bg-error/5 text-error rounded-xl border border-error/20 text-body-sm" role="alert">
          {error}
        </div>
      ) : (
        <>
          <ContentCard title="Frequently Asked Questions">
            <div className="space-y-5">
              {faqs.map((item) => (
                <div key={item.question} className="border-b border-outline-variant/50 pb-4 last:border-0 last:pb-0">
                  <h3 className="text-body-md font-semibold text-on-surface mb-2">{item.question}</h3>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">{item.answer}</p>
                  {item.link && (
                    <PageLink href={item.link.href}>{item.link.label} &rarr;</PageLink>
                  )}
                </div>
              ))}
            </div>
          </ContentCard>

          {config && (
            <ContentCard title="Contact Support">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-body-sm">
                <div>
                  <p className="font-semibold text-on-surface">Toll-free helpline</p>
                  <p className="text-on-surface-variant">{config.contact.tollFree}</p>
                  <p className="text-on-surface-variant mt-1">{config.contact.hours}</p>
                </div>
                <div>
                  <p className="font-semibold text-on-surface">Email support</p>
                  <p className="text-on-surface-variant">{config.contact.email}</p>
                </div>
              </div>
            </ContentCard>
          )}
        </>
      )}
    </InfoPageLayout>
  );
}
