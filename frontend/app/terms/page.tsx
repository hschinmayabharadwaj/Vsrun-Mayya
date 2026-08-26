import { InfoPageLayout, ContentCard, PageLink } from '@/components/InfoPageLayout';
import { getTermsSections, getPortalConfig } from '@/lib/portal-api';

export default async function TermsPage() {
  let sections: Awaited<ReturnType<typeof getTermsSections>> = [];
  let config = null;
  let error: string | null = null;

  try {
    [sections, config] = await Promise.all([getTermsSections(), getPortalConfig()]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load terms';
  }

  return (
    <InfoPageLayout
      title="Terms of Service"
      description="Terms and conditions for using the Citizen Services demo portal."
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Terms' }]}
    >
      {config && (
        <div className="mb-6 p-4 bg-warning/10 border border-warning/20 text-on-surface rounded-xl text-body-sm">
          <strong>Prototype notice:</strong> {config.prototypeNotice}
        </div>
      )}

      {error ? (
        <div className="p-4 bg-error/5 text-error rounded-xl border border-error/20 text-body-sm" role="alert">
          {error}
        </div>
      ) : (
        <div className="space-y-0">
          {sections.map((section, i) => (
            <ContentCard key={section.title} title={`${i + 1}. ${section.title}`}>
              <p className="text-body-md text-on-surface-variant leading-relaxed">{section.body}</p>
            </ContentCard>
          ))}
        </div>
      )}

      <p className="mt-6 text-body-sm text-on-surface-variant">
        See also our <PageLink href="/privacy">Privacy Policy</PageLink> and{' '}
        <PageLink href="/policies">Official Policies</PageLink>.
      </p>
    </InfoPageLayout>
  );
}
