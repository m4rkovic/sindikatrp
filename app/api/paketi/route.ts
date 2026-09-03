import { NextResponse } from 'next/server';
import { listPublic } from '@/lib/packages';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({ packages: listPublic() }, { headers: { 'Cache-Control': 'no-store' } });
}
