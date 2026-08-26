'use client';

import { useState } from 'react';
import { Icon } from '@/components/Icon';

export function PrototypeBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div role="status" className="bg-amber-50 border-b border-amber-200/60">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-2 flex items-center justify-center gap-2 flex-wrap">
        <Icon name="info" size={16} className="text-amber-800" />
        <p className="text-label-sm text-amber-900 text-center">
          <strong>Prototype / Demo</strong> — Not an official Government of India website. All data is synthetic.
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-amber-100 text-amber-800 min-h-0 rounded-md transition-colors"
          aria-label="Dismiss banner"
        >
          <Icon name="close" size={16} />
        </button>
      </div>
    </div>
  );
}
