import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { ArrowUpRight } from '@/components/icons';
import { site } from '@/lib/data/site';

export const metadata: Metadata = { title: 'Kontakt', description: 'Kontakt i podrška za Sindikat Roleplay.' };

const contacts = [
  ['PODRŠKA', 'Ne možeš da uđeš, nešto puca ili ti fali informacija. Ovo je pravi ticket za tehničke i opšte stvari.'],
  ['PRIJAVA IGRAČA', 'Pošalji snimak sa kontekstom, imena likova i približno vreme. Javna rasprava po kanalima nije prijava.'],
  ['FRAKCIJE', 'Organizacija, veća scena, saradnja između sistema ili zahtev koji treba dogovoriti pre nego što se grad zapali.'],
  ['BEZBEDNOST', 'Bag, exploit ili zloupotreba koju ne treba objaviti svima. Pošalji privatno pre nego što neko odluči da bude kreativno glup.'],
] as const;

export default function ContactPage() {
  return (
    <>
      <PageHero kicker="KONTAKT" title="Jedan kanal. Prava kategorija." text="Podrška ide preko Discord ticket sistema. Tako razgovor ostaje privatan, dobija kontekst i može da ga preuzme pravi član staff-a." actions={<a className="btn btn--primary" href={site.discord} target="_blank" rel="noopener">Otvori Discord <ArrowUpRight /></a>} />
      <section className="section page-section"><div className="shell contact-grid">
        {contacts.map(([title, text], index) => <article className="contact-card" key={title}><span>{String(index + 1).padStart(2, '0')}</span><h2>{title}</h2><p>{text}</p><a href={site.discord} target="_blank" rel="noopener">Otvori ticket <ArrowUpRight /></a></article>)}
      </div></section>
    </>
  );
}
