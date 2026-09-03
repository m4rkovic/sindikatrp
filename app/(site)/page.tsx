import Link from 'next/link';
import { Hero } from '@/components/hero';
import { SectionHeading } from '@/components/section-heading';
import { FactionGrid } from '@/components/faction-grid';
import { CityShowcase } from '@/components/city-showcase';
import { PackageCard } from '@/components/package-card';
import { ArrowRight, ArrowUpRight, MapIcon, ShieldIcon, UsersIcon } from '@/components/icons';
import { principles, seasons, serverFacts, specs } from '@/lib/data/content';
import { listPublic } from '@/lib/packages';
import { site } from '@/lib/data/site';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const packages = listPublic(3);

  return (
    <>
      <Hero />

      <section className="section section--intro" id="server">
        <div className="shell">
          <SectionHeading
            kicker="01 · KAKO IGRAMO"
            title={<>Nije simulator haosa.<br />To je grad koji reaguje.</>}
            text="Medium-hard kod nas ne znači više pravila radi više pravila. Znači da odluke imaju kontinuitet i da drugi ljudi dobijaju prostor da odgovore na njih."
          />

          <div className="principle-grid">
            {principles.map((item, index) => {
              const Icon = [UsersIcon, ShieldIcon, MapIcon][index]!;
              return (
                <article className="principle-card" key={item.title}>
                  <div className="principle-card__icon"><Icon /></div>
                  <span>{item.eyebrow}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>

          <div className="server-profile">
            <div className="server-profile__copy">
              <span className="eyebrow eyebrow--muted">SERVER PROFILE</span>
              <h3>Manja zajednica.<br />Više prostora za priču.</h3>
              <p>48 slotova nije ograničenje koje pokušavamo da sakrijemo. To je izbor. Lakše je zapamtiti ko je kome dužan, ko je kome pomogao i zašto je sledeći susret neprijatan.</p>
              <Link href="/pravila" className="text-link">Pročitaj pravila <ArrowRight /></Link>
            </div>
            <div className="server-profile__facts">
              {serverFacts.map((fact) => <div key={fact.label}><span>{fact.label}</span><b>{fact.value}</b></div>)}
            </div>
          </div>

          <div className="spec-grid">
            {specs.map((spec) => <article key={spec.label}><span>{spec.label}</span><p>{spec.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section section--dark" id="frakcije">
        <div className="shell">
          <SectionHeading
            kicker="02 · FRAKCIJE"
            title={<>Ko drži grad<br />kada niko ne gleda.</>}
            text="Frakcija nije preset karaktera. Ulazak, napredovanje i odnosi dešavaju se u gradu kroz igru."
            aside={<span className="section-index">05 aktivnih sistema</span>}
          />
          <FactionGrid />
        </div>
      </section>

      <section className="section section--city" id="grad">
        <div className="shell">
          <SectionHeading kicker="03 · GRAD" title={<>Jedna mapa.<br />Četiri potpuno različita ritma.</>} text="Grad nije samo backdrop. Lokacija menja ko te vidi, koliko dugo pomoć putuje do tebe i kakvu priču možeš da napraviš." />
        </div>
        <div className="shell shell--wide"><CityShowcase /></div>
      </section>

      <section className="section section--archive" id="arhiva">
        <div className="shell">
          <SectionHeading kicker="04 · ARHIVA" title={<>Četiri sezone.<br />I tragovi koji ostaju.</>} text="Server se menja, ali ne glumi amneziju. Svaka sezona ostavlja pravila, priče i odnose koji utiču na sledeću." />
          <div className="season-grid">
            {seasons.map((season) => (
              <article className={`season-card ${season.status === 'live' ? 'season-card--live' : ''}`} key={season.id}>
                <div className="season-card__head"><span>{season.id}</span><i>{season.status === 'live' ? 'AKTIVNA' : 'ZATVORENA'}</i></div>
                <h3>{season.name}</h3><p>{season.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--support">
        <div className="shell">
          <SectionHeading kicker="05 · PODRŠKA SERVERU" title={<>Podrži infrastrukturu.<br />Ne kupuj prednost.</>} text="Paketi postoje zbog hostinga, licence i skripti. Ono što dobijaš je kozmetika i udobnost, ne ishod scene." aside={<Link className="text-link" href="/donacije">Svi paketi <ArrowRight /></Link>} />
          {packages.length > 0 ? <div className="package-grid">{packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}</div> : <div className="empty-state">Trenutno nema aktivnih paketa.</div>}
        </div>
      </section>

      <section className="join-banner">
        <div className="join-banner__media" />
        <div className="shell join-banner__inner">
          <div><span className="eyebrow">06 · ZAJEDNICA</span><h2>Ne treba ti savršen karakter.<br />Treba ti razlog da ga igraš.</h2><p>Uđi na Discord, pročitaj pravila i kreni od prve scene. Ostalo neka grad reši.</p></div>
          <div className="join-banner__actions"><Link className="btn btn--primary" href="/povezi-se">Poveži se <ArrowUpRight /></Link><a className="btn btn--glass" href={site.discord} target="_blank" rel="noopener">Discord <ArrowUpRight /></a></div>
        </div>
      </section>
    </>
  );
}
