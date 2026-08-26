import { NextResponse } from 'next/server';
import { DEMO_APPLICATIONS, simulateDelay } from '@/lib/mock-data';

export async function GET() {
  try {
    await simulateDelay(800);
    return NextResponse.json({ success: true, data: DEMO_APPLICATIONS }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch applications' }, { status: 500 });
  }
}
