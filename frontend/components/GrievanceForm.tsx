'use client';

import { useState } from 'react';
import Link from 'next/link';
import { InfoPageLayout, ContentCard } from '@/components/InfoPageLayout';
import { Icon } from '@/components/Icon';
import { API_URL } from '@/lib/api';

interface GrievanceFormProps {
  categories: string[];
}

export function GrievanceForm({ categories }: GrievanceFormProps) {
  const [form, setForm] = useState({
    category: '',
    subject: '',
    description: '',
    name: '',
    email: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.subject.trim() || !form.description.trim()) {
      setError('Please fill in category, subject, and description.');
      return;
    }
    if (form.description.length < 20) {
      setError('Description must be at least 20 characters.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/grievances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Submission failed');
      setReferenceId(json.data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit grievance');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses = 'w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface text-body-md min-h-[48px] focus:bg-white transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/10';

  if (referenceId) {
    return (
      <InfoPageLayout
        title="Grievance Submitted"
        description="Your complaint has been registered. Save your reference number to track progress."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Grievance', href: '/grievance' },
          { label: 'Submitted' },
        ]}
      >
        <div className="max-w-xl gov-card text-center mx-auto">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <Icon name="check_circle" filled size={36} className="text-success" />
          </div>
          <p className="text-body-md text-on-surface-variant mb-2">Your grievance reference ID is</p>
          <p className="text-headline-md font-mono font-bold text-on-surface mb-6">{referenceId}</p>
          <p className="text-body-sm text-on-surface-variant mb-6">
            You will receive updates within 7 working days.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/track" className="btn-primary px-6 py-3 inline-flex items-center justify-center gap-2">
              <Icon name="track_changes" size={18} className="text-white/80" />
              Track Status
            </Link>
            <Link href="/help" className="btn-outline px-6 py-3 inline-flex items-center justify-center">
              Help Center
            </Link>
          </div>
        </div>
      </InfoPageLayout>
    );
  }

  return (
    <InfoPageLayout
      title="Grievance Redressal"
      description="File a complaint about service delivery, portal issues, or departmental conduct."
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Grievance' }]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ContentCard title="File a Grievance">
            {error && (
              <div className="mb-4 p-4 bg-error/5 text-error rounded-xl text-body-sm flex items-center gap-2 border border-error/20" role="alert">
                <Icon name="error" size={18} />
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="category" className="block text-label-md text-on-surface mb-1.5">Category *</label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => update('category', e.target.value)}
                  className={inputClasses}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="subject" className="block text-label-md text-on-surface mb-1.5">Subject *</label>
                <input
                  id="subject"
                  value={form.subject}
                  onChange={(e) => update('subject', e.target.value)}
                  placeholder="Brief summary of your grievance"
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-label-md text-on-surface mb-1.5">Description *</label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={5}
                  placeholder="Describe the issue in detail (minimum 20 characters)..."
                  className={`${inputClasses} resize-none`}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-label-md text-on-surface mb-1.5">Your Name</label>
                  <input id="name" value={form.name} onChange={(e) => update('name', e.target.value)} className={inputClasses} />
                </div>
                <div>
                  <label htmlFor="email" className="block text-label-md text-on-surface mb-1.5">Email</label>
                  <input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={inputClasses} />
                </div>
              </div>
              <button type="submit" disabled={submitting} className="btn-primary px-8 py-3 w-full sm:w-auto inline-flex items-center justify-center gap-2 disabled:opacity-60">
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Grievance
                    <Icon name="send" size={16} className="text-white/80" />
                  </>
                )}
              </button>
            </form>
          </ContentCard>
        </div>

        <div className="space-y-6">
          <ContentCard title="What happens next?">
            <ol className="space-y-3 text-body-sm text-on-surface-variant list-decimal list-inside">
              <li>You receive a reference ID instantly</li>
              <li>Grievance is assigned to the relevant department</li>
              <li>Status updates within 7 working days</li>
              <li>Resolution or escalation if not resolved in 30 days</li>
            </ol>
          </ContentCard>
          <ContentCard title="Already filed?">
            <p className="text-body-sm text-on-surface-variant mb-3">
              Track an existing grievance using your reference number.
            </p>
            <Link href="/track" className="text-secondary font-semibold hover:underline min-h-0 flex items-center gap-1">
              Go to Track Application
              <Icon name="arrow_forward" size={14} />
            </Link>
          </ContentCard>
        </div>
      </div>
    </InfoPageLayout>
  );
}
