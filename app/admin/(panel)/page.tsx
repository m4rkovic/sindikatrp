import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { listAll } from '@/lib/packages';
import { EditIcon, EyeIcon, EyeOffIcon, ChevronDown, ChevronUp } from '@/components/icons';
import { movePackageAction, togglePackageAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function AdminHomePage() {
  const session = (await getSession())!;
  const packages = listAll();
  const visible = packages.filter((pkg) => pkg.visible).length;

  return (
    <main className="admin-content">
      <header className="admin-page-head"><div><span className="admin-kicker">DONATION CATALOG</span><h1>Paketi</h1><p>Javni katalog se čita direktno iz ove baze. Promene su vidljive bez novog build-a.</p></div><Link className="admin-button admin-button--primary" href="/admin/paket/nov">+ Novi paket</Link></header>
      <div className="admin-stats"><article><span>Ukupno</span><b>{packages.length}</b></article><article><span>Objavljeno</span><b>{visible}</b></article><article><span>Sakriveno</span><b>{packages.length - visible}</b></article></div>
      <section className="admin-panel">
        <div className="admin-panel__head"><div><h2>Redosled paketa</h2><p>Strelice menjaju poziciju na landing stranici i /donacije.</p></div></div>
        {packages.length === 0 ? <div className="admin-empty">Nema nijednog paketa.</div> : (
          <div className="admin-package-list">
            {packages.map((pkg, index) => (
              <article className="admin-package-row" key={pkg.id}>
                <div className="admin-package-row__order"><b>{String(index + 1).padStart(2, '0')}</b><div>
                  <form action={movePackageAction}><input type="hidden" name="csrf" value={session.csrf}/><input type="hidden" name="id" value={pkg.id}/><input type="hidden" name="direction" value="up"/><button title="Pomeri gore" disabled={index === 0}><ChevronUp /></button></form>
                  <form action={movePackageAction}><input type="hidden" name="csrf" value={session.csrf}/><input type="hidden" name="id" value={pkg.id}/><input type="hidden" name="direction" value="down"/><button title="Pomeri dole" disabled={index === packages.length - 1}><ChevronDown /></button></form>
                </div></div>
                <div className="admin-package-row__main"><span>{pkg.code || 'BEZ KODA'} · {pkg.periodLabel}</span><h3>{pkg.name}</h3><p>{pkg.price}{pkg.featured ? ' · ISTAKNUT' : ''}</p></div>
                <div className="admin-package-row__status"><span className={pkg.visible ? 'is-live' : 'is-hidden'}>{pkg.visible ? 'OBJAVLJEN' : 'SAKRIVEN'}</span></div>
                <div className="admin-package-row__actions"><form action={togglePackageAction}><input type="hidden" name="csrf" value={session.csrf}/><input type="hidden" name="id" value={pkg.id}/><button title={pkg.visible ? 'Sakrij' : 'Prikaži'}>{pkg.visible ? <EyeOffIcon /> : <EyeIcon />}</button></form><Link href={`/admin/paket/${pkg.id}`} title="Izmeni"><EditIcon /></Link></div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
