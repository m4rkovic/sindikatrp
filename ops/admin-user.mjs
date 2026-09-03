#!/usr/bin/env node
/**
 * Create an admin account, or reset an existing one's password.
 *
 *   node ops/admin-user.mjs <ime>              generate a password and print it
 *   node ops/admin-user.mjs <ime> --lozinka    read one from stdin instead
 *   node ops/admin-user.mjs <ime> --obrisi     delete the account
 *   node ops/admin-user.mjs --lista            list accounts
 *
 * There is deliberately no way to create the first account through the web:
 * an unauthenticated setup route is reachable by whoever finds it first.
 * Making an account requires shell access to this box.
 *
 * The schema and the hash format come from src/lib — this script does not
 * carry its own copies of either.
 */

import { randomBytes } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createInterface } from 'node:readline/promises';

const APP = dirname(dirname(fileURLToPath(import.meta.url)));

const { openDatabase } = await import(pathToFileURL(join(APP, 'lib/schema.mjs')).href);
const { hashPassword, passwordProblem } = await import(pathToFileURL(join(APP, 'lib/password.mjs')).href);

const DATA_DIR = process.env.SINDIKAT_DATA_DIR ?? join(APP, 'data');
const db = openDatabase(DATA_DIR);

const args = process.argv.slice(2);

if (args.includes('--lista')) {
  const rows = db
    .prepare('SELECT id, username, created_at FROM users ORDER BY id')
    .all();
  if (rows.length === 0) console.log('Nema nijednog naloga.');
  for (const row of rows) console.log(`#${row.id}  ${row.username}  (od ${row.created_at.slice(0, 10)})`);
  process.exit(0);
}

const username = args.find((a) => !a.startsWith('--'));

if (!username) {
  console.error('Upotreba: node ops/admin-user.mjs <ime> [--lozinka|--obrisi] | --lista');
  process.exit(1);
}

if (args.includes('--obrisi')) {
  const row = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (!row) {
    console.error(`Nalog "${username}" ne postoji.`);
    process.exit(1);
  }
  // Refuse to leave the panel with no way in.
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM users').get();
  if (n === 1) {
    console.error('Ovo je jedini nalog — napravi drugi pre brisanja.');
    process.exit(1);
  }

  // Sessions cascade on the foreign key; the audit trail is kept on purpose.
  db.prepare('DELETE FROM users WHERE id = ?').run(row.id);
  db.prepare('INSERT INTO audit_log (username, action, detail, ip, at) VALUES (?, ?, ?, ?, ?)').run(
    username,
    'nalog.obrisan',
    'preko konzole',
    null,
    new Date().toISOString(),
  );
  console.log(`Nalog "${username}" je obrisan.`);
  process.exit(0);
}

if (!/^[a-zA-Z0-9._-]{3,32}$/.test(username)) {
  console.error('Ime sme sadržati samo slova, cifre, tačku, crticu i donju crtu (3–32 znaka).');
  process.exit(1);
}

let password;

if (args.includes('--lozinka')) {
  const rl = createInterface({ input: process.stdin, output: process.stderr });
  password = await rl.question('Lozinka: ');
  rl.close();

  const problem = passwordProblem(password);
  if (problem) {
    console.error(problem);
    process.exit(1);
  }
} else {
  // 24 base64url characters ≈ 144 bits. Printed once; nothing stores it.
  password = randomBytes(18).toString('base64url');
}

const now = new Date().toISOString();
const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);

if (existing) {
  db.transaction(() => {
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(password), existing.id);
    // A password reset ends every session on that account — that is usually
    // the reason someone is running this.
    db.prepare('DELETE FROM sessions WHERE user_id = ?').run(existing.id);
  })();
  console.log(`Lozinka naloga "${username}" je promenjena, sve sesije su prekinute.`);
} else {
  db.prepare('INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)').run(
    username,
    hashPassword(password),
    now,
  );
  console.log(`Nalog "${username}" je napravljen.`);
}

db.prepare('INSERT INTO audit_log (username, action, detail, ip, at) VALUES (?, ?, ?, ?, ?)').run(
  username,
  existing ? 'nalog.reset' : 'nalog.kreiran',
  'preko konzole',
  null,
  now,
);

if (!args.includes('--lozinka')) {
  console.log('');
  console.log(`  ime:     ${username}`);
  console.log(`  lozinka: ${password}`);
  console.log('');
  console.log('Zapiši je sada — ne prikazuje se ponovo. Promeni je na /admin/nalog.');
}
