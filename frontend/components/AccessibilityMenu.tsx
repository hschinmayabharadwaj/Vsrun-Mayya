'use client';

import { useState, useRef, useEffect } from 'react';
import { Icon } from '@/components/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface A11yOption {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
}

const DEFAULT_OPTIONS: A11yOption[] = [
  { id: 'high-contrast', label: 'High Contrast', icon: 'contrast', enabled: false },
  { id: 'large-text', label: 'Large Text', icon: 'text_increase', enabled: false },
  { id: 'reduce-motion', label: 'Reduce Motion', icon: 'animation', enabled: false },
  { id: 'screen-reader', label: 'Screen Reader Hints', icon: 'record_voice_over', enabled: false },
  { id: 'keyboard-nav', label: 'Keyboard Navigation', icon: 'keyboard', enabled: false },
  { id: 'dark-mode', label: 'Dark Mode', icon: 'dark_mode', enabled: false },
];

export function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<A11yOption[]>(DEFAULT_OPTIONS);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('a11y-options');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Record<string, boolean>;
        setOptions((prev) =>
          prev.map((o) => ({ ...o, enabled: parsed[o.id] ?? o.enabled }))
        );
      } catch {}
    }
  }, []);

  useEffect(() => {
    const map: Record<string, boolean> = {};
    options.forEach((o) => (map[o.id] = o.enabled));
    localStorage.setItem('a11y-options', JSON.stringify(map));

    // Apply to document
    const root = document.documentElement;
    root.classList.toggle('a11y-high-contrast', options.find((o) => o.id === 'high-contrast')?.enabled ?? false);
    root.classList.toggle('a11y-large-text', options.find((o) => o.id === 'large-text')?.enabled ?? false);
    root.classList.toggle('a11y-reduce-motion', options.find((o) => o.id === 'reduce-motion')?.enabled ?? false);
    root.classList.toggle('a11y-dark-mode', options.find((o) => o.id === 'dark-mode')?.enabled ?? false);
  }, [options]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggle = (id: string) => {
    setOptions((prev) =>
      prev.map((o) => (o.id === id ? { ...o, enabled: !o.enabled } : o))
    );
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="min-h-0 p-1 hover:text-secondary transition-colors rounded-md"
        aria-label="Accessibility options"
        aria-expanded={open}
      >
        <Icon name="person_standing" size={16} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 bg-white border border-outline-variant rounded-xl shadow-elevated z-50 py-2"
          >
            <p className="px-4 py-2 text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold border-b border-outline-variant/50">
              Accessibility
            </p>
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggle(opt.id)}
                className={clsx(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-body-sm transition-colors text-left min-h-[44px]',
                  opt.enabled
                    ? 'text-secondary bg-secondary/5'
                    : 'text-on-surface hover:bg-neutral-50'
                )}
              >
                <Icon name={opt.icon} size={18} className={opt.enabled ? 'text-secondary' : 'text-on-surface-variant'} />
                <span className="flex-1">{opt.label}</span>
                <div
                  className={clsx(
                    'w-9 h-5 rounded-full transition-colors relative',
                    opt.enabled ? 'bg-secondary' : 'bg-outline-variant'
                  )}
                >
                  <div
                    className={clsx(
                      'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform',
                      opt.enabled ? 'translate-x-4' : 'translate-x-0.5'
                    )}
                  />
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
