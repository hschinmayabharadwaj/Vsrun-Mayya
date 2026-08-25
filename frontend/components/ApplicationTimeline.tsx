import { Icon } from './Icon';
import type { Application, TimelineStep } from '@/lib/types';
import { STATUS_LABELS } from '@/lib/types';

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  draft: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
  submitted: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  under_review: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  verified: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

const STATUS_ACCENT: Record<string, string> = {
  draft: '#94a3b8',
  submitted: '#2563eb',
  under_review: '#d97706',
  verified: '#6366f1',
  approved: '#059669',
  rejected: '#dc2626',
};

export function ApplicationTimeline({ steps }: { steps: TimelineStep[] }) {
  const completedCount = steps.filter((s) => s.completed).length;
  const progress = steps.length > 1 ? (completedCount / (steps.length - 1)) * 100 : 0;

  return (
    <div className="relative flex items-center justify-between w-full mt-3" role="list" aria-label="Application progress">
      {/* Background track */}
      <div className="absolute left-0 top-[14px] w-full h-[3px] bg-slate-100 z-0 rounded-full" />
      {/* Progress fill */}
      <div
        className="absolute left-0 top-[14px] h-[3px] z-0 rounded-full transition-all duration-500"
        style={{
          width: `${Math.min(progress, 100)}%`,
          background: 'linear-gradient(90deg, #2563eb, #6366f1)',
        }}
      />
      {steps.map((step) => (
        <div key={step.stage} className="flex flex-col items-center z-10 w-1/4" role="listitem">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center mb-1.5 transition-all ${
              step.completed
                ? 'bg-secondary text-white shadow-sm'
                : step.active
                  ? 'bg-secondary text-white shadow-glow animate-pulse-ring'
                  : 'bg-white border-2 border-slate-200 text-slate-400'
            }`}
          >
            <Icon
              name={step.completed ? 'check' : step.active ? 'pending' : 'radio_button_unchecked'}
              size={step.completed || step.active ? 16 : 12}
            />
          </div>
          <span
            className={`text-label-sm text-center leading-tight ${
              step.completed || step.active ? 'text-secondary font-bold' : 'text-on-surface-variant'
            }`}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ApplicationCard({ application }: { application: Application }) {
  const styles = STATUS_STYLES[application.status] || STATUS_STYLES.draft;
  const accent = STATUS_ACCENT[application.status] || '#94a3b8';

  return (
    <div
      className="border border-slate-200/80 rounded-xl p-4 hover:shadow-elevated transition-all bg-white overflow-hidden"
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <div className="flex justify-between items-start mb-3 gap-md flex-wrap">
        <div>
          <h3 className="text-body-lg font-semibold text-on-surface">{application.serviceName}</h3>
          <p className="text-label-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
            <Icon name="tag" size={12} />
            {application.id}
          </p>
        </div>
        <span className={`text-label-sm px-2.5 py-1 rounded-lg border font-medium ${styles.bg} ${styles.text} ${styles.border}`}>
          {STATUS_LABELS[application.status]}
        </span>
      </div>
      <ApplicationTimeline steps={application.timeline} />
      {application.notes && (
        <p className="text-body-sm text-on-surface-variant mt-4 border-t border-slate-100 pt-3 flex items-start gap-2">
          <Icon name="sticky_note_2" size={14} className="text-on-surface-variant mt-0.5 shrink-0" />
          {application.notes}
        </p>
      )}
    </div>
  );
}
