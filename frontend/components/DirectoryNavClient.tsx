'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
}

export function DirectoryNavClient({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  if (!items.length) return null;

  return (
    <nav aria-label="Directory navigation" className="bg-neutral-50/80 border-b border-outline-variant/50">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-2 flex flex-wrap items-center gap-x-1 gap-y-1">
        <span className="text-label-sm font-semibold text-secondary mr-2">Directory:</span>
        {items.map((item, i) => (
          <span key={item.href} className="flex items-center">
            {i > 0 && (
              <span className="text-outline mx-1" aria-hidden="true">/</span>
            )}
            <Link
              href={item.href}
              className={`text-body-sm py-1 px-1.5 min-h-0 rounded transition-colors ${
                pathname === item.href || pathname.startsWith(item.href + '/')
                  ? 'text-secondary font-semibold bg-secondary/5'
                  : 'text-on-surface-variant hover:text-secondary hover:bg-secondary/5'
              }`}
            >
              {item.label}
            </Link>
          </span>
        ))}
      </div>
    </nav>
  );
}
