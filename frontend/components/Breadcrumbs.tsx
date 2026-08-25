import Link from 'next/link';

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-body-sm text-on-surface-variant mb-4">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true">&gt;</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-gov-link hover:underline min-h-0">
                {item.label}
              </Link>
            ) : (
              <span className="text-on-surface">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
