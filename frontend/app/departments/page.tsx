import Link from 'next/link';
import { InfoPageLayout, ContentCard } from '@/components/InfoPageLayout';
import { Icon } from '@/components/Icon';
import { apiFetch } from '@/lib/api';
import type { Service } from '@/lib/types';

function groupByDepartment(services: Service[]) {
  const map = new Map<string, Service[]>();
  for (const service of services) {
    const list = map.get(service.department) ?? [];
    list.push(service);
    map.set(service.department, list);
  }
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}

export default async function DepartmentsPage() {
  let departments: [string, Service[]][] = [];
  let error: string | null = null;

  try {
    const services = await apiFetch<Service[]>('/api/services');
    departments = groupByDepartment(services);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load departments';
  }

  return (
    <InfoPageLayout
      title="Government Departments"
      description="Browse official departments and the citizen services they provide."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Directory', href: '/departments' },
        { label: 'Departments' },
      ]}
    >
      {error ? (
        <div className="p-4 bg-red-50 text-red-800 border border-red-200" role="alert">
          <p className="font-semibold">Could not load departments</p>
          <p className="text-body-sm mt-1">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map(([department, services]) => (
            <article key={department} className="gov-card">
              <div className="flex items-start gap-3 mb-4">
                <Icon name="account_balance" size={28} className="text-gov-red shrink-0" />
                <div>
                  <h2 className="text-body-lg font-semibold text-on-surface">{department}</h2>
                  <p className="text-label-sm text-on-surface-variant">
                    {services.length} service{services.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>
              <ul className="space-y-1 mb-4 text-body-sm text-on-surface-variant">
                {services.slice(0, 4).map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
                {services.length > 4 && (
                  <li className="text-gov-link">+{services.length - 4} more</li>
                )}
              </ul>
              <Link
                href={`/services?search=${encodeURIComponent(department.split(' ')[0])}`}
                className="text-gov-link text-body-sm font-semibold hover:underline min-h-0"
              >
                View services →
              </Link>
            </article>
          ))}
        </div>
      )}

      <ContentCard title="Need a specific department?" className="mt-8">
        <p className="text-body-md text-on-surface-variant mb-4">
          Use the Services Directory to search across all departments, or contact the help center.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/services" className="btn-primary px-5 py-2.5 inline-flex items-center gap-2 min-h-[44px]">
            All Services
          </Link>
          <Link href="/help" className="btn-outline px-5 py-2.5 inline-flex items-center gap-2 min-h-[44px]">
            Help Center
          </Link>
        </div>
      </ContentCard>
    </InfoPageLayout>
  );
}
