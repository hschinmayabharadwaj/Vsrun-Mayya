'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useState, useRef, useEffect } from 'react';
import type { PortalConfig } from '@/lib/portal-api';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { useAuth } from '@/components/Providers';
import { AccessibilityMenu } from '@/components/AccessibilityMenu';
import { FloatingPillNavigation } from '@/components/FloatingPillNavigation';

interface HeaderProps {
  config: PortalConfig;
  notices?: { id: string; text: string; link: string; linkLabel: string }[];
}

const SEARCH_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'certificates', label: 'Certificates' },
  { value: 'licenses', label: 'Licenses & Permits' },
  { value: 'welfare', label: 'Welfare Schemes' },
  { value: 'tax', label: 'Tax & Revenue' },
  { value: 'land', label: 'Land Records' },
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Health' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'social', label: 'Social Security' },
  { value: 'business', label: 'Business & Industry' },
  { value: 'transport', label: 'Transport' },
];

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/dashboard', label: 'My Dashboard' },
  { href: '/track', label: 'Track Application' },
];

export function Header({ config, notices = [] }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { loggedIn, toggle } = useAuth();
  const [query, setQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const [catOpen, setCatOpen] = useState(false);
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set(['all']));
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleCat = (val: string) => {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (val === 'all') return new Set(['all']);
      next.delete('all');
      if (next.has(val)) {
        next.delete(val);
        if (next.size === 0) next.add('all');
      } else {
        next.add(val);
      }
      return next;
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    if (!selectedCats.has('all')) params.set('category', Array.from(selectedCats).join(','));
    router.push(`/services?${params.toString()}`);
  };

  const handleLoginClick = () => {
    if (!loggedIn) toggle();
    router.push('/dashboard');
  };

  const selectedLabel = selectedCats.has('all') ? 'All' : `${selectedCats.size} selected`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-outline-variant/50">
      {/* Utility bar */}
      <div className="border-b border-outline-variant/50 bg-neutral-50">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-1.5 flex items-center text-label-sm text-on-surface-variant">
          <a href="#main-content" className="hover:text-secondary underline min-h-0 shrink-0">
            Skip to main content
          </a>

          {notices.length > 0 && (
            <div className="flex-1 mx-4 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap">
                {notices.map((n, i) => (
                  <span key={n.id} className="inline-flex items-center gap-2 mx-8">
                    <Icon name="info" size={14} className="text-info shrink-0" />
                    <span className="text-on-surface">{n.text}</span>
                    <Link href={n.link} className="text-secondary font-semibold hover:underline min-h-0">
                      {n.linkLabel} →
                    </Link>
                    {i < notices.length - 1 && <span className="text-outline-variant mx-4">|</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/indian-flag.svg" alt="Indian Flag" className="w-6 h-4 rounded-sm" />
            <div className="flex items-center gap-1 text-xs font-medium">
              {(['EN', 'HI'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={clsx(
                    'px-1.5 py-0.5 rounded transition-colors min-h-0',
                    lang === l ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-on-surface'
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
            <AccessibilityMenu />
          </div>
        </div>
      </div>

      {/* Main header: brand | nav (center) | search + login (right) */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-3">
        <div className="flex items-center gap-4">
          {/* Brand: emblem | logo | name */}
          <Link href="/" className="flex items-center gap-2 shrink-0 min-h-0 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Emblem_of_India.svg" alt="National Emblem" className="w-9 h-9 md:w-10 md:h-10" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.webp" alt="Portal Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-lg" />
            <div className="hidden sm:block">
              <span className="block text-body-sm font-bold text-on-surface leading-tight">{config.siteName}</span>
              <span className="block text-label-sm text-on-surface-variant">Government of India</span>
            </div>
          </Link>

          {/* Desktop nav — floating pill, centered */}
          <div className="hidden lg:flex items-center justify-center mx-auto">
            <FloatingPillNavigation items={NAV_ITEMS} />
          </div>

          {/* Right side: search + login */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search bar: input left, chevron right, dropdown below */}
            <div className="hidden md:block relative" ref={catRef}>
              <form onSubmit={handleSearch} className="flex items-center border border-outline-variant rounded-xl bg-white overflow-visible">
                <Icon name="search" size={16} className="ml-3 text-on-surface-variant shrink-0" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search services..."
                  aria-label="Search services"
                  className="w-36 lg:w-48 px-2 py-2 text-body-sm bg-transparent min-h-[40px] border-none outline-none"
                  style={{ boxShadow: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setCatOpen(!catOpen)}
                  className="flex items-center gap-1 px-2 py-2 text-label-sm text-on-surface-variant hover:bg-neutral-50 transition-colors border-l border-outline-variant/50 min-h-[40px] rounded-r-xl"
                  aria-label="Select category"
                >
                  <Icon name="expand_more" size={16} className={clsx('transition-transform', catOpen && 'rotate-180')} />
                </button>
              </form>

              {/* Dropdown below search bar */}
              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-1 w-64 bg-white border border-outline-variant rounded-xl shadow-elevated z-50 py-2 max-h-72 overflow-y-auto"
                  >
                    {SEARCH_CATEGORIES.map((cat) => (
                      <label
                        key={cat.value}
                        className="flex items-center gap-2.5 px-3 py-2 text-body-sm text-on-surface hover:bg-neutral-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCats.has(cat.value)}
                          onChange={() => toggleCat(cat.value)}
                          className="w-4 h-4 rounded border-outline-variant accent-[var(--color-accent,#FF6D00)]"
                        />
                        {cat.label}
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Login icon */}
            <button
              type="button"
              onClick={handleLoginClick}
              className="p-2 rounded-xl hover:bg-neutral-100 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label={loggedIn ? 'Go to dashboard' : 'Login'}
            >
              {loggedIn ? (
                <Icon name="person" size={20} className="text-secondary" />
              ) : (
                <Icon name="login" size={20} className="text-on-surface-variant" />
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
              aria-label="Toggle menu"
            >
              <Icon name={mobileMenuOpen ? 'close' : 'menu'} size={22} />
            </button>
          </div>
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
            className="lg:hidden overflow-hidden border-t border-outline-variant/50"
          >
            <div className="px-margin-mobile py-2 space-y-1">
              {NAV_ITEMS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 text-body-sm font-medium rounded-lg min-h-[44px] transition-all',
                    pathname === href
                      ? 'bg-secondary/8 text-secondary font-semibold'
                      : 'text-on-surface hover:bg-neutral-50'
                  )}
                >
                  {label}
                </Link>
              ))}
              <form onSubmit={(e) => { handleSearch(e); setMobileMenuOpen(false); }} className="flex items-center gap-2 pt-2">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search services..."
                  className="flex-1 px-3 py-2 text-body-sm border border-outline-variant rounded-xl min-h-[44px]"
                />
                <button type="submit" className="btn-primary px-4 py-2 min-h-[44px]">Search</button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
