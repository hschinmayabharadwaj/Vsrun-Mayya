export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'verified'
  | 'approved'
  | 'rejected';

export type ServiceCategory =
  | 'identity_civil'
  | 'education_skills'
  | 'health_welfare'
  | 'business_trade'
  | 'housing_land';

export interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ServiceCategory;
  department: string;
  processingDays: string;
  requiredDocuments: string[];
  onlineAvailable: boolean;
  icon: string;
  popular?: boolean;
}

export interface Application {
  id: string;
  serviceId: string;
  serviceName: string;
  citizenId: string;
  citizenName: string;
  status: ApplicationStatus;
  timeline: TimelineStep[];
  formData: Record<string, unknown>;
  submittedAt: string;
  updatedAt: string;
  notes?: string;
}

export interface TimelineStep {
  stage: string;
  label: string;
  completed: boolean;
  active: boolean;
  timestamp?: string;
}

export interface Notification {
  id: string;
  citizenId: string;
  applicationId?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Citizen {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface CreateApplicationPayload {
  serviceId: string;
  citizenId: string;
  citizenName: string;
  formData: Record<string, unknown>;
  saveAsDraft?: boolean;
}

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  identity_civil: 'Identity & Civil',
  education_skills: 'Education & Skills',
  health_welfare: 'Health & Welfare',
  business_trade: 'Business & Trade',
  housing_land: 'Housing & Land',
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  verified: 'Verified',
  approved: 'Approved',
  rejected: 'Rejected',
};
