import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { PackageCard } from '@/components/package-card';
import { listPublic } from '@/lib/packages';

export const metadata: Metadata = { title: 'Donacije', description: 'Paketi podrške za Sindikat Roleplay bez pay-to-win prednosti.' };
export const dynamic = 'force-dynamic';

export default function DonationsPage() {
  const packages = listPublic();
  return (
    <>
      <PageHero kicker="PODRŠKA SERVERU" title="Plaćaš hosting, ne pobedu." text="Donacije pokrivaju infrastrukturu, licence i razvoj. Paketi mogu da donesu kozmetiku i udobnost, ali ne oružje, novac ili lakši ishod scene." />
      <section className="section page-section"><div className="shell">
        {packages.length ? <div className="package-grid package-grid--page">{packages.map((pkg) => <PackageCard pkg={pkg} key={pkg.id} />)}</div> : <div className="empty-state">Trenutno nema aktivnih paketa.</div>}
        <div className="info-grid">
          <article><span>01</span><h2>Nema pay-to-win</h2><p>Donator prolazi kroz ista pravila, iste kazne i isti RP kao svaki drugi igrač. Paket ne kupuje imunitet.</p></article>
          <article><span>02</span><h2>Plaćanje preko Tebex-a</h2><p>Uplate na privatne račune nisu zvaničan kanal. Ako ih neko traži u ime servera, prijavi poruku staff-u.</p></article>
          <article><span>03</span><h2>Otkazivanje bez drame</h2><p>Pretplata može da se otkaže kroz platformu za naplatu. Plaćeni period ostaje aktivan do isteka.</p></article>
        </div>
      </div></section>
    </>
  );
}
