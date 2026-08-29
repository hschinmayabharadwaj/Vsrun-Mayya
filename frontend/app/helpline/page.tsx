import Link from 'next/link';
import { getHelplines } from '@/lib/portal-api';
import { InfoPageLayout, ContentCard } from '@/components/InfoPageLayout';
import { Icon } from '@/components/Icon';
import { StaggerContainer, StaggerItem } from '@/components/MotionWrappers';

export default async function HelplinePage() {
  let emergency: Awaited<ReturnType<typeof getHelplines>>['emergency'] = [];
  let other: Awaited<ReturnType<typeof getHelplines>>['other'] = [];
  let error: string | null = null;

  try {
    const data = await getHelplines();
    emergency = data.emergency;
    other = data.other;
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load helplines';
  }

  return (
    <InfoPageLayout
      title="Helpline"
      description="Helplines are dedicated telephone numbers for specific purposes. They provide access to medical aid, law enforcement, fire emergencies, and other essential services."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Directory', href: '/departments' },
        { label: 'Helpline' },
      ]}
    >
      {error ? (
        <div className="p-4 bg-error/5 text-error rounded-xl border border-error/20 text-body-sm" role="alert">
          {error}
        </div>
      ) : (
        <>
          <ContentCard title="Emergency Numbers">
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {emergency.map((item) => (
                <StaggerItem key={item.number}>
                  <article className="gov-card text-center group">
                    <div className="flex justify-center mb-3">
                      <span className="w-12 h-12 rounded-xl bg-success/8 flex items-center justify-center group-hover:bg-success/12 transition-colors">
                        <Icon name={item.icon ?? 'call'} size={22} className="text-success" />
                      </span>
                    </div>
                    <p className="text-headline-lg font-bold text-success mb-1">{item.number}</p>
                    <p className="text-body-sm font-semibold text-on-surface mb-1">{item.title}</p>
                    {item.description && (
                      <p className="text-body-sm text-on-surface-variant">{item.description}</p>
                    )}
                  </article>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </ContentCard>

          <ContentCard title="Other Helplines">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {other.map((item) => (
                <li key={item.number} className="flex gap-3 text-body-sm border-b border-outline-variant/50 pb-3">
                  <span className="font-bold text-secondary shrink-0 w-14">{item.number}</span>
                  <span className="text-on-surface">{item.title}</span>
                </li>
              ))}
            </ul>
          </ContentCard>

          <p className="text-body-sm text-on-surface-variant">
            For non-emergency queries about this portal, visit the{' '}
            <Link href="/help" className="text-secondary hover:underline min-h-0 font-medium">
              Help Center
            </Link>
            .
          </p>
        </>
      )}
    </InfoPageLayout>
  );
}
