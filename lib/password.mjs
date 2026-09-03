/**
 * Password hashing.
 *
 * Plain JavaScript so `ops/admin-user.mjs` can produce hashes the running site
 * will accept, from this file rather than from a second implementation. Two
 * copies of a hash format is the kind of duplication that only shows up as a
 * bug on the day someone cannot log in.
 */

import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64, maxmem: 64 * 1024 * 1024 };

/**
 * @param {string} password
 * @returns {string} scrypt$N$r$p$salt$hash, all base64
 */
export function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(password.normalize('NFKC'), salt, SCRYPT.keylen, SCRYPT);
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString('base64')}$${hash.toString('base64')}`;
}

/**
 * @param {string} password
 * @param {string} stored
 * @returns {boolean}
 */
export function verifyPassword(password, stored) {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

  const [, N, r, p, saltB64, hashB64] = parts;
  const expected = Buffer.from(hashB64, 'base64');
  const actual = scryptSync(password.normalize('NFKC'), Buffer.from(saltB64, 'base64'), expected.length, {
    N: Number(N),
    r: Number(r),
    p: Number(p),
    maxmem: SCRYPT.maxmem,
  });

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/**
 * Rejects the passwords that make an admin panel worth attacking.
 *
 * @param {string} password
 * @returns {string | null} the reason, or null when the password is acceptable
 */
export function passwordProblem(password) {
  if (password.length < 12) return 'Lozinka mora imati bar 12 znakova.';
  if (password.length > 200) return 'Lozinka je predugačka.';
  if (/^\d+$/.test(password)) return 'Lozinka ne sme biti samo cifre.';

  const weak = ['password', 'lozinka', 'sindikat', '123456', 'qwerty', 'admin'];
  if (weak.some((w) => password.toLowerCase().includes(w))) {
    return 'Lozinka sadrži previše očigledan niz.';
  }
  return null;
}
