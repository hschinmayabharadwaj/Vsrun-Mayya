import { GrievanceForm } from '@/components/GrievanceForm';
import { getGrievanceCategories } from '@/lib/portal-api';

export default async function GrievancePage() {
  let categories: string[] = [];

  try {
    categories = await getGrievanceCategories();
  } catch {
    categories = ['Other'];
  }

  return <GrievanceForm categories={categories} />;
}
