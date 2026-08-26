import { redirect } from 'next/navigation';

export default function ApplyPage() {
  redirect('/services');
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { MOCK_OTP } from '@/lib/mock-data';

type Step = 'personal' | 'form' | 'otp' | 'done';

const STEPS: { key: Step; label: string }[] = [
  { key: 'personal', label: 'Your Information' },
  { key: 'form', label: 'Application Details' },
  { key: 'otp', label: 'Verify Identity' },
  { key: 'done', label: 'Submitted' },
];

export default function GenericApplyPage() {
  const [step, setStep] = useState<Step>('personal');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    applicationType: 'grievance',
    title: '',
    description: '',
    otp: '',
  });

  const stepIdx = STEPS.findIndex((s) => s.key === step);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 'personal') {
      if (!form.name.trim()) e.name = 'Name is required';
      if (!form.email.trim()) e.email = 'Email is required';
      if (!form.phone.trim()) e.phone = 'Phone is required';
    } else if (step === 'form') {
      if (!form.title.trim()) e.title = 'Title is required';
      if (!form.description.trim()) e.description = 'Description is required';
      if (form.description.length < 20) e.description = 'Min 20 characters';
    } else if (step === 'otp') {
      if (form.otp !== MOCK_OTP) e.otp = 'Invalid OTP (hint: 123456)';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = async () => {
    if (!validate()) return;
    if (step === 'personal') setStep('form');
    else if (step === 'form') setStep('otp');
    else if (step === 'otp') {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 1500));
      setSubmitting(false);
      setStep('done');
    }
  };

  const prev = () => {
    if (step === 'form') setStep('personal');
    else if (step === 'otp') setStep('form');
  };

  const input = (label: string, field: string, type = 'text', opts?: { placeholder?: string; rows?: number }) => (
    <div>
      <label className="block text-label-md text-on-surface mb-1.5">{label}</label>
      {opts?.rows ? (
        <textarea
          value={(form as Record<string, string>)[field]}
          onChange={(e) => update(field, e.target.value)}
          placeholder={opts.placeholder}
          rows={opts.rows}
          className={`w-full px-3 py-2.5 rounded-lg border bg-white text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors resize-none ${
            errors[field] ? 'border-error' : 'border-outline-variant'
          }`}
        />
      ) : (
        <input
          type={type}
          value={(form as Record<string, string>)[field]}
          onChange={(e) => update(field, e.target.value)}
          placeholder={opts?.placeholder}
          className={`w-full px-3 py-2.5 rounded-lg border bg-white text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors ${
            errors[field] ? 'border-error' : 'border-outline-variant'
          }`}
        />
      )}
      {errors[field] && <p className="text-body-sm text-error mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Apply', href: '/apply' }, { label: 'New Application' }]} />

      <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-headline-lg text-on-surface">New Application</h1>
        <Link href="/" className="text-body-sm text-secondary hover:text-secondary-hover transition-colors flex items-center gap-1 min-h-0">
          <Icon name="arrow_back" size={14} /> Back
        </Link>
      </div>

      {step !== 'done' && (
        <div className="mb-6">
          <div className="flex justify-between text-body-sm text-on-surface-variant mb-2">
            <span>Step {stepIdx + 1} of {STEPS.length}</span>
            <span>{STEPS[stepIdx].label}</span>
          </div>
          <div className="flex gap-1.5">
            {STEPS.map((s, i) => (
              <div
                key={s.key}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= stepIdx ? 'bg-secondary' : 'bg-outline-variant'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="bg-surface rounded-xl border border-outline-variant p-5 md:p-7">
        {step === 'personal' && (
          <div className="space-y-4">
            {input('Full Name', 'name', 'text', { placeholder: 'Enter your full name' })}
            {input('Email', 'email', 'email', { placeholder: 'you@example.com' })}
            {input('Phone', 'phone', 'tel', { placeholder: '+91 98765 43210' })}
          </div>
        )}

        {step === 'form' && (
          <div className="space-y-4">
            <div>
              <label className="block text-label-md text-on-surface mb-1.5">Application Type</label>
              <select
                value={form.applicationType}
                onChange={(e) => update('applicationType', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-white text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
              >
                <option value="grievance">Grievance / Complaint</option>
                <option value="application">New Application</option>
                <option value="service-request">Service Request</option>
              </select>
            </div>
            {input('Title', 'title', 'text', { placeholder: 'Brief summary' })}
            {input('Description', 'description', 'text', { placeholder: 'Describe your issue in detail...', rows: 5 })}
            <p className="text-body-sm text-on-surface-variant">{form.description.length} / 2000</p>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-4">
            <p className="text-body-sm text-on-surface-variant">
              OTP sent to <span className="font-medium text-on-surface">{form.phone}</span>
            </p>
            <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/20 text-body-sm text-on-surface">
              Demo OTP: <span className="font-mono font-bold">{MOCK_OTP}</span>
            </div>
            {input('One-Time Password', 'otp', 'text', { placeholder: '6-digit code' })}
          </div>
        )}

        {step === 'done' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <Icon name="check_circle" size={40} className="text-success" />
            </div>
            <h2 className="text-headline-lg text-on-surface">Application Submitted</h2>
            <p className="text-body-md text-on-surface-variant">
              Reference ID: <span className="font-mono font-bold text-on-surface">APP-2026-0001</span>
            </p>
            <div className="p-4 rounded-lg bg-success/5 border-l-4 border-success text-left text-body-sm text-on-surface-variant space-y-1">
              <p className="font-medium text-on-surface">Next Steps:</p>
              <ul className="list-disc list-inside">
                <li>Check your email for confirmation</li>
                <li>SMS updates will be sent to your phone</li>
                <li>Track progress on the status page</li>
              </ul>
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <Link href="/status" className="btn-primary text-center">
                <Icon name="dashboard" size={16} /> Check Status
              </Link>
              <Link href="/" className="btn-outline text-center">
                <Icon name="home" size={16} /> Back to Home
              </Link>
            </div>
          </div>
        )}

        {step !== 'done' && (
          <div className="flex gap-3 pt-5">
            <button
              onClick={prev}
              disabled={step === 'personal'}
              className={`flex-1 py-2.5 rounded-lg border-2 font-medium text-body-md transition-colors ${
                step === 'personal'
                  ? 'border-outline-variant text-on-surface-variant cursor-not-allowed'
                  : 'border-secondary text-secondary hover:bg-secondary/5'
              }`}
            >
              Previous
            </button>
            <button
              onClick={next}
              disabled={submitting}
              className="btn-primary flex-1"
            >
              {submitting ? 'Submitting...' : step === 'otp' ? 'Submit' : 'Next'}
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
