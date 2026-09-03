import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { loginAction } from '../actions';
import { getSession } from '@/lib/auth';

export const metadata: Metadata = { title: 'Admin prijava', robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getSession()) redirect('/admin');
  const { error } = await searchParams;
  return (
    <main className="admin-login">
      <div className="admin-login__glow" />
      <section className="admin-login__card">
        <div className="admin-login__brand"><span>S</span><div><b>SINDIKAT</b><small>CONTROL PANEL</small></div></div>
        <div><span className="admin-kicker">SECURE AREA</span><h1>Admin prijava</h1><p>Upravljanje paketima, sadržajem i nalogom.</p></div>
        {error && <div className="admin-alert admin-alert--error">{error}</div>}
        <form action={loginAction} className="admin-form">
          <label><span>Korisničko ime</span><input name="username" autoComplete="username" required autoFocus /></label>
          <label><span>Lozinka</span><input name="password" type="password" autoComplete="current-password" required /></label>
          <button className="admin-button admin-button--primary" type="submit">Prijavi se</button>
        </form>
        <p className="admin-login__note">Prvi nalog se kreira kroz <code>npm run admin:user -- admin</code>.</p>
      </section>
    </main>
  );
}
