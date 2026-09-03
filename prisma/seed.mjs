/**
 * Seed: tri podrazumevana paketa, da svež deploy renderuje istu stranicu
 * kao pre admin panela, a ne praznu sekciju. Ne dira postojeće podatke —
 * ako u bazi već ima paketa, ne radi ništa.
 *
 * Pokretanje: npm run db:seed (ili automatski uz `prisma migrate dev`).
 */

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

const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL) });

const seed = [
  { code: 'T-01', name: 'Saradnik', priceCents: 500, perks: 'Priority queue\nDiscord rola\nCustom tablica' },
  { code: 'T-02', name: 'Ortak', priceCents: 1000, perks: 'Sve iz T-01\n+1 character slot\nKozmetički vozni slot' },
  { code: 'T-03', name: 'Kum', priceCents: 2000, perks: 'Sve iz T-02\n+2 character slota\nKozmetički paket sezone' },
];

const existing = await prisma.package.count();
if (existing > 0) {
  console.log(`Baza već ima ${existing} paket(a) — seed preskočen.`);
} else {
  await prisma.package.createMany({
    data: seed.map((row, position) => ({ ...row, position })),
  });
  console.log(`Ubačena ${seed.length} podrazumevana paketa.`);
}

await prisma.$disconnect();
