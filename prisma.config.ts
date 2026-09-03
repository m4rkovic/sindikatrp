import { defineConfig } from 'prisma/config';

// Prisma CLI od v7 ne učitava .env sam — bez ovoga migrate/seed/studio
// ne vide DATABASE_URL.
try {
  process.loadEnvFile();
} catch {
  // .env još ne postoji; komande koje ne traže bazu (generate) i dalje rade.
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node prisma/seed.mjs',
  },
  ...(process.env.DATABASE_URL ? { datasource: { url: process.env.DATABASE_URL } } : {}),
});
