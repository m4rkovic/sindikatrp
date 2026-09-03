import { NextResponse } from 'next/server';
import { getServerStatus } from '@/lib/status';

export const dynamic = 'force-dynamic';

export async function GET() {
  const status = await getServerStatus();
  return NextResponse.json(status, { headers: { 'Cache-Control': 'no-store' } });
}
