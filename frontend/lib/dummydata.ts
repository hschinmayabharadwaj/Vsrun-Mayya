// ============================================================
// DUMMY DATA
// Synthetic data for testing and development.
// All data is clearly fictional and for demo purposes only.
// ============================================================

export const DEMO_CITIZENS = [
  {
    id: 'CIT-001',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    avatar: 'PS',
  },
  {
    id: 'CIT-002',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phone: '+91 87654 32109',
    avatar: 'RV',
  },
  {
    id: 'CIT-003',
    name: 'Ananya Patel',
    email: 'ananya.patel@example.com',
    phone: '+91 76543 21098',
    avatar: 'AP',
  },
];

export const DEMO_APPLICATIONS = [
  {
    id: 'RES-2026-8842',
    serviceName: 'Income Certificate',
    status: 'under_review',
    submittedAt: '2026-08-20T10:30:00Z',
    updatedAt: '2026-08-22T14:15:00Z',
  },
  {
    id: 'VEH-2026-1190',
    serviceName: 'Vehicle Registration',
    status: 'approved',
    submittedAt: '2026-08-18T09:00:00Z',
    updatedAt: '2026-08-21T16:45:00Z',
  },
  {
    id: 'INC-2026-0001',
    serviceName: 'Birth Certificate',
    status: 'submitted',
    submittedAt: '2026-08-23T11:20:00Z',
    updatedAt: '2026-08-23T11:20:00Z',
  },
];

export const DEMO_NOTIFICATIONS = [
  {
    id: 'n1',
    message: 'Your Income Certificate application is under review.',
    createdAt: '2026-08-22T14:15:00Z',
    read: false,
  },
  {
    id: 'n2',
    message: 'Vehicle Registration approved. Visit your nearest RTO.',
    createdAt: '2026-08-21T16:45:00Z',
    read: true,
  },
  {
    id: 'n3',
    message: 'Birth Certificate application received successfully.',
    createdAt: '2026-08-23T11:20:00Z',
    read: false,
  },
];

export const DEMO_OTP = '123456';

export const TRACK_IDS = ['RES-2026-8842', 'VEH-2026-1190', 'INC-2026-0001'];

export const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  draft: { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400' },
  submitted: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  under_review: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  verified: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
};

export const SERVICE_STATS = [
  { label: 'Services Available', value: '12+', icon: 'apps' },
  { label: 'Applications Processed', value: '1,250+', icon: 'task_alt' },
  { label: 'Average Processing', value: '3-5 Days', icon: 'schedule' },
  { label: 'Satisfaction Rate', value: '98%', icon: 'thumb_up' },
];
