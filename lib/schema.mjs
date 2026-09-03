/**
 * Database schema and connection setup.
 *
 * Plain JavaScript rather than TypeScript so `ops/admin-user.mjs` can import
 * it directly with node, without a build step. That script has to be able to
 * create the first account on a machine where the site has never run — which
 * means it needs the same schema and the same pragmas, from the same file,
 * not a second copy that can drift.
 */

import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

export const SCHEMA_VERSION = 1;

/**
 * Open (creating if needed) the site database.
 *
 * @param {string} dataDir directory holding sindikat.db and uploads/
 * @returns {Database.Database}
 */
export function openDatabase(dataDir) {
  mkdirSync(join(dataDir, 'uploads'), { recursive: true });

  const d = new Database(join(dataDir, 'sindikat.db'));

  // WAL lets a read (a visitor loading /donacije) proceed while a write (the
  // admin saving a package) is in flight, instead of the reader hitting
  // SQLITE_BUSY. synchronous = NORMAL is the documented safe pairing.
  d.pragma('journal_mode = WAL');
  d.pragma('synchronous = NORMAL');
  d.pragma('foreign_keys = ON');
  d.pragma('busy_timeout = 5000');

  migrate(d);
  return d;
}

/** @param {Database.Database} d */
export function migrate(d) {
  const current = d.pragma('user_version', { simple: true }) ?? 0;
  if (current >= SCHEMA_VERSION) return;

  if (current < 1) {
    d.exec(`
      CREATE TABLE users (
        id            INTEGER PRIMARY KEY,
        username      TEXT    NOT NULL UNIQUE COLLATE NOCASE,
        password_hash TEXT    NOT NULL,
        created_at    TEXT    NOT NULL,
        last_login_at TEXT
      );

      -- Sessions store a hash of the cookie value, never the value itself, so
      -- a copy of this file does not hand anyone a working login.
      CREATE TABLE sessions (
        id         TEXT    PRIMARY KEY,
        user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TEXT    NOT NULL,
        expires_at TEXT    NOT NULL,
        ip         TEXT,
        user_agent TEXT
      );
      CREATE INDEX sessions_expires ON sessions(expires_at);

      -- One row per uploaded picture. The basename is the content hash; the
      -- files on disk are basename-width.avif / .webp / .jpg.
      CREATE TABLE images (
        id         INTEGER PRIMARY KEY,
        basename   TEXT    NOT NULL UNIQUE,
        width      INTEGER NOT NULL,
        height     INTEGER NOT NULL,
        bytes      INTEGER NOT NULL,
        -- JSON array of the widths actually written, so a srcset never
        -- advertises a file that a small upload did not produce.
        widths     TEXT    NOT NULL DEFAULT '[]',
        alt        TEXT    NOT NULL DEFAULT '',
        created_at TEXT    NOT NULL
      );

      -- Prices are integer minor units. Storing "5 EUR" as text is what makes
      -- sorting and currency changes painful later.
      CREATE TABLE packages (
        id          INTEGER PRIMARY KEY,
        code        TEXT    NOT NULL,
        name        TEXT    NOT NULL,
        price_cents INTEGER NOT NULL,
        currency    TEXT    NOT NULL DEFAULT 'EUR',
        period      TEXT    NOT NULL DEFAULT 'monthly',
        perks       TEXT    NOT NULL DEFAULT '',
        description TEXT    NOT NULL DEFAULT '',
        url         TEXT    NOT NULL DEFAULT '',
        image_id    INTEGER REFERENCES images(id) ON DELETE SET NULL,
        featured    INTEGER NOT NULL DEFAULT 0,
        visible     INTEGER NOT NULL DEFAULT 1,
        position    INTEGER NOT NULL DEFAULT 0,
        created_at  TEXT    NOT NULL,
        updated_at  TEXT    NOT NULL
      );
      CREATE INDEX packages_order ON packages(visible, position);

      CREATE TABLE login_attempts (
        ip TEXT NOT NULL,
        at TEXT NOT NULL
      );
      CREATE INDEX login_attempts_ip ON login_attempts(ip, at);

      CREATE TABLE audit_log (
        id       INTEGER PRIMARY KEY,
        username TEXT,
        action   TEXT NOT NULL,
        detail   TEXT NOT NULL DEFAULT '',
        ip       TEXT,
        at       TEXT NOT NULL
      );
    `);

    seedPackages(d);
  }

  d.pragma(`user_version = ${SCHEMA_VERSION}`);
}

/**
 * The three tiers the site shipped with, so a fresh install renders the same
 * page it did before the admin panel existed rather than an empty section.
 *
 * @param {Database.Database} d
 */
function seedPackages(d) {
  const now = new Date().toISOString();
  const insert = d.prepare(`
    INSERT INTO packages (code, name, price_cents, currency, period, perks, description, position, created_at, updated_at)
    VALUES (@code, @name, @price_cents, 'EUR', 'monthly', @perks, '', @position, @now, @now)
  `);

  const seed = [
    { code: 'T-01', name: 'Saradnik', price_cents: 500, perks: 'Priority queue\nDiscord rola\nCustom tablica' },
    { code: 'T-02', name: 'Ortak', price_cents: 1000, perks: 'Sve iz T-01\n+1 character slot\nKozmetički vozni slot' },
    { code: 'T-03', name: 'Kum', price_cents: 2000, perks: 'Sve iz T-02\n+2 character slota\nKozmetički paket sezone' },
  ];

  d.transaction(() => {
    seed.forEach((row, i) => insert.run({ ...row, position: i, now }));
  })();
}
