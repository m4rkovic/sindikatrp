import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { fallbackSrc } from '@/lib/image-urls';
import { getPackage } from '@/lib/packages';
import { MAX_UPLOAD_BYTES } from '@/lib/images';
import { ImagePreview } from '@/components/admin/image-preview';
import { deletePackageAction, savePackageAction } from '../../../actions';

export const dynamic = 'force-dynamic';

export default async function PackageEditorPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string; saved?: string }> }) {
  const session = (await getSession())!;
  const { id } = await params;
  const query = await searchParams;
  const isNew = id === 'nov';
  const numericId = isNew ? null : Number(id);
  if (!isNew && !Number.isInteger(numericId)) notFound();
  const pkg = numericId ? getPackage(numericId) : null;
  if (!isNew && !pkg) notFound();

  const price = pkg ? (pkg.priceCents / 100).toFixed(pkg.priceCents % 100 ? 2 : 0) : '';
  const initialImage = pkg?.image ? fallbackSrc(pkg.image.basename, pkg.image.widths) : undefined;

  return (
    <main className="admin-content">
      <header className="admin-page-head"><div><span className="admin-kicker">{isNew ? 'NEW PACKAGE' : `PACKAGE #${pkg!.id}`}</span><h1>{isNew ? 'Novi paket' : pkg!.name}</h1><p>{isNew ? 'Dodaj novi paket u katalog. Novi unos ide na kraj liste.' : 'Izmeni cenu, sadržaj, sliku i vidljivost paketa.'}</p></div><Link href="/admin" className="admin-button">← Nazad</Link></header>
      {query.error && <div className="admin-alert admin-alert--error admin-alert--page">{query.error}</div>}
      {query.saved && <div className="admin-alert admin-alert--success admin-alert--page">Promene su sačuvane.</div>}

      <form action={savePackageAction} className="admin-editor">
        <input type="hidden" name="csrf" value={session.csrf}/>
        <input type="hidden" name="id" value={pkg?.id ?? ''}/>

        <section className="admin-panel">
          <div className="admin-panel__head"><div><h2>Osnovno</h2><p>Naziv, cena i način naplate.</p></div></div>
          <div className="admin-form admin-form-grid">
            <label><span>Naziv</span><input name="name" defaultValue={pkg?.name ?? ''} maxLength={80} required/></label>
            <label><span>Kod</span><input name="code" defaultValue={pkg?.code ?? ''} maxLength={24} placeholder="T-01"/></label>
            <label><span>Cena</span><input name="price" inputMode="decimal" defaultValue={price} placeholder="10" required/></label>
            <label><span>Valuta</span><input name="currency" defaultValue={pkg?.currency ?? 'EUR'} maxLength={3} required/></label>
            <label><span>Period</span><select name="period" defaultValue={pkg?.period ?? 'monthly'}><option value="monthly">Mesečno</option><option value="once">Jednokratno</option></select></label>
            <label><span>Link za kupovinu</span><input name="url" type="url" defaultValue={pkg?.url ?? ''} placeholder="https://..."/></label>
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel__head"><div><h2>Sadržaj</h2><p>Jedna pogodnost po redu. Opis je opcion.</p></div></div>
          <div className="admin-form"><label><span>Pogodnosti</span><textarea name="perks" rows={7} defaultValue={pkg?.perksRaw ?? ''}/></label><label><span>Opis</span><textarea name="description" rows={4} defaultValue={pkg?.description ?? ''}/></label></div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel__head"><div><h2>Slika</h2><p>Upload se re-enkoduje u AVIF, WebP i JPG. Maksimalno {Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB.</p></div></div>
          <div className="admin-form"><ImagePreview initialSrc={initialImage} initialAlt={pkg?.image?.alt}/><label><span>Alt tekst</span><input name="alt" defaultValue={pkg?.image?.alt ?? ''} maxLength={150}/></label>{pkg?.image && <label className="admin-check"><input type="checkbox" name="remove_image"/> <span>Ukloni postojeću sliku</span></label>}</div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel__head"><div><h2>Objava</h2><p>Kontrola vidljivosti i istaknutog paketa.</p></div></div>
          <div className="admin-check-grid"><label className="admin-check"><input type="checkbox" name="visible" defaultChecked={pkg?.visible ?? true}/><span><b>Vidljiv na sajtu</b><small>Prikazuje se na landing stranici i /donacije.</small></span></label><label className="admin-check"><input type="checkbox" name="featured" defaultChecked={pkg?.featured ?? false}/><span><b>Istaknut paket</b><small>Dobija vizuelni prioritet u katalogu.</small></span></label></div>
        </section>

        <div className="admin-editor__actions"><button className="admin-button admin-button--primary" type="submit">Sačuvaj paket</button><Link href="/admin" className="admin-button">Odustani</Link></div>
      </form>

      {pkg && <section className="admin-panel admin-danger-zone"><div><span className="admin-kicker">DANGER ZONE</span><h2>Obriši paket</h2><p>Brisanje je trajno. Ako sliku ne koristi drugi paket, brišu se i njeni generisani fajlovi.</p></div><form action={deletePackageAction}><input type="hidden" name="csrf" value={session.csrf}/><input type="hidden" name="id" value={pkg.id}/><label className="admin-check"><input type="checkbox" name="confirm_delete" value="yes" required/><span>Potvrđujem brisanje paketa „{pkg.name}“.</span></label><button className="admin-button admin-button--danger" type="submit">Obriši paket</button></form></section>}
    </main>
  );
}
