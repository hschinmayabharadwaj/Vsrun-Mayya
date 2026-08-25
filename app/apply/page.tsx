'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ApplyPage() {
  const [step, setStep] = useState<'personal-info' | 'form' | 'otp' | 'confirmation'>(
    'personal-info'
  );
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    applicationType: 'grievance',
    title: '',
    description: '',
    otp: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = (currentStep: string): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 'personal-info') {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    } else if (currentStep === 'form') {
      if (!formData.applicationType) newErrors.applicationType = 'Application type is required';
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (formData.description.length < 20)
        newErrors.description = 'Description must be at least 20 characters';
    } else if (currentStep === 'otp') {
      if (!formData.otp.trim()) newErrors.otp = 'OTP is required';
      if (formData.otp !== '123456') newErrors.otp = 'Invalid OTP. (Hint: use 123456)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = async () => {
    if (!validateStep(step)) return;

    if (step === 'personal-info') {
      setStep('form');
    } else if (step === 'form') {
      setStep('otp');
    } else if (step === 'otp') {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitting(false);
      setStep('confirmation');
    }
  };

  const handlePrevStep = () => {
    if (step === 'form') {
      setStep('personal-info');
    } else if (step === 'otp') {
      setStep('form');
    }
  };

  const stepTitles = {
    'personal-info': 'Your Information',
    form: 'Application Details',
    otp: 'Verify Identity',
    confirmation: 'Submitted',
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-primary">New Application</h1>
        <Link
          href="/"
          className="text-sm text-accent hover:text-accent-dark underline"
        >
          Back to Home
        </Link>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8 space-y-2">
        <div className="flex justify-between text-sm font-medium text-neutral-text mb-2">
          <span>Step {['personal-info', 'form', 'otp', 'confirmation'].indexOf(step) + 1} of 4</span>
          <span>{stepTitles[step]}</span>
        </div>
        <div className="flex gap-2">
          {(['personal-info', 'form', 'otp', 'confirmation'] as const).map((s, index) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition-colors ${
                ['personal-info', 'form', 'otp', 'confirmation'].indexOf(step) >= index
                  ? 'bg-accent'
                  : 'bg-neutral-border'
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white border-2 border-neutral-border rounded-lg p-6 md:p-8 space-y-6">
        {/* Step 1: Personal Info */}
        {step === 'personal-info' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
                  errors.name ? 'border-error' : 'border-neutral-border'
                }`}
              />
              {errors.name && (
                <p className="text-sm text-error mt-1">⚠️ {errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className={`w-full px-4 py-3 border-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
                  errors.email ? 'border-error' : 'border-neutral-border'
                }`}
              />
              {errors.email && (
                <p className="text-sm text-error mt-1">⚠️ {errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 98765 43210"
                className={`w-full px-4 py-3 border-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
                  errors.phone ? 'border-error' : 'border-neutral-border'
                }`}
              />
              {errors.phone && (
                <p className="text-sm text-error mt-1">⚠️ {errors.phone}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Application Form */}
        {step === 'form' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Application Type
              </label>
              <select
                name="applicationType"
                value={formData.applicationType}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
                  errors.applicationType ? 'border-error' : 'border-neutral-border'
                }`}
              >
                <option value="grievance">📋 Grievance / Complaint</option>
                <option value="application">📝 New Application</option>
                <option value="service-request">🔧 Service Request</option>
              </select>
              {errors.applicationType && (
                <p className="text-sm text-error mt-1">⚠️ {errors.applicationType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="What is this about?"
                className={`w-full px-4 py-3 border-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
                  errors.title ? 'border-error' : 'border-neutral-border'
                }`}
              />
              {errors.title && (
                <p className="text-sm text-error mt-1">⚠️ {errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Please describe your issue or request in detail..."
                rows={5}
                className={`w-full px-4 py-3 border-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none ${
                  errors.description ? 'border-error' : 'border-neutral-border'
                }`}
              />
              <div className="text-xs text-neutral-text mt-1">
                {formData.description.length} / 2000 characters
              </div>
              {errors.description && (
                <p className="text-sm text-error mt-1">⚠️ {errors.description}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: OTP Verification */}
        {step === 'otp' && (
          <div className="space-y-4">
            <p className="text-neutral-text text-sm">
              Enter the OTP sent to <span className="font-medium">{formData.phone}</span>
            </p>

            <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded text-sm">
              <p className="text-blue-900">
                Demo OTP: <span className="font-mono font-bold">123456</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                One-Time Password (OTP)
              </label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className={`w-full px-4 py-3 border-2 rounded-lg font-mono text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
                  errors.otp ? 'border-error' : 'border-neutral-border'
                }`}
              />
              {errors.otp && (
                <p className="text-sm text-error mt-1">⚠️ {errors.otp}</p>
              )}
            </div>

            <button className="text-sm text-accent hover:text-accent-dark underline">
              Resend OTP
            </button>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 'confirmation' && (
          <div className="space-y-4 text-center py-6">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-primary">
              Application Submitted Successfully!
            </h2>
            <p className="text-neutral-text">
              Your reference ID is: <span className="font-mono font-bold text-primary">APP-2026-0001</span>
            </p>
            <p className="text-sm text-neutral-text">
              You can track your application status using this reference ID.
            </p>

            <div className="bg-green-50 border-l-4 border-success rounded p-4 mt-6 text-left">
              <p className="text-sm text-neutral-text font-medium mb-2">Next Steps:</p>
              <ul className="text-sm text-neutral-text space-y-1 list-disc list-inside">
                <li>Check your email for confirmation</li>
                <li>You will receive SMS updates on your phone</li>
                <li>Visit our status page to track progress</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 pt-6">
              <Link
                href="/status"
                className="w-full px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark text-center transition-colors min-h-44px inline-flex items-center justify-center"
              >
                Check Status
              </Link>
              <Link
                href="/"
                className="w-full px-6 py-3 bg-white border-2 border-accent text-accent rounded-lg font-medium hover:bg-blue-50 text-center transition-colors min-h-44px inline-flex items-center justify-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {step !== 'confirmation' && (
          <div className="flex gap-3 pt-4">
            <button
              onClick={handlePrevStep}
              disabled={step === 'personal-info'}
              className={`flex-1 px-4 py-3 border-2 rounded-lg font-medium transition-colors min-h-44px ${
                step === 'personal-info'
                  ? 'border-neutral-border text-neutral-text bg-gray-100 cursor-not-allowed'
                  : 'border-accent text-accent hover:bg-blue-50'
              }`}
            >
              ← Previous
            </button>
            <button
              onClick={handleNextStep}
              disabled={isSubmitting}
              className={`flex-1 px-4 py-3 bg-accent text-white rounded-lg font-medium transition-colors min-h-44px ${
                isSubmitting
                  ? 'opacity-70 cursor-wait'
                  : 'hover:bg-accent-dark'
              }`}
            >
              {isSubmitting ? '⏳ Submitting...' : step === 'otp' ? 'Submit Application' : 'Next →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
