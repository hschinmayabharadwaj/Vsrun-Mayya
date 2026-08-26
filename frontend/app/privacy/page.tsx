import { InfoPageLayout, ContentCard, PageLink } from '@/components/InfoPageLayout';
import { getPrivacySections, getPortalConfig } from '@/lib/portal-api';

export default async function PrivacyPage() {
  let sections: Awaited<ReturnType<typeof getPrivacySections>> = [];
  let config = null;
  let error: string | null = null;

  try {
    [sections, config] = await Promise.all([getPrivacySections(), getPortalConfig()]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load privacy policy';
  }

  return (
    <InfoPageLayout
      title="Privacy Policy"
      description="How this demo portal handles citizen data and protects your privacy."
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Privacy' }]}
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
          {sections.map((section) => (
            <ContentCard key={section.title} title={section.title}>
              <p className="text-body-md text-on-surface-variant leading-relaxed">{section.body}</p>
            </ContentCard>
          ))}
        </div>
      )}

      <p className="mt-6 text-body-sm text-on-surface-variant">
        Questions? Visit the <PageLink href="/help">Help Center</PageLink> or read our{' '}
        <PageLink href="/terms">Terms of Service</PageLink>.
      </p>
    </InfoPageLayout>
  );
}
