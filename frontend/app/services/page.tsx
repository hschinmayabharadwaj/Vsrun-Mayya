'use client';

import { Suspense } from 'react';
import ServicesContent from './ServicesContent';

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="p-xxl skeleton h-96 max-w-container-max mx-auto rounded" />}>
      <ServicesContent />
    </Suspense>
  );
}
