'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiFetch, API_URL } from '@/lib/api';
import { Icon } from '@/components/Icon';
import { FadeIn, SlideUp } from '@/components/MotionWrappers';
import type { Service, Application } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = ['Applicant Details', 'Address Details', 'Documents', 'Declaration', 'Review'];

export default function ApplyPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [service, setService] = useState<Service | null>(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<Application | null>(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    idType: '',
    idNumber: '',
    address: '',
    city: '',
    pincode: '',
    annualIncome: '',
    purpose: '',
    agreed: false,
  });

  useEffect(() => {
    apiFetch<Service>(`/api/services/${slug}`)
      .then(setService)
      .catch(() => setError('Service not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  const update = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (): boolean => {
    if (step === 0) {
      if (!form.firstName || !form.lastName || !form.dob || !form.gender) {
        setError('Please fill all required fields.');
        return false;
      }
    }
    if (step === 1) {
      if (!form.address || !form.city || !form.pincode) {
        setError('Please fill all address fields.');
        return false;
      }
    }
    if (step === 3 && !form.agreed) {
      setError('You must agree to the declaration.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service?.id || slug,
          formData: form,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setSubmitted(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto p-xl skeleton h-96 rounded-xl" />;
  }

  if (!service) {
    return (
      <div className="max-w-3xl mx-auto p-xl text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center mx-auto mb-4">
          <Icon name="error" size={32} className="text-error" />
        </div>
        <p className="text-body-lg text-on-surface font-medium">Service not found.</p>
        <Link href="/services" className="text-secondary underline mt-3 inline-block text-label-md">Back to services</Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-margin-desktop py-16 text-center">
        <FadeIn>
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <Icon name="check_circle" filled className="text-success" size={48} />
          </div>
        </FadeIn>
        <SlideUp delay={0.1}>
          <h1 className="text-headline-lg text-on-surface mb-2">Application Submitted!</h1>
          <p className="text-body-md text-on-surface-variant mb-2">
            Your application has been received successfully.
          </p>
        </SlideUp>
        <SlideUp delay={0.2}>
          <div className="inline-block bg-secondary/5 border border-secondary/20 rounded-xl px-5 py-3 mt-2 mb-6">
            <p className="text-label-sm text-on-surface-variant">Reference ID</p>
            <p className="font-mono text-xl font-bold text-secondary">{submitted.id}</p>
          </div>
        </SlideUp>
        <FadeIn delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <Link href="/track" className="btn-primary px-8 py-3.5 min-h-[44px] flex items-center justify-center gap-2">
              <Icon name="track_changes" size={18} className="text-white/80" />
              Track Application
            </Link>
            <Link href="/dashboard" className="btn-outline px-8 py-3.5 min-h-[44px] flex items-center justify-center gap-2">
              <Icon name="dashboard" size={18} />
              Go to Dashboard
            </Link>
          </div>
        </FadeIn>
      </div>
    );
  }

  const inputClasses = 'w-full border border-outline-variant rounded-xl px-4 py-3 bg-neutral-50/50 text-body-md min-h-[48px] focus:bg-surface transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/10';

  return (
    <>
      {/* Sub-header */}
      <div className="bg-surface border-b border-outline-variant/50 py-3 px-margin-mobile md:px-margin-desktop flex justify-between items-center shadow-soft">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Icon name="description" filled className="text-white" size={16} />
          </div>
          <span className="text-body-md font-bold text-on-surface hidden sm:block">Apply: {service.name}</span>
        </div>
        <Link href="/services" className="text-secondary hover:underline text-label-md flex items-center gap-1.5 min-h-[44px] group">
          <Icon name="arrow_back" size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Cancel
        </Link>
      </div>

      <main className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <FadeIn>
          <div className="mb-8 text-center">
            <h1 className="text-headline-lg text-on-surface mb-1.5">Apply for {service.name}</h1>
            <p className="text-body-md text-on-surface-variant flex items-center justify-center gap-2">
              <Icon name="schedule" size={16} />
              Processing time: {service.processingDays}
            </p>
          </div>
        </FadeIn>

        {/* Progress stepper */}
        <SlideUp delay={0.1}>
          <div className="mb-10">
            <div className="flex items-center justify-between relative mb-2">
              {/* Track bg */}
              <div className="absolute left-[10%] right-[10%] top-[18px] h-[3px] bg-outline-variant rounded-full" />
              {/* Track fill */}
              <div
                className="absolute left-[10%] top-[18px] h-[3px] rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${Math.max(0, (step / (STEPS.length - 1)) * 80)}%`,
                  background: 'linear-gradient(90deg, #004b87, #3b82f6)',
                }}
              />
              {STEPS.map((label, i) => (
                <div key={label} className="flex flex-col items-center relative z-10">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-label-md font-bold border-2 transition-all duration-300 ${
                    i < step
                      ? 'bg-secondary text-white border-secondary shadow-sm'
                      : i === step
                        ? 'bg-secondary text-white border-secondary shadow-glow animate-pulse-ring'
                        : 'bg-surface text-on-surface-variant border-outline-variant'
                  }`}>
                    {i < step ? <Icon name="check" size={18} /> : i + 1}
                  </div>
                  <span className={`text-label-sm mt-2 hidden md:block text-center leading-tight ${
                    i === step ? 'text-secondary font-bold' : i < step ? 'text-on-surface font-medium' : 'text-on-surface-variant'
                  }`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </SlideUp>

        <SlideUp delay={0.2}>
          <div className="bg-surface border border-outline-variant rounded-2xl shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant/50 flex justify-between items-center">
              <h2 className="text-headline-md text-on-surface">Step {step + 1}: {STEPS[step]}</h2>
              <span className="bg-success/10 text-success text-label-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-success/20">
                <Icon name="lock" size={14} />
                Secure
              </span>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {error && (
                  <div className="mb-5 p-4 bg-error/5 text-error rounded-xl text-body-sm flex items-center gap-2 border border-error/20" role="alert">
                    <Icon name="error" size={18} />
                    {error}
                  </div>
                )}

                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {step === 0 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-label-md mb-1.5 text-on-surface">First Name <span className="text-error">*</span></label>
                          <input id="firstName" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} className={inputClasses} placeholder="Legal first name" required />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-label-md mb-1.5 text-on-surface">Last Name <span className="text-error">*</span></label>
                          <input id="lastName" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} className={inputClasses} required />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="dob" className="block text-label-md mb-1.5 text-on-surface">Date of Birth <span className="text-error">*</span></label>
                          <input id="dob" type="date" value={form.dob} onChange={(e) => update('dob', e.target.value)} className={inputClasses} required />
                        </div>
                        <div>
                          <label htmlFor="gender" className="block text-label-md mb-1.5 text-on-surface">Gender <span className="text-error">*</span></label>
                          <select id="gender" value={form.gender} onChange={(e) => update('gender', e.target.value)} className={inputClasses} required>
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="idType" className="block text-label-md mb-1.5 text-on-surface">ID Type</label>
                          <select id="idType" value={form.idType} onChange={(e) => update('idType', e.target.value)} className={inputClasses}>
                            <option value="">Select ID Type</option>
                            <option value="demo_id">Demo National ID</option>
                            <option value="passport">Passport</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="idNumber" className="block text-label-md mb-1.5 text-on-surface">ID Number</label>
                          <input id="idNumber" value={form.idNumber} onChange={(e) => update('idNumber', e.target.value)} placeholder="DEMO-XXXX-0000" className={`${inputClasses} font-mono`} />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="address" className="block text-label-md mb-1.5 text-on-surface">Full Address <span className="text-error">*</span></label>
                        <textarea id="address" value={form.address} onChange={(e) => update('address', e.target.value)} rows={3} className={`${inputClasses} min-h-[80px] resize-none`} required />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-label-md mb-1.5 text-on-surface">City <span className="text-error">*</span></label>
                          <input id="city" value={form.city} onChange={(e) => update('city', e.target.value)} className={inputClasses} required />
                        </div>
                        <div>
                          <label htmlFor="pincode" className="block text-label-md mb-1.5 text-on-surface">PIN Code <span className="text-error">*</span></label>
                          <input id="pincode" value={form.pincode} onChange={(e) => update('pincode', e.target.value)} placeholder="000000" className={inputClasses} required />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 p-3 bg-secondary/5 rounded-xl text-body-sm text-secondary border border-secondary/10">
                        <Icon name="info" size={18} />
                        Required: {service.requiredDocuments.join(', ')}
                      </div>
                      {service.requiredDocuments.map((doc) => (
                        <div key={doc} className="border-2 border-dashed border-outline-variant rounded-xl p-6 text-center hover:border-secondary hover:bg-secondary/5 transition-all cursor-pointer group">
                          <div className="w-12 h-12 rounded-xl bg-neutral-50 group-hover:bg-secondary/10 flex items-center justify-center mx-auto mb-3 transition-colors">
                            <Icon name="upload_file" className="text-on-surface-variant group-hover:text-secondary transition-colors" size={24} />
                          </div>
                          <p className="text-body-md font-semibold text-on-surface">{doc}</p>
                          <p className="text-body-sm text-on-surface-variant mt-1">Click to upload (demo — no file stored)</p>
                        </div>
                      ))}
                      <div>
                        <label htmlFor="annualIncome" className="block text-label-md mb-1.5 text-on-surface">Annual Family Income (INR)</label>
                        <input id="annualIncome" value={form.annualIncome} onChange={(e) => update('annualIncome', e.target.value)} placeholder="DEMO amount" className={inputClasses} />
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="purpose" className="block text-label-md mb-1.5 text-on-surface">Purpose of Certificate</label>
                        <input id="purpose" value={form.purpose} onChange={(e) => update('purpose', e.target.value)} placeholder="e.g. Scholarship application" className={inputClasses} />
                      </div>
                      <label className="flex items-start gap-3 cursor-pointer min-h-[44px] p-4 border border-outline-variant rounded-xl hover:bg-neutral-50 transition-colors">
                        <input type="checkbox" checked={form.agreed} onChange={(e) => update('agreed', e.target.checked)} className="mt-0.5 h-5 w-5 rounded-md border-outline-300 text-secondary focus:ring-secondary" />
                        <span className="text-body-sm text-on-surface leading-relaxed">
                          I declare that all information provided is true and correct to the best of my knowledge. I understand this is a demo platform with synthetic data only.
                        </span>
                      </label>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { label: 'Full Name', value: `${form.firstName} ${form.lastName}`, icon: 'person' },
                          { label: 'Date of Birth', value: form.dob, icon: 'calendar_today' },
                          { label: 'Address', value: `${form.address}, ${form.city} — ${form.pincode}`, icon: 'home' },
                          { label: 'Service', value: service.name, icon: 'description' },
                          { label: 'Department', value: service.department, icon: 'apartment' },
                          { label: 'Purpose', value: form.purpose || '—', icon: 'flag' },
                        ].map((item) => (
                          <div key={item.label} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-secondary/8 flex items-center justify-center shrink-0 mt-0.5">
                              <Icon name={item.icon} size={16} className="text-secondary" />
                            </div>
                            <div>
                              <p className="text-label-sm text-on-surface-variant">{item.label}</p>
                              <p className="text-body-sm font-medium text-on-surface">{item.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 p-4 bg-secondary/5 rounded-xl border border-secondary/10 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <Icon name="science" size={16} className="text-secondary" />
                        </div>
                        <p className="text-body-sm text-on-surface-variant">
                          Demo OTP: <strong className="font-mono text-secondary bg-secondary/10 px-1.5 py-0.5 rounded">123456</strong>
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="border-t border-outline-variant/50 pt-6 mt-8 flex flex-col-reverse md:flex-row justify-between gap-3">
                <button
                  type="button"
                  onClick={() => step > 0 && setStep(step - 1)}
                  disabled={step === 0}
                  className="btn-outline px-6 py-3 min-h-[48px] disabled:opacity-30 flex items-center justify-center gap-2"
                >
                  <Icon name="arrow_back" size={18} />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={submitting}
                  className="btn-primary px-6 py-3 min-h-[48px] disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : step === STEPS.length - 1 ? (
                    <>
                      Submit Application
                      <Icon name="send" size={18} className="text-white/80" />
                    </>
                  ) : (
                    <>
                      Next Step
                      <Icon name="arrow_forward" size={18} className="text-white/80" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </SlideUp>
      </main>
    </>
  );
}
