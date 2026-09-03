import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NextResponse } from 'next/server';
import { UPLOAD_DIR } from '@/lib/db';

const SAFE_NAME = /^[a-f0-9]{16}-\d+\.(avif|webp|jpg)$/;
const TYPES: Record<string, string> = { avif: 'image/avif', webp: 'image/webp', jpg: 'image/jpeg' };

export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  if (!SAFE_NAME.test(filename)) return new NextResponse('Not found', { status: 404 });
  try {
    const data = await readFile(join(UPLOAD_DIR, filename));
    const ext = filename.split('.').pop()!;
    return new NextResponse(new Uint8Array(data), { headers: { 'Content-Type': TYPES[ext]!, 'Cache-Control': 'public, max-age=31536000, immutable' } });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
