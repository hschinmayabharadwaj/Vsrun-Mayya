'use client';

import { useEffect, useState } from 'react';

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

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-neutral-300 shadow-lg"
    >
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <p className="text-body-sm text-on-surface max-w-3xl leading-relaxed">
          This website uses cookies to provide a better user experience. By clicking accept, you agree to the
          policies outlined in the{' '}
          <a href="/privacy" className="text-gov-link underline">
            Cookie Settings
          </a>
          .
        </p>
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={() => accept('optional-decline')}
            className="gov-btn-outline px-4 py-2 text-label-sm uppercase tracking-wide min-h-[44px]"
          >
            Customize Cookies
          </button>
          <button
            type="button"
            onClick={() => accept('optional-decline')}
            className="gov-btn-outline px-4 py-2 text-label-sm uppercase tracking-wide min-h-[44px]"
          >
            Decline Optional Cookies
          </button>
          <button
            type="button"
            onClick={() => accept('all')}
            className="gov-btn-primary px-4 py-2 text-label-sm uppercase tracking-wide min-h-[44px]"
          >
            Accept All Cookies
          </button>
        </div>
      </div>
    </div>
  );
}
