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

export const MOCK_OTP = '123456';

export async function simulateDelay(ms: number = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
