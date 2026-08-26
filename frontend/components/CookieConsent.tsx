'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/Icon';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookie-consent');
    if (!accepted) setVisible(true);
  }, []);

  const accept = (choice: 'all' | 'optional-decline') => {
    localStorage.setItem('cookie-consent', choice);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Cookie consent"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[100] bg-surface border-t border-outline-variant shadow-elevated"
        >
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-3">
              <Icon name="cookie" size={20} className="text-secondary mt-0.5 shrink-0" />
              <p className="text-body-sm text-on-surface max-w-3xl leading-relaxed">
                This website uses cookies to provide a better user experience. By clicking accept, you agree to the
                policies outlined in the{' '}
                <a href="/privacy" className="text-secondary font-medium hover:underline">
                  Cookie Settings
                </a>
                .
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={() => accept('optional-decline')}
                className="btn-outline px-4 py-2 text-label-sm min-h-[40px]"
              >
                Customize
              </button>
              <button
                type="button"
                onClick={() => accept('optional-decline')}
                className="btn-outline px-4 py-2 text-label-sm min-h-[40px]"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => accept('all')}
                className="btn-primary px-4 py-2 text-label-sm min-h-[40px]"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
