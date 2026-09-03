import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/page-hero';
import { ArrowUpRight } from '@/components/icons';
import { cfxAddress, cfxJoinUrl, site } from '@/lib/data/site';

export const metadata: Metadata = { title: 'Poveži se', description: 'Kako ući na Sindikat Roleplay FiveM server.' };

export default function ConnectPage() {
  const join = cfxJoinUrl();
  const steps = [
    ['Instaliraj FiveM', <>Preuzmi klijent sa <a href="https://fivem.net/" target="_blank" rel="noopener">fivem.net</a>. GTA V mora da bude instaliran i bar jednom pokrenut kroz launcher.</>],
    ['Pročitaj pravila', <>Ne moraš da ih recituješ. Moraš da znaš gde prestaje normalna scena, a počinje prekršaj. <Link href="/pravila">Otvori pravila.</Link></>],
    ['Uđi na Discord', <>Najave, ticketi i komunikacija sa staff-om idu preko <a href={site.discord} target="_blank" rel="noopener">Discorda</a>.</>],
    ['Pokreni server', <>Klikni join link ili otvori F8 konzolu i ukucaj komandu ispod. FiveM će odraditi ostatak.</>],
  ] as const;
  return (
    <>
      <PageHero kicker="POVEŽI SE" title="Četiri koraka do grada." text="Treba ti GTA V na PC-u, FiveM i mikrofon koji ne zvuči kao da je pronađen na dnu Dunava." actions={join && <a className="btn btn--primary" href={join} rel="noopener">Pokreni FiveM <ArrowUpRight /></a>} />
      <section className="section page-section"><div className="shell connect-layout">
        <div className="steps-list">{steps.map(([title, text], index) => <article className="connect-step" key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h2>{title}</h2><p>{text}</p></div></article>)}</div>
        <aside className="connect-card glass-panel"><span>RUČNO POVEZIVANJE</span><h2>F8 konzola</h2><p>Ako join link ne radi, kopiraj komandu direktno u FiveM konzolu.</p><code>connect {cfxAddress()}</code>{join && <a className="btn btn--primary btn--wide" href={join} rel="noopener">Uđi na server <ArrowUpRight /></a>}</aside>
      </div></section>
    </>
  );
}
