import 'server-only';

import { audit, db, nowIso } from './db';
import { parseWidths } from './image-urls';

export type Period = 'monthly' | 'once';

interface PackageRow {
  id: number;
  code: string;
  name: string;
  price_cents: number;
  currency: string;
  period: Period;
  perks: string;
  description: string;
  url: string;
  image_id: number | null;
  featured: number;
  visible: number;
  position: number;
  image_basename: string | null;
  image_alt: string | null;
  image_width: number | null;
  image_height: number | null;
  image_widths: string | null;
}

export interface PackageImage {
  basename: string;
  alt: string;
  width: number;
  height: number;
  widths: number[];
}

export interface Package {
  id: number;
  code: string;
  name: string;
  price: string;
  priceCents: number;
  currency: string;
  period: Period;
  periodLabel: string;
  perks: string[];
  perksRaw: string;
  description: string;
  url: string;
  featured: boolean;
  visible: boolean;
  position: number;
  imageId: number | null;
  image: PackageImage | null;
}

const SELECT = `
  SELECT p.*,
         i.basename AS image_basename,
         i.alt AS image_alt,
         i.width AS image_width,
         i.height AS image_height,
         i.widths AS image_widths
    FROM packages p
    LEFT JOIN images i ON i.id = p.image_id
`;

export function formatPrice(cents: number, currency: string): string {
  const whole = cents % 100 === 0;
  const amount = (cents / 100).toLocaleString('sr-RS', {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${amount} ${currency}`;
}

export const periodLabel = (period: Period) => (period === 'once' ? 'JEDNOKRATNO' : 'MESEČNO');

function toPackage(row: PackageRow): Package {
  const perks = row.perks.split('\n').map((item) => item.trim()).filter(Boolean);
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    price: formatPrice(row.price_cents, row.currency),
    priceCents: row.price_cents,
    currency: row.currency,
    period: row.period,
    periodLabel: periodLabel(row.period),
    perks,
    perksRaw: row.perks,
    description: row.description,
    url: row.url,
    featured: row.featured === 1,
    visible: row.visible === 1,
    position: row.position,
    imageId: row.image_id,
    image: row.image_basename
      ? {
          basename: row.image_basename,
          alt: row.image_alt ?? '',
          width: row.image_width ?? 0,
          height: row.image_height ?? 0,
          widths: parseWidths(row.image_widths ?? '[]'),
        }
      : null,
  };
}

export function listPublic(limit?: number): Package[] {
  const sql = `${SELECT} WHERE p.visible = 1 ORDER BY p.position, p.id${limit ? ' LIMIT ?' : ''}`;
  const statement = db().prepare(sql);
  const rows = (limit ? statement.all(limit) : statement.all()) as PackageRow[];
  return rows.map(toPackage);
}

export function listAll(): Package[] {
  return (db().prepare(`${SELECT} ORDER BY p.position, p.id`).all() as PackageRow[]).map(toPackage);
}

export function getPackage(id: number): Package | null {
  const row = db().prepare(`${SELECT} WHERE p.id = ?`).get(id) as PackageRow | undefined;
  return row ? toPackage(row) : null;
}

export interface PackageInput {
  code: string;
  name: string;
  priceCents: number;
  currency: string;
  period: Period;
  perks: string;
  description: string;
  url: string;
  imageId: number | null;
  featured: boolean;
  visible: boolean;
}

export function createPackage(input: PackageInput, actor: string, ip: string | null): number {
  const now = nowIso();
  const next = db().prepare('SELECT COALESCE(MAX(position), -1) + 1 AS n FROM packages').get() as { n: number };
  const result = db().prepare(`
    INSERT INTO packages
      (code, name, price_cents, currency, period, perks, description, url, image_id, featured, visible, position, created_at, updated_at)
    VALUES
      (@code, @name, @priceCents, @currency, @period, @perks, @description, @url, @imageId, @featured, @visible, @position, @now, @now)
  `).run({ ...input, featured: +input.featured, visible: +input.visible, position: next.n, now });
  audit('paket.kreiran', `#${result.lastInsertRowid} ${input.code} ${input.name}`, actor, ip);
  return Number(result.lastInsertRowid);
}

export function updatePackage(id: number, input: PackageInput, actor: string, ip: string | null): void {
  db().prepare(`
    UPDATE packages SET
      code=@code, name=@name, price_cents=@priceCents, currency=@currency, period=@period,
      perks=@perks, description=@description, url=@url, image_id=@imageId,
      featured=@featured, visible=@visible, updated_at=@now
    WHERE id=@id
  `).run({ ...input, id, featured: +input.featured, visible: +input.visible, now: nowIso() });
  audit('paket.izmenjen', `#${id} ${input.code} ${input.name}`, actor, ip);
}

export function deletePackage(id: number, actor: string, ip: string | null): void {
  const pkg = getPackage(id);
  db().prepare('DELETE FROM packages WHERE id = ?').run(id);
  audit('paket.obrisan', `#${id} ${pkg?.name ?? ''}`, actor, ip);
}

export function setVisible(id: number, visible: boolean, actor: string, ip: string | null): void {
  db().prepare('UPDATE packages SET visible = ?, updated_at = ? WHERE id = ?').run(+visible, nowIso(), id);
  audit(visible ? 'paket.prikazan' : 'paket.sakriven', `#${id}`, actor, ip);
}

export function move(id: number, direction: -1 | 1, actor: string, ip: string | null): void {
  const d = db();
  d.transaction(() => {
    const rows = d.prepare('SELECT id FROM packages ORDER BY position, id').all() as { id: number }[];
    const index = rows.findIndex((row) => row.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= rows.length) return;
    [rows[index], rows[target]] = [rows[target]!, rows[index]!];
    const update = d.prepare('UPDATE packages SET position = ? WHERE id = ?');
    rows.forEach((row, position) => update.run(position, row.id));
  })();
  audit('paket.pomeren', `#${id} ${direction < 0 ? 'gore' : 'dole'}`, actor, ip);
}
