'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  clearFailedLogins,
  clientIp,
  createSession,
  csrfOk,
  destroySession,
  findUser,
  getSession,
  loginBlocked,
  passwordProblem,
  recordFailedLogin,
  setPassword,
  setSessionCookie,
  userAgent,
  verifyPassword,
} from '@/lib/auth';
import { audit, db, nowIso } from '@/lib/db';
import { createPackage, deletePackage, getPackage, move, setVisible, updatePackage } from '@/lib/packages';
import { deleteImage, imageUsageCount, storeUpload, UploadError } from '@/lib/images';
import { parsePackageForm, ValidationError } from '@/lib/validation';

const text = (form: FormData, key: string) => String(form.get(key) ?? '').trim();

async function requireFormSession(form: FormData) {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  if (!csrfOk(session, form.get('csrf'))) throw new Error('Neispravan CSRF token.');
  return session;
}

export async function loginAction(form: FormData) {
  const username = text(form, 'username').slice(0, 60);
  const password = String(form.get('password') ?? '');
  const ip = await clientIp();

  if (loginBlocked(ip)) redirect('/admin/login?error=Previše+pokušaja.+Pokušaj+ponovo+kasnije.');

  const user = findUser(username);
  if (!user || !verifyPassword(password, user.password_hash)) {
    recordFailedLogin(ip, username);
    redirect('/admin/login?error=Pogrešno+ime+ili+lozinka.');
  }

  clearFailedLogins(ip);
  const token = createSession(user.id, ip, await userAgent());
  await setSessionCookie(token);
  db().prepare('UPDATE users SET last_login_at = ? WHERE id = ?').run(nowIso(), user.id);
  audit('prijava.uspešna', '', user.username, ip);
  redirect('/admin');
}

export async function logoutAction(form: FormData) {
  const session = await requireFormSession(form);
  audit('odjava', '', session.user.username, await clientIp());
  await destroySession();
  redirect('/admin/login');
}

export async function togglePackageAction(form: FormData) {
  const session = await requireFormSession(form);
  const id = Number(form.get('id'));
  const pkg = Number.isInteger(id) ? getPackage(id) : null;
  if (pkg) setVisible(id, !pkg.visible, session.user.username, await clientIp());
  revalidatePath('/');
  revalidatePath('/donacije');
  revalidatePath('/admin');
}

export async function movePackageAction(form: FormData) {
  const session = await requireFormSession(form);
  const id = Number(form.get('id'));
  const direction = form.get('direction') === 'down' ? 1 : -1;
  if (Number.isInteger(id)) move(id, direction, session.user.username, await clientIp());
  revalidatePath('/admin');
  revalidatePath('/');
  revalidatePath('/donacije');
}

export async function savePackageAction(form: FormData) {
  const session = await requireFormSession(form);
  const idRaw = text(form, 'id');
  const id = idRaw ? Number(idRaw) : null;
  const existing = id && Number.isInteger(id) ? getPackage(id) : null;
  if (idRaw && !existing) redirect('/admin?error=Paket+ne+postoji.');
  const ip = await clientIp();
  let imageId = existing?.imageId ?? null;
  const oldImageId = imageId;

  try {
    const remove = form.get('remove_image') === 'on';
    if (remove) imageId = null;

    const file = form.get('image');
    if (file instanceof File && file.size > 0) {
      const uploaded = await storeUpload(file, text(form, 'alt').slice(0, 150));
      imageId = uploaded.id;
    }

    const input = parsePackageForm(form, imageId);
    const savedId = existing
      ? (updatePackage(existing.id, input, session.user.username, ip), existing.id)
      : createPackage(input, session.user.username, ip);

    if (oldImageId && oldImageId !== imageId && imageUsageCount(oldImageId) === 0) {
      await deleteImage(oldImageId, session.user.username, ip);
    }

    revalidatePath('/');
    revalidatePath('/donacije');
    revalidatePath('/admin');
    redirect(`/admin/paket/${savedId}?saved=1`);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof UploadError) {
      redirect(`/admin/paket/${existing?.id ?? 'nov'}?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }
}

export async function deletePackageAction(form: FormData) {
  const session = await requireFormSession(form);
  const id = Number(form.get('id'));
  const pkg = Number.isInteger(id) ? getPackage(id) : null;
  if (!pkg) redirect('/admin');
  if (form.get('confirm_delete') !== 'yes') throw new Error('Brisanje nije potvrđeno.');
  const oldImageId = pkg.imageId;
  deletePackage(pkg.id, session.user.username, await clientIp());
  if (oldImageId && imageUsageCount(oldImageId) === 0) await deleteImage(oldImageId, session.user.username, await clientIp());
  revalidatePath('/');
  revalidatePath('/donacije');
  revalidatePath('/admin');
  redirect('/admin');
}

export async function changePasswordAction(form: FormData) {
  const session = await requireFormSession(form);
  const current = String(form.get('current_password') ?? '');
  const next = String(form.get('new_password') ?? '');
  const confirm = String(form.get('confirm_password') ?? '');
  const row = findUser(session.user.username);

  if (!row || !verifyPassword(current, row.password_hash)) redirect('/admin/nalog?error=Trenutna+lozinka+nije+tačna.');
  if (next !== confirm) redirect('/admin/nalog?error=Nove+lozinke+se+ne+poklapaju.');
  const problem = passwordProblem(next);
  if (problem) redirect(`/admin/nalog?error=${encodeURIComponent(problem)}`);

  setPassword(session.user.id, next, session.id);
  audit('nalog.lozinka', 'promenjena', session.user.username, await clientIp());
  redirect('/admin/nalog?saved=1');
}
