import 'server-only';

import type BetterSqlite3 from 'better-sqlite3';
import { join } from 'node:path';
import { openDatabase } from './schema.mjs';

export const DATA_DIR = process.env.SINDIKAT_DATA_DIR ?? join(process.cwd(), 'data');
export const UPLOAD_DIR = join(DATA_DIR, 'uploads');

let handle: BetterSqlite3.Database | null = null;

export function db(): BetterSqlite3.Database {
  if (!handle) handle = openDatabase(DATA_DIR);
  return handle;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function audit(action: string, detail: string, username: string | null, ip: string | null): void {
  db()
    .prepare('INSERT INTO audit_log (username, action, detail, ip, at) VALUES (?, ?, ?, ?, ?)')
    .run(username, action, detail, ip, nowIso());
}

export interface AuditRow {
  id: number;
  username: string | null;
  action: string;
  detail: string;
  ip: string | null;
  at: string;
}

export function listAudit(limit = 100): AuditRow[] {
  return db()
    .prepare('SELECT id, username, action, detail, ip, at FROM audit_log ORDER BY id DESC LIMIT ?')
    .all(limit) as AuditRow[];
}
