#!/usr/bin/env node
/**
 * Jednokratni prenos podataka iz stare SQLite baze (data/sindikat.db) u
 * PostgreSQL. Prenosi naloge, slike, pakete i dnevnik — sa ORIGINALNIM
 * ID-jevima, da veze paket→slika ostanu netaknute. Sesije i login pokušaji
 * se namerno ne prenose.
 *
 * Pokretanje (posle `npm run db:migrate`):
 *   npm run db:import-sqlite
 *
 * Skripta odbija da piše preko postojećih podataka: ako u Postgres bazi već
 * ima korisnika ili paketa, prekida se bez izmena.
 */

import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

try {
  process.loadEnvFile();
} catch {
  // nema .env — oslanjamo se na već postavljen DATABASE_URL
}

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL nije postavljen — kopiraj .env.example u .env i upiši konekciju.');
  process.exit(1);
}

const DATA_DIR = process.env.SINDIKAT_DATA_DIR ?? join(process.cwd(), 'data');
const SQLITE_PATH = join(DATA_DIR, 'sindikat.db');

if (!existsSync(SQLITE_PATH)) {
  console.error(`Stara baza nije nađena: ${SQLITE_PATH}`);
  process.exit(1);
}

let Database;
try {
  ({ default: Database } = await import('better-sqlite3'));
} catch {
  console.error('better-sqlite3 nije instaliran (devDependency) — pokreni `npm install` pa probaj ponovo.');
  process.exit(1);
}

const sqlite = new Database(SQLITE_PATH, { readonly: true });
const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL) });

const users = sqlite.prepare('SELECT * FROM users ORDER BY id').all();
const images = sqlite.prepare('SELECT * FROM images ORDER BY id').all();
const packages = sqlite.prepare('SELECT * FROM packages ORDER BY id').all();
const auditRows = sqlite.prepare('SELECT * FROM audit_log ORDER BY id').all();

const [pgUsers, pgPackages] = await Promise.all([prisma.user.count(), prisma.package.count()]);
if (pgUsers > 0 || pgPackages > 0) {
  console.error(`Postgres baza nije prazna (${pgUsers} naloga, ${pgPackages} paketa) — prekid bez izmena.`);
  console.error('Ako je to bio samo seed, obriši te redove pa pokreni ponovo.');
  await prisma.$disconnect();
  process.exit(1);
}

const date = (value) => (value ? new Date(value) : null);

await prisma.$transaction(async (tx) => {
  for (const u of users) {
    await tx.user.create({
      data: {
        id: u.id,
        username: u.username,
        passwordHash: u.password_hash,
        createdAt: date(u.created_at) ?? new Date(),
        lastLoginAt: date(u.last_login_at),
      },
    });
  }

  for (const i of images) {
    await tx.image.create({
      data: {
        id: i.id,
        basename: i.basename,
        width: i.width,
        height: i.height,
        bytes: i.bytes,
        widths: JSON.parse(i.widths ?? '[]'),
        alt: i.alt ?? '',
        createdAt: date(i.created_at) ?? new Date(),
      },
    });
  }

  for (const p of packages) {
    await tx.package.create({
      data: {
        id: p.id,
        code: p.code ?? '',
        name: p.name,
        priceCents: p.price_cents,
        currency: p.currency ?? 'EUR',
        period: p.period === 'once' ? 'once' : 'monthly',
        perks: p.perks ?? '',
        description: p.description ?? '',
        url: p.url ?? '',
        imageId: p.image_id,
        featured: p.featured === 1,
        visible: p.visible === 1,
        position: p.position ?? 0,
        createdAt: date(p.created_at) ?? new Date(),
        updatedAt: date(p.updated_at) ?? new Date(),
      },
    });
  }

  for (const a of auditRows) {
    await tx.auditLog.create({
      data: {
        username: a.username,
        action: a.action,
        detail: a.detail ?? '',
        ip: a.ip,
        at: date(a.at) ?? new Date(),
      },
    });
  }

  // Eksplicitni ID-jevi ne pomeraju Postgres sekvence — bez ovoga bi prvi
  // novi red dobio već zauzet ID.
  for (const table of ['users', 'images', 'packages', 'audit_log']) {
    await tx.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE((SELECT MAX(id) FROM "${table}"), 0) + 1, false)`,
    );
  }
});

console.log(`Preneto: ${users.length} naloga, ${images.length} slika, ${packages.length} paketa, ${auditRows.length} audit zapisa.`);
console.log('Sesije nisu prenete — admin treba ponovo da se prijavi.');

sqlite.close();
await prisma.$disconnect();
