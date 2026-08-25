import Link from 'next/link';
import { Icon } from './Icon';
import type { Service } from '@/lib/types';

export function ServiceCard({ service, compact = false }: { service: Service; compact?: boolean }) {
  return (
    <article className="gov-card flex flex-col h-full relative">
      <div className="flex items-start gap-3 mb-3">
        <Icon name={service.icon} filled size={22} className="text-gov-red shrink-0 mt-0.5" />
        <h3 className="text-body-md font-semibold text-on-surface leading-snug">{service.name}</h3>
      </div>
      <p className="text-body-sm text-on-surface-variant flex-grow mb-4 leading-relaxed">{service.description}</p>
      <div className="flex items-center justify-between border-t border-neutral-200 pt-3 mt-auto text-body-sm">
        <span className="text-on-surface-variant flex items-center gap-1">
          <Icon name="schedule" size={14} />
          {service.processingDays}
        </span>
        {service.onlineAvailable ? (
          <Link
            href={`/apply/${service.slug}`}
            className="text-gov-link font-semibold hover:underline min-h-0 after:absolute after:inset-0"
          >
            Apply →
          </Link>
        ) : (
          <span className="text-on-surface-variant text-label-sm">In-Person Only</span>
        )}
      </div>
      {!compact && (
        <p className="text-label-sm text-on-surface-variant mt-2">{service.department}</p>
      )}
    </article>
  );
}

export function ServiceDirectoryCard({ service }: { service: Service }) {
  return (
    <article className="gov-card flex flex-col h-full">
      <div className="flex justify-between items-start mb-3 gap-3">
        <div>
          <span className="inline-block px-2 py-0.5 bg-neutral-100 text-label-sm text-on-surface-variant mb-2">
            {service.category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
          <h3 className="text-body-lg font-semibold text-on-surface">{service.name}</h3>
          <p className="text-body-sm text-on-surface-variant mt-1">{service.department}</p>
        </div>
        <span className="text-label-sm px-2 py-1 border border-neutral-300 whitespace-nowrap">
          {service.onlineAvailable ? 'Online' : 'In-Person'}
        </span>
      </div>
      <div className="mb-4 space-y-2 text-body-sm text-on-surface-variant">
        <p>
          <strong className="text-on-surface">Processing:</strong> {service.processingDays}
        </p>
        <p>
          <strong className="text-on-surface">Documents:</strong> {service.requiredDocuments.join(', ')}
        </p>
      </div>
      <div className="mt-auto pt-3 border-t border-neutral-200 flex justify-end">
        {service.onlineAvailable ? (
          <Link href={`/apply/${service.slug}`} className="btn-primary px-5 py-2 min-h-[44px]">
            Apply Online
          </Link>
        ) : (
          <button type="button" className="btn-outline px-5 py-2 min-h-[44px]">
            Book Appointment
          </button>
        )}
      </div>
    </article>
  );
}
