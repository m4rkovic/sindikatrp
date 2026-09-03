import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/lib/data/site';
import { ArrowUpRight } from './icons';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div className="site-footer__brand">
          <Image src="/images/logo.png" alt="" width={54} height={54} />
          <div><b>Sindikat Roleplay</b><span>FiveM · Serbia / Balkan</span></div>
        </div>
        <div className="site-footer__links">
          <div><span>Server</span><Link href="/#server">O serveru</Link><Link href="/#frakcije">Frakcije</Link><Link href="/#grad">Grad</Link></div>
          <div><span>Informacije</span><Link href="/pravila">Pravila</Link><Link href="/donacije">Donacije</Link><Link href="/kontakt">Kontakt</Link></div>
          <div><span>Zajednica</span><a href={site.discord} target="_blank" rel="noopener">Discord <ArrowUpRight /></a><Link href="/povezi-se">Poveži se</Link></div>
        </div>
      </div>
      <div className="shell site-footer__bottom"><span>© {site.copyrightYear} Sindikat Roleplay</span><span>Roleplay je bolji kad posledice nisu samo dekoracija.</span></div>
    </footer>
  );
}
