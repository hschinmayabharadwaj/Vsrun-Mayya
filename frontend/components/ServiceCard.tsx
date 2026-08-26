import Link from 'next/link';
import { Icon } from './Icon';
import type { Service } from '@/lib/types';

export function ServiceCard({ service, compact = false }: { service: Service; compact?: boolean }) {
  return (
    <article className="gov-card flex flex-col h-full relative group">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gov-red/8 flex items-center justify-center shrink-0 group-hover:bg-gov-red/12 transition-colors">
          <Icon name={service.icon} filled size={20} className="text-gov-red" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-body-md font-semibold text-on-surface leading-snug">{service.name}</h3>
          <p className="text-label-sm text-on-surface-variant mt-0.5">{service.department}</p>
        </div>
      </div>
      <p className="text-body-sm text-on-surface-variant flex-grow mb-4 leading-relaxed">{service.description}</p>
      <div className="flex items-center justify-between border-t border-outline-variant/50 pt-3 mt-auto text-body-sm">
        <span className="text-on-surface-variant flex items-center gap-1.5 text-label-sm">
          <Icon name="schedule" size={14} />
          {service.processingDays}
        </span>
        {service.onlineAvailable ? (
          <Link
            href={`/apply/${service.slug}`}
            className="text-secondary font-semibold hover:underline min-h-0 after:absolute after:inset-0 flex items-center gap-1 transition-colors"
          >
            Apply
            <Icon name="arrow_forward" size={14} />
          </Link>
        ) : (
          <span className="text-on-surface-variant text-label-sm flex items-center gap-1">
            <Icon name="location_on" size={14} />
            In-Person Only
          </span>
        )}
      </div>
    </article>
  );
}

export function ServiceDirectoryCard({ service }: { service: Service }) {
  return (
    <article className="gov-card flex flex-col h-full group">
      <div className="flex justify-between items-start mb-3 gap-3">
        <div className="flex-1">
          <span className="inline-block px-2.5 py-1 bg-secondary/8 text-secondary text-label-sm font-medium rounded-md mb-2">
            {service.category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
          <h3 className="text-body-lg font-semibold text-on-surface">{service.name}</h3>
          <p className="text-body-sm text-on-surface-variant mt-1">{service.department}</p>
        </div>
        <span className="text-label-sm px-2.5 py-1 border border-outline-variant rounded-lg whitespace-nowrap text-on-surface-variant">
          {service.onlineAvailable ? 'Online' : 'In-Person'}
        </span>
      </div>
      <div className="mb-4 space-y-2 text-body-sm text-on-surface-variant">
        <p className="flex items-center gap-2">
          <Icon name="schedule" size={14} className="text-outline shrink-0" />
          <strong className="text-on-surface">Processing:</strong> {service.processingDays}
        </p>
        <p className="flex items-start gap-2">
          <Icon name="description" size={14} className="text-outline shrink-0 mt-0.5" />
          <span><strong className="text-on-surface">Documents:</strong> {service.requiredDocuments.join(', ')}</span>
        </p>
      </div>
      <div className="mt-auto pt-3 border-t border-outline-variant/50 flex justify-end">
        {service.onlineAvailable ? (
          <Link href={`/apply/${service.slug}`} className="btn-primary px-5 py-2 min-h-[44px] flex items-center gap-2">
            Apply Online
            <Icon name="arrow_forward" size={16} className="text-white/80" />
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
