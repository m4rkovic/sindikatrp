import 'server-only';

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { chmodSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cookies, headers } from 'next/headers';
import { audit, db, DATA_DIR, nowIso } from './db';
import { hashPassword, passwordProblem, verifyPassword } from './password.mjs';

export { hashPassword, passwordProblem, verifyPassword };

let secretCache: Buffer | null = null;
function secret(): Buffer {
  if (secretCache) return secretCache;
  const path = join(DATA_DIR, 'secret.key');
  try {
    secretCache = readFileSync(path);
  } catch {
    secretCache = randomBytes(32);
    writeFileSync(path, secretCache, { mode: 0o600 });
    chmodSync(path, 0o600);
  }
  return secretCache;
}

const hmac = (domain: string, value: string, encoding: 'hex' | 'base64url') =>
  createHmac('sha256', secret()).update(domain).update('\0').update(value).digest(encoding);

export const SESSION_COOKIE = 'sindikat_sid';
const SESSION_DAYS = 7;
const MAX_ATTEMPTS = 8;
const MAX_ATTEMPTS_GLOBAL = 60;
const ATTEMPT_WINDOW_MIN = 15;

// Bez reverse proxy-ja nema pouzdane IP adrese, pa svi pokušaji padaju u
// zajedničku 'unknown' kofu — throttle tada i dalje važi, samo je grublji.
const attemptKey = (ip: string | null) => ip ?? 'unknown';

export interface User { id: number; username: string }
export interface Session { id: string; user: User; csrf: string }

export function userCount(): number {
  return (db().prepare('SELECT COUNT(*) AS n FROM users').get() as { n: number }).n;
}

export function findUser(username: string): (User & { password_hash: string }) | null {
  return (db().prepare('SELECT id, username, password_hash FROM users WHERE username = ?').get(username.trim()) as (User & { password_hash: string }) | undefined) ?? null;
}

export function createUser(username: string, password: string): number {
  const result = db().prepare('INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)').run(username.trim(), hashPassword(password), nowIso());
  return Number(result.lastInsertRowid);
}

export function setPassword(userId: number, password: string, keepSessionId?: string): void {
  const d = db();
  d.transaction(() => {
    d.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(password), userId);
    if (keepSessionId) d.prepare('DELETE FROM sessions WHERE user_id = ? AND id != ?').run(userId, keepSessionId);
    else d.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
  })();
}

const sessionKey = (token: string) => hmac('session', token, 'hex');
const csrfToken = (token: string) => hmac('csrf', token, 'base64url');

export function createSession(userId: number, ip: string | null, userAgent: string | null): string {
  const token = randomBytes(32).toString('base64url');
  const expires = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  db().prepare(
    'INSERT INTO sessions (id, user_id, created_at, expires_at, ip, user_agent) VALUES (?, ?, ?, ?, ?, ?)',
  ).run(sessionKey(token), userId, nowIso(), expires.toISOString(), ip, userAgent?.slice(0, 300) ?? null);
  db().prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run();
  return token;
}

export function readSessionToken(token?: string | null): Session | null {
  if (!token) return null;
  const row = db().prepare(`
    SELECT s.id, u.id AS user_id, u.username
      FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.id = ? AND s.expires_at > datetime('now')
  `).get(sessionKey(token)) as { id: string; user_id: number; username: string } | undefined;
  if (!row) return null;
  return { id: row.id, user: { id: row.user_id, username: row.username }, csrf: csrfToken(token) };
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  return readSessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DAYS * 86_400,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) db().prepare('DELETE FROM sessions WHERE id = ?').run(sessionKey(token));
  store.delete(SESSION_COOKIE);
}

export function csrfOk(session: Session | null, submitted: FormDataEntryValue | null): boolean {
  if (!session || typeof submitted !== 'string' || submitted.length === 0) return false;
  const a = Buffer.from(session.csrf);
  const b = Buffer.from(submitted);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function loginBlocked(ip: string | null): boolean {
  const window = `-${ATTEMPT_WINDOW_MIN} minutes`;
  const perIp = db().prepare(`
    SELECT COUNT(*) AS n FROM login_attempts
     WHERE ip = ? AND at > datetime('now', ?)
  `).get(attemptKey(ip), window) as { n: number };
  if (perIp.n >= MAX_ATTEMPTS) return true;

  // IP header je lako lažirati kada aplikacija nije iza proxy-ja, pa
  // rotiranje adresa ne sme da zaobiđe limit — ukupan broj pokušaja u
  // prozoru ima svoj plafon nezavisno od adrese.
  const total = db().prepare(`
    SELECT COUNT(*) AS n FROM login_attempts WHERE at > datetime('now', ?)
  `).get(window) as { n: number };
  return total.n >= MAX_ATTEMPTS_GLOBAL;
}

export function recordFailedLogin(ip: string | null, username: string): void {
  db().prepare('INSERT INTO login_attempts (ip, at) VALUES (?, ?)').run(attemptKey(ip), nowIso());
  db().prepare("DELETE FROM login_attempts WHERE at < datetime('now', '-1 day')").run();
  audit('prijava.neuspešna', username.slice(0, 60), null, ip);
}

export function clearFailedLogins(ip: string | null): void {
  db().prepare('DELETE FROM login_attempts WHERE ip = ?').run(attemptKey(ip));
}

export async function clientIp(): Promise<string | null> {
  const h = await headers();
  return h.get('cf-connecting-ip')?.trim() || h.get('x-real-ip')?.trim() || null;
}

export async function userAgent(): Promise<string | null> {
  const h = await headers();
  return h.get('user-agent');
}
