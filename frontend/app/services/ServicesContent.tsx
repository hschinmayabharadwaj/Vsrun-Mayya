'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { ServiceDirectoryCard } from '@/components/ServiceCard';
import { Icon } from '@/components/Icon';
import type { Service, ServiceCategory } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/types';

const CATEGORIES: { id: ServiceCategory | 'all'; icon: string; color: string }[] = [
  { id: 'all', icon: 'badge', color: '#2563eb' },
  { id: 'identity_civil', icon: 'fingerprint', color: '#2563eb' },
  { id: 'education_skills', icon: 'school', color: '#7c3aed' },
  { id: 'health_welfare', icon: 'local_hospital', color: '#059669' },
  { id: 'business_trade', icon: 'storefront', color: '#d97706' },
  { id: 'housing_land', icon: 'home_work', color: '#dc2626' },
];

export default function ServicesContent() {
  const searchParams = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('all');
  const [onlineOnly, setOnlineOnly] = useState(true);
  const search = searchParams.get('search') || '';

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (category !== 'all') params.set('category', category);
        if (onlineOnly) params.set('onlineOnly', 'true');
        if (search) params.set('search', search);
        const data = await apiFetch<Service[]>(`/api/services?${params}`);
        setServices(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category, onlineOnly, search]);

  return (
    <div className="max-w-container-max mx-auto w-full flex flex-col md:flex-row min-h-[60vh]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col py-6 px-4 w-72 bg-white border-r border-slate-100 shrink-0">
        <h2 className="text-headline-md font-display text-primary mb-6 px-3 flex items-center gap-2">
          <div className="w-1 h-6 rounded-full gradient-accent" />
          Filter Services
        </h2>
        <div className="mb-8">
          <h3 className="text-label-sm text-on-surface-variant mb-3 px-3 uppercase tracking-wider font-semibold">
            Categories
          </h3>
          <nav className="flex flex-col gap-1">
            {CATEGORIES.map(({ id, icon, color }) => (
              <button
                key={id}
                type="button"
                onClick={() => setCategory(id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left min-h-[44px] ${
                  category === id
                    ? 'bg-blue-50 text-secondary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-slate-50'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
                  style={{
                    background: category === id ? `${color}15` : '#f8fafc',
                  }}
                >
                  <Icon name={icon} filled={category === id} size={18} />
                </div>
                <span className="text-[13px] font-medium">{id === 'all' ? 'All Services' : CATEGORY_LABELS[id]}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="px-3">
          <h3 className="text-label-sm text-on-surface-variant mb-3 uppercase tracking-wider font-semibold">
            Availability
          </h3>
          <label className="flex items-center gap-3 cursor-pointer min-h-[44px] group">
            <div className="relative">
              <input
                type="checkbox"
                checked={onlineOnly}
                onChange={(e) => setOnlineOnly(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-10 h-6 bg-slate-200 rounded-full peer-checked:bg-secondary transition-colors" />
              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all peer-checked:translate-x-4" />
            </div>
            <span className="text-body-sm text-on-surface group-hover:text-primary transition-colors">Available Online</span>
          </label>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-5 md:p-8 bg-slate-50/50">
        <div className="mb-8">
          <h1 className="text-headline-lg font-display text-primary mb-1">Services Directory</h1>
          <p className="text-body-lg text-on-surface-variant">
            Browse and apply for official government services online.
            {search && <span className="block mt-1 text-secondary font-medium">Showing results for &ldquo;{search}&rdquo;</span>}
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-64 rounded-xl" />
            ))}
          </div>
        )}

        {error && (
          <div className="p-5 bg-red-50 text-red-800 rounded-xl border border-red-200/60 flex items-start gap-3" role="alert">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <Icon name="error" size={20} className="text-red-600" />
            </div>
            <div>
              <p className="font-semibold">Unable to load services</p>
              <p className="text-body-sm mt-1 text-red-600">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-3 btn-primary px-5 py-2 min-h-[40px]"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && services.length === 0 && (
          <div className="text-center py-16 px-8 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <Icon name="search_off" className="text-on-surface-variant" size={32} />
            </div>
            <p className="text-body-lg text-on-surface-variant font-medium">No services match your filters.</p>
            <p className="text-body-sm text-on-surface-variant mt-1">Try adjusting your search or filters.</p>
          </div>
        )}

        {!loading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {services.map((service, i) => (
              <div key={service.id} className={`animate-fade-in stagger-${Math.min(i + 1, 6)}`}>
                <ServiceDirectoryCard service={service} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
