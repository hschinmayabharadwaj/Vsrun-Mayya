import Link from 'next/link';
import { getHelplines } from '@/lib/portal-api';
import { InfoPageLayout, ContentCard } from '@/components/InfoPageLayout';
import { Icon } from '@/components/Icon';

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
        <div className="p-4 bg-red-50 text-red-800 border border-red-200" role="alert">
          {error}
        </div>
      ) : (
        <>
          <ContentCard title="Emergency Numbers">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {emergency.map((item) => (
                <article key={item.number} className="gov-card text-center">
                  <div className="flex justify-center mb-3">
                    <span className="w-10 h-10 border border-neutral-300 flex items-center justify-center">
                      <Icon name={item.icon ?? 'call'} size={22} className="text-gov-red" />
                    </span>
                  </div>
                  <p className="text-headline-lg font-bold text-gov-link mb-1">{item.number}</p>
                  <p className="text-body-sm font-semibold text-on-surface mb-1">{item.title}</p>
                  {item.description && (
                    <p className="text-body-sm text-on-surface-variant">{item.description}</p>
                  )}
                </article>
              ))}
            </div>
          </ContentCard>

          <ContentCard title="Other Helplines">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {other.map((item) => (
                <li key={item.number} className="flex gap-3 text-body-sm border-b border-neutral-100 pb-2">
                  <span className="font-bold text-gov-link shrink-0 w-14">{item.number}</span>
                  <span className="text-on-surface">{item.title}</span>
                </li>
              ))}
            </ul>
          </ContentCard>

          <p className="text-body-sm text-on-surface-variant">
            For non-emergency queries about this portal, visit the{' '}
            <Link href="/help" className="text-gov-link hover:underline min-h-0">
              Help Center
            </Link>
            .
          </p>
        </>
      )}
    </InfoPageLayout>
  );
}
