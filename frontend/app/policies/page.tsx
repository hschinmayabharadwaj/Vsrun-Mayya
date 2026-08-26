import Link from 'next/link';
import { InfoPageLayout, ContentCard, PageLink } from '@/components/InfoPageLayout';
import { Icon } from '@/components/Icon';
import { getPolicies } from '@/lib/portal-api';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/MotionWrappers';

export default async function PoliciesPage() {
  let policies: Awaited<ReturnType<typeof getPolicies>> = [];
  let error: string | null = null;

  try {
    policies = await getPolicies();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load policies';
  }

  return (
    <InfoPageLayout
      title="Official Policies"
      description="Guidelines, frameworks, and standards governing citizen digital services."
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Policies' }]}
    >
      {error ? (
        <div className="p-4 bg-error/5 text-error rounded-xl border border-error/20 text-body-sm" role="alert">
          {error}
        </div>
      ) : (
        <>
          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            {policies.map((policy) => (
              <StaggerItem key={policy.id}>
                <article className="gov-card">
                  <span className="inline-block px-2.5 py-1 bg-secondary/8 text-secondary text-label-sm font-medium rounded-md mb-2">
                    {policy.category}
                  </span>
                  <h2 className="text-body-lg font-semibold text-on-surface mb-2">{policy.title}</h2>
                  <p className="text-body-sm text-on-surface-variant mb-3 leading-relaxed">{policy.summary}</p>
                  <p className="text-label-sm text-on-surface-variant flex items-center gap-1.5">
                    <Icon name="update" size={14} />
                    Last updated: {policy.updated}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <ContentCard title="Related resources">
            <ul className="space-y-2 text-body-sm text-on-surface-variant">
              <li>
                Digital accessibility follows <PageLink href="/help">GIGW guidelines</PageLink> for inclusive access.
              </li>
              <li>
                Data handling is described in the <PageLink href="/privacy">Privacy Policy</PageLink>.
              </li>
              <li>
                Complaints follow the <PageLink href="/grievance">Grievance Redressal</PageLink> framework.
              </li>
            </ul>
          </ContentCard>
        </>
      )}
    </InfoPageLayout>
  );
}
