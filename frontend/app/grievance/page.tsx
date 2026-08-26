import { GrievanceForm } from '@/components/GrievanceForm';
import { getGrievanceCategories } from '@/lib/portal-api';
import { AuthGate } from '@/components/AuthGate';

export default async function GrievancePage() {
  let categories: string[] = [];

  try {
    categories = await getGrievanceCategories();
  } catch {
    categories = ['Other'];
  }

  return <AuthGate title="Sign in to file a grievance"><GrievanceForm categories={categories} /></AuthGate>;
}
