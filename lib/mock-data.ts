// Synthetic data — clearly fake for demo purposes

export interface SyntheticUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  refId: string;
}

export interface Application {
  id: string;
  userId: string;
  type: 'grievance' | 'application' | 'service-request';
  title: string;
  description: string;
  status: 'submitted' | 'under-review' | 'approved' | 'rejected';
  submittedAt: string;
  updatedAt: string;
  expectedResolutionDate?: string;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  applicationId: string;
  type: 'status-update' | 'action-required' | 'resolved';
  message: string;
  createdAt: string;
  read: boolean;
}

// Seed synthetic users
export const DEMO_USERS: SyntheticUser[] = [
  {
    id: 'demo-001',
    name: 'Demo User',
    email: 'demo.user@example.com',
    phone: '+91 DEMO 0000 0001',
    refId: 'DEMO-REF-0001',
  },
];

// Mock applications database
export const DEMO_APPLICATIONS: Application[] = [
  {
    id: 'app-001',
    userId: 'demo-001',
    type: 'grievance',
    title: 'Service delivery delay',
    description: 'Application processing is taking longer than promised timeline',
    status: 'under-review',
    submittedAt: '2026-08-18T10:30:00Z',
    updatedAt: '2026-08-24T14:20:00Z',
    expectedResolutionDate: '2026-08-28T17:00:00Z',
    notes: 'Under verification by department head',
  },
  {
    id: 'app-002',
    userId: 'demo-001',
    type: 'application',
    title: 'License renewal',
    description: 'Renewal of professional license for year 2026',
    status: 'submitted',
    submittedAt: '2026-08-22T09:15:00Z',
    updatedAt: '2026-08-22T09:15:00Z',
    expectedResolutionDate: '2026-08-29T17:00:00Z',
  },
  {
    id: 'app-003',
    userId: 'demo-001',
    type: 'service-request',
    title: 'Certificate issuance',
    description: 'Request for official certificate of registration',
    status: 'approved',
    submittedAt: '2026-08-15T11:45:00Z',
    updatedAt: '2026-08-24T16:30:00Z',
    notes: 'Certificate ready for pickup or download',
  },
];

// Mock notifications
export const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    userId: 'demo-001',
    applicationId: 'app-001',
    type: 'status-update',
    message: 'Your grievance has been escalated to the senior review team',
    createdAt: '2026-08-24T14:20:00Z',
    read: false,
  },
  {
    id: 'notif-002',
    userId: 'demo-001',
    applicationId: 'app-003',
    type: 'resolved',
    message: 'Your certificate is ready! Download it from your dashboard',
    createdAt: '2026-08-24T16:30:00Z',
    read: true,
  },
];

// Mock OTP storage (in production: secure session + SMS)
export const MOCK_OTP = '123456';
export const MOCK_OTP_EXPIRY = 600000; // 10 minutes in milliseconds

// Simulate network delay (helps test loading states)
export async function simulateDelay(ms: number = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
