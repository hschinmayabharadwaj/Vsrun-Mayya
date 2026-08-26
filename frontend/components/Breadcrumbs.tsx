import Link from 'next/link';
import { Icon } from '@/components/Icon';

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-body-sm text-on-surface-variant mb-5">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            {i > 0 && <Icon name="chevron_right" size={14} className="text-outline" />}
            {item.href ? (
              <Link href={item.href} className="hover:text-secondary transition-colors min-h-0">
                {item.label}
              </Link>
            ) : (
              <span className="text-on-surface font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
