/**
 * System Status API Route
 * Returns uptime and database connectivity
 */

import { NextResponse } from 'next/server';
import { testDatabaseConnection } from '@/lib/db';

const startTime = Date.now();

export async function GET() {
  try {
    const dbStatus = await testDatabaseConnection();
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    
    return NextResponse.json({
      status: 'operational',
      uptime,
      database: dbStatus ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to check system status',
      },
      { status: 500 }
    );
  }
}
