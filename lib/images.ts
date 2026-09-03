import 'server-only';

import { createHash } from 'node:crypto';
import { unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { audit, db, nowIso, UPLOAD_DIR } from './db';
import { parseWidths } from './image-urls';

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ACCEPTED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const WIDTHS = [1600, 800] as const;

export interface StoredImage {
  id: number;
  basename: string;
  width: number;
  height: number;
  alt: string;
  widths: number[];
}

interface ImageRow {
  id: number;
  basename: string;
  width: number;
  height: number;
  alt: string;
  widths: string;
}

export class UploadError extends Error {}

const fromRow = (row: ImageRow): StoredImage => ({ ...row, widths: parseWidths(row.widths) });

export async function storeUpload(file: File, alt: string): Promise<StoredImage> {
  if (!ACCEPTED.has(file.type)) throw new UploadError('Dozvoljeni formati su JPG, PNG, WebP i AVIF.');
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError(`Slika je veća od ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB.`);
  if (file.size === 0) throw new UploadError('Fajl je prazan.');

  const input = Buffer.from(await file.arrayBuffer());
  const basename = createHash('sha256').update(input).digest('hex').slice(0, 16);
  const existing = db().prepare('SELECT id, basename, width, height, alt, widths FROM images WHERE basename = ?').get(basename) as ImageRow | undefined;

  if (existing) {
    if (alt && alt !== existing.alt) setAlt(existing.id, alt);
    return { ...fromRow(existing), alt: alt || existing.alt };
  }

  const base = sharp(input, { limitInputPixels: 40_000_000, failOn: 'error' }).rotate();
  const meta = await base.metadata();
  if (!meta.width || !meta.height) throw new UploadError('Fajl nije prepoznat kao slika.');

  const targets: number[] = WIDTHS.filter((width) => width <= meta.width);
  if (targets.length === 0) targets.push(meta.width);

  const width = targets[0]!;
  const height = Math.round((meta.height / meta.width) * width);
  const written: string[] = [];

  try {
    for (const target of targets) {
      const resized = base.clone().resize({ width: target, withoutEnlargement: true });
      const outputs: [string, Buffer][] = [
        [`${basename}-${target}.avif`, await resized.clone().avif({ quality: 55, effort: 4 }).toBuffer()],
        [`${basename}-${target}.webp`, await resized.clone().webp({ quality: 78 }).toBuffer()],
        [`${basename}-${target}.jpg`, await resized.clone().jpeg({ quality: 82, mozjpeg: true }).toBuffer()],
      ];
      for (const [name, buffer] of outputs) {
        await writeFile(join(UPLOAD_DIR, name), buffer);
        written.push(name);
      }
    }
  } catch {
    await Promise.all(written.map((name) => unlink(join(UPLOAD_DIR, name)).catch(() => undefined)));
    throw new UploadError('Sliku nije moguće obraditi.');
  }

  const result = db().prepare(
    'INSERT INTO images (basename, width, height, bytes, widths, alt, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
  ).run(basename, width, height, file.size, JSON.stringify(targets), alt, nowIso());

  return { id: Number(result.lastInsertRowid), basename, width, height, alt, widths: targets };
}

export function getImageById(id: number): StoredImage | null {
  const row = db().prepare('SELECT id, basename, width, height, alt, widths FROM images WHERE id = ?').get(id) as ImageRow | undefined;
  return row ? fromRow(row) : null;
}

export function setAlt(id: number, alt: string): void {
  db().prepare('UPDATE images SET alt = ? WHERE id = ?').run(alt, id);
}

export function imageUsageCount(id: number): number {
  return (db().prepare('SELECT COUNT(*) AS n FROM packages WHERE image_id = ?').get(id) as { n: number }).n;
}

export async function deleteImage(id: number, actor: string, ip: string | null): Promise<void> {
  const row = db().prepare('SELECT basename, widths FROM images WHERE id = ?').get(id) as { basename: string; widths: string } | undefined;
  if (!row) return;

  db().prepare('DELETE FROM images WHERE id = ?').run(id);
  await Promise.all(
    parseWidths(row.widths).flatMap((width) =>
      (['avif', 'webp', 'jpg'] as const).map((format) =>
        unlink(join(UPLOAD_DIR, `${row.basename}-${width}.${format}`)).catch(() => undefined),
      ),
    ),
  );
  audit('slika.obrisana', `#${id} ${row.basename}`, actor, ip);
}
