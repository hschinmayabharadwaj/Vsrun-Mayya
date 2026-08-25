'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useState } from 'react';
import type { PortalConfig } from '@/lib/portal-api';

interface HeaderProps {
  config: PortalConfig;
}

export function Header({ config }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    if (category !== 'all') params.set('category', category);
    router.push(`/services?${params.toString()}`);
  };

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      {/* Utility row */}
      <div className="border-b border-neutral-100 bg-neutral-50">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-1 flex justify-between items-center text-label-sm text-on-surface-variant">
          <a href="#main-content" className="hover:text-gov-link underline min-h-0">
            Skip to main content
          </a>
          <div className="flex items-center gap-3">
            <button type="button" className="min-h-0 px-1 hover:text-gov-link" aria-label="Language">
              A / अ
            </button>
            <button type="button" className="min-h-0 px-1 hover:text-gov-link" aria-label="Accessibility">
              Accessibility
            </button>
          </div>
        </div>
      </div>

      {/* Brand + search */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0 min-h-0">
            <div className="w-12 h-12 border border-neutral-300 flex items-center justify-center bg-neutral-50 text-gov-red font-bold text-lg">
              🇮🇳
            </div>
            <div>
              <span className="block text-body-md font-bold text-on-surface leading-tight">
                {config.siteName}
              </span>
              <span className="block text-label-sm text-on-surface-variant">{config.siteTagline}</span>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="flex flex-1 max-w-2xl gap-0 border border-neutral-300">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Here"
              aria-label="Search services"
              className="flex-1 px-3 py-2 text-body-sm border-0 min-h-[44px] focus:ring-0"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Search category"
              className="border-l border-neutral-300 px-2 py-2 text-body-sm bg-white min-h-[44px] max-w-[140px]"
            >
              {config.searchCategories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <button type="submit" className="gov-btn-primary px-5 py-2 text-label-sm min-h-[44px] rounded-none">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Primary nav */}
      <nav aria-label="Main navigation" className="border-t border-neutral-200 bg-white">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-wrap gap-1">
          {[
            { href: '/', label: 'Home' },
            { href: '/services', label: 'Services' },
            { href: '/dashboard', label: 'My Dashboard' },
            { href: '/track', label: 'Track Application' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'px-4 py-3 text-body-sm font-medium border-b-2 min-h-[44px] flex items-center',
                pathname === href
                  ? 'border-gov-red text-gov-red'
                  : 'border-transparent text-on-surface hover:text-gov-red hover:border-neutral-300'
              )}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="ml-auto hidden md:flex items-center px-4 py-2 my-1 gov-btn-primary text-label-sm min-h-[40px]"
          >
            Citizen Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
