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
    <nav aria-label="Directory navigation" className="bg-white border-b border-neutral-200">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-2 flex flex-wrap items-center gap-x-1 gap-y-1">
        <span className="text-label-sm font-semibold text-gov-red mr-2">Directory:</span>
        {items.map((item, i) => (
          <span key={item.href} className="flex items-center">
            {i > 0 && (
              <span className="text-neutral-400 mx-1" aria-hidden="true">
                |
              </span>
            )}
            <Link
              href={item.href}
              className={`text-body-sm py-1 px-1 min-h-0 ${
                pathname === item.href || pathname.startsWith(item.href + '/')
                  ? 'text-gov-red font-semibold underline underline-offset-4'
                  : 'text-on-surface hover:text-gov-red hover:underline'
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
