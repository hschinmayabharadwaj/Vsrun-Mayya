'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import type { PortalConfig } from '@/lib/portal-api';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/Icon';

interface HeaderProps {
  config: PortalConfig;
}

export function Header({ config }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    if (category !== 'all') params.set('category', category);
    router.push(`/services?${params.toString()}`);
  };

  return (
    <header className={clsx(
      'sticky top-0 z-50 transition-all duration-300',
      scrolled ? 'glass shadow-soft' : 'bg-surface'
    )}>
      {/* Utility bar */}
      <div className="border-b border-outline-variant/50 bg-neutral-50/80">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-1.5 flex justify-between items-center text-label-sm text-on-surface-variant">
          <a href="#main-content" className="hover:text-secondary underline min-h-0">
            Skip to main content
          </a>
          <div className="flex items-center gap-4">
            <button type="button" className="min-h-0 px-2 hover:text-secondary transition-colors text-xs font-medium" aria-label="Language">
              EN | HI
            </button>
            <button type="button" className="min-h-0 px-2 hover:text-secondary transition-colors text-xs font-medium" aria-label="Accessibility">
              Accessibility
            </button>
          </div>
        </div>
      </div>

      {/* Brand + Search */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-3 md:py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0 min-h-0 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Citizen Services Portal" className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-soft group-hover:shadow-md transition-shadow" />
            <div>
              <span className="block text-body-md font-bold text-on-surface leading-tight">
                {config.siteName}
              </span>
              <span className="block text-label-sm text-on-surface-variant">{config.siteTagline}</span>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="flex flex-1 max-w-2xl gap-0">
            <div className="relative flex-1">
              <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services..."
                aria-label="Search services"
                className="w-full pl-10 pr-4 py-2.5 text-body-sm border border-outline-variant rounded-l-xl min-h-[44px] focus:ring-0 focus:border-secondary bg-white transition-colors"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Search category"
              className="border-y border-outline-variant px-3 py-2 text-body-sm bg-white min-h-[44px] max-w-[140px] focus:ring-0 focus:border-secondary transition-colors"
            >
              {config.searchCategories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <button type="submit" className="btn-primary rounded-l-none rounded-r-xl px-5 text-label-sm min-h-[44px]">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Primary nav */}
      <nav aria-label="Main navigation" className="border-t border-outline-variant/50 bg-surface/90">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
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
                  'px-4 py-3 text-body-sm font-medium rounded-lg min-h-[44px] flex items-center transition-all',
                  pathname === href
                    ? 'bg-gov-red/8 text-gov-red font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-neutral-100'
                )}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              className="ml-auto btn-primary text-label-sm min-h-[40px] flex items-center gap-2"
            >
              <Icon name="person" size={16} />
              Citizen Login
            </Link>
          </div>

          {/* Mobile nav toggle */}
          <div className="md:hidden flex items-center justify-between py-2">
            <span className="text-body-sm font-medium text-on-surface-variant">Menu</span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-neutral-100 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              aria-label="Toggle menu"
            >
              <Icon name={mobileMenuOpen ? 'close' : 'menu'} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-outline-variant/50"
            >
              <div className="px-margin-mobile py-2 space-y-1">
                {[
                  { href: '/', label: 'Home', icon: 'home' },
                  { href: '/services', label: 'Services', icon: 'apps' },
                  { href: '/dashboard', label: 'My Dashboard', icon: 'dashboard' },
                  { href: '/track', label: 'Track Application', icon: 'track_changes' },
                ].map(({ href, label, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-3 text-body-sm font-medium rounded-lg min-h-[44px] transition-all',
                      pathname === href
                        ? 'bg-gov-red/8 text-gov-red'
                        : 'text-on-surface-variant hover:bg-neutral-50'
                    )}
                  >
                    <Icon name={icon} size={20} />
                    {label}
                  </Link>
                ))}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
                >
                  <Icon name="person" size={16} />
                  Citizen Login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
