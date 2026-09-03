import { listAudit } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function AuditPage() {
  const rows = listAudit(150);
  return (
    <main className="admin-content">
      <header className="admin-page-head"><div><span className="admin-kicker">AUDIT LOG</span><h1>Dnevnik</h1><p>Poslednjih 150 promena u panelu. Ne izgleda glamurozno, zato je korisno.</p></div></header>
      <section className="admin-panel admin-panel--table">
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Vreme</th><th>Korisnik</th><th>Akcija</th><th>Detalj</th><th>IP</th></tr></thead><tbody>
          {rows.map((row) => <tr key={row.id}><td>{new Date(row.at).toLocaleString('sr-RS')}</td><td>{row.username ?? '—'}</td><td><code>{row.action}</code></td><td>{row.detail || '—'}</td><td>{row.ip ?? '—'}</td></tr>)}
        </tbody></table></div>
      </section>
    </main>
  );
}
