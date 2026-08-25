import { NextRequest, NextResponse } from 'next/server';
import { DEMO_APPLICATIONS, simulateDelay } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    // Simulate network delay to test loading states
    await simulateDelay(800);

    // In production: validate user session and fetch their applications
    const applications = DEMO_APPLICATIONS;

    return NextResponse.json(
      {
        success: true,
        data: applications,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch applications',
      },
      { status: 500 }
    );
  }
}
