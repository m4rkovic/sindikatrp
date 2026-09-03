import { getSession } from '@/lib/auth';
import { changePasswordAction } from '../../actions';

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const session = (await getSession())!;
  const query = await searchParams;
  return (
    <main className="admin-content">
      <header className="admin-page-head"><div><span className="admin-kicker">ACCOUNT SECURITY</span><h1>Nalog</h1><p>Promena lozinke prekida sve druge aktivne sesije ovog naloga.</p></div></header>
      <section className="admin-panel admin-panel--narrow">
        {query.error && <div className="admin-alert admin-alert--error">{query.error}</div>}
        {query.saved && <div className="admin-alert admin-alert--success">Lozinka je promenjena.</div>}
        <form action={changePasswordAction} className="admin-form">
          <input type="hidden" name="csrf" value={session.csrf}/>
          <label><span>Trenutna lozinka</span><input name="current_password" type="password" autoComplete="current-password" required/></label>
          <div className="admin-form-grid"><label><span>Nova lozinka</span><input name="new_password" type="password" autoComplete="new-password" minLength={12} required/></label><label><span>Ponovi novu lozinku</span><input name="confirm_password" type="password" autoComplete="new-password" minLength={12} required/></label></div>
          <p className="admin-hint">Minimum 12 znakova. Izbegavaj očigledne nizove i ime servera.</p>
          <button type="submit" className="admin-button admin-button--primary">Promeni lozinku</button>
        </form>
      </section>
    </main>
  );
}
