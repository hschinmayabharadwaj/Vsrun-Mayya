'use client';

import { useState } from 'react';

export function PrototypeBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div role="status" className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-2 flex items-center justify-center gap-2 flex-wrap">
        <span className="material-symbols-outlined text-[16px] text-amber-800" aria-hidden="true">
          info
        </span>
        <p className="text-label-sm text-amber-900 text-center">
          <strong>Prototype / Demo</strong> — Not an official Government of India website. All data is synthetic.
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-amber-100 text-amber-800 min-h-0 rounded"
          aria-label="Dismiss banner"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  );
}
