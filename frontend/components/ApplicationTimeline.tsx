import { Icon } from './Icon';
import type { Application, TimelineStep } from '@/lib/types';
import { STATUS_LABELS } from '@/lib/types';

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  draft: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' },
  submitted: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  under_review: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
  verified: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  approved: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
};

const STATUS_ACCENT: Record<string, string> = {
  draft: '#94a3b8',
  submitted: '#16A34A',
  under_review: '#FF6D00',
  verified: '#F59E0B',
  approved: '#2563EB',
  rejected: '#DC2626',
};

// Color for each timeline step stage
const STEP_COLORS: Record<string, { ring: string; bg: string; text: string; icon: string }> = {
  submitted: { ring: 'border-success', bg: 'bg-success', text: 'text-success', icon: 'text-white' },
  under_review: { ring: 'border-secondary', bg: 'bg-secondary', text: 'text-secondary', icon: 'text-white' },
  pending: { ring: 'border-warning', bg: 'bg-warning', text: 'text-amber-600', icon: 'text-white' },
  documents_required: { ring: 'border-warning', bg: 'bg-warning', text: 'text-amber-600', icon: 'text-white' },
  verified: { ring: 'border-info', bg: 'bg-info', text: 'text-info', icon: 'text-white' },
  approved: { ring: 'border-info', bg: 'bg-info', text: 'text-info', icon: 'text-white' },
  rejected: { ring: 'border-error', bg: 'bg-error', text: 'text-error', icon: 'text-white' },
};

function getStepColor(step: TimelineStep) {
  if (step.completed) return STEP_COLORS[step.stage] ?? STEP_COLORS.submitted;
  if (step.active) return STEP_COLORS[step.stage] ?? STEP_COLORS.pending;
  return { ring: 'border-outline-variant', bg: 'bg-surface', text: 'text-on-surface-variant', icon: '' };
}

// Gradient colors for the progress bar based on current active step
function getProgressGradient(steps: TimelineStep[]) {
  const activeIdx = steps.findIndex((s) => s.active);
  if (activeIdx <= 0) return 'linear-gradient(90deg, #16A34A, #16A34A)';
  const colors: string[] = [];
  for (let i = 0; i <= activeIdx; i++) {
    const stage = steps[i].stage;
    if (stage === 'submitted') colors.push('#16A34A');
    else if (stage === 'under_review') colors.push('#FF6D00');
    else if (stage === 'pending' || stage === 'documents_required') colors.push('#F59E0B');
    else if (stage === 'verified' || stage === 'approved') colors.push('#2563EB');
    else if (stage === 'rejected') colors.push('#DC2626');
    else colors.push('#16A34A');
  }
  if (colors.length === 1) return `linear-gradient(90deg, ${colors[0]}, ${colors[0]})`;
  return `linear-gradient(90deg, ${colors.join(', ')})`;
}

export function ApplicationTimeline({ steps }: { steps: TimelineStep[] }) {
  const completedCount = steps.filter((s) => s.completed).length;
  const progress = steps.length > 1 ? (completedCount / (steps.length - 1)) * 100 : 0;

  return (
    <div className="relative flex items-center justify-between w-full mt-3" role="list" aria-label="Application progress">
      {/* Background track */}
      <div className="absolute left-0 top-[14px] w-full h-[3px] bg-outline-variant rounded-full" />
      {/* Progress fill */}
      <div
        className="absolute left-0 top-[14px] h-[3px] rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${Math.min(progress, 100)}%`,
          background: getProgressGradient(steps),
        }}
      />
      {steps.map((step) => {
        const color = getStepColor(step);
        return (
          <div key={step.stage} className="flex flex-col items-center z-10 w-1/4" role="listitem">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center mb-1.5 transition-all duration-300 border-2 ${
                step.completed
                  ? `${color.bg} ${color.ring} shadow-sm`
                  : step.active
                    ? `${color.bg} ${color.ring} shadow-glow animate-pulse-ring`
                    : `bg-surface ${color.ring}`
              }`}
            >
              <Icon
                name={step.completed ? 'check' : step.active ? 'pending' : 'radio_button_unchecked'}
                size={step.completed || step.active ? 16 : 12}
                className={step.completed || step.active ? color.icon : 'text-on-surface-variant'}
              />
            </div>
            <span
              className={`text-label-sm text-center leading-tight ${
                step.completed || step.active ? `${color.text} font-semibold` : 'text-on-surface-variant'
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function ApplicationCard({ application }: { application: Application }) {
  const styles = STATUS_STYLES[application.status] || STATUS_STYLES.draft;
  const accent = STATUS_ACCENT[application.status] || '#94a3b8';

  return (
    <div
      className="border border-outline-variant rounded-xl p-5 hover:shadow-card-hover transition-all bg-surface overflow-hidden"
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <div className="flex justify-between items-start mb-3 gap-3 flex-wrap">
        <div>
          <h3 className="text-body-lg font-semibold text-on-surface">{application.serviceName}</h3>
          <p className="text-label-sm text-on-surface-variant flex items-center gap-1.5 mt-0.5">
            <Icon name="tag" size={12} className="text-on-surface-variant" />
            {application.id}
          </p>
        </div>
        <span className={`text-label-sm px-2.5 py-1 rounded-lg border font-medium ${styles.bg} ${styles.text} ${styles.border}`}>
          {STATUS_LABELS[application.status]}
        </span>
      </div>
      <ApplicationTimeline steps={application.timeline} />
      {application.notes && (
        <p className="text-body-sm text-on-surface-variant mt-4 border-t border-outline-variant/50 pt-3 flex items-start gap-2">
          <Icon name="sticky_note_2" size={14} className="text-warning mt-0.5 shrink-0" />
          {application.notes}
        </p>
      )}
    </div>
  );
}
