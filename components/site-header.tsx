'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { nav } from '@/lib/data/site';
import { ArrowUpRight, CloseIcon, MenuIcon } from './icons';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className={`site-nav ${scrolled ? 'site-nav--scrolled' : ''}`}>
      <div className="site-nav__inner shell">
        <Link className="brand" href="/" aria-label="Sindikat Roleplay početna" onClick={() => setOpen(false)}>
          <Image className="brand__logo" src="/images/logo.png" width={40} height={40} alt="" priority />
          <span className="brand__copy"><b>SINDIKAT</b><small>ROLEPLAY</small></span>
        </Link>

        <nav className="site-nav__links" aria-label="Glavna navigacija">
          {nav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>

        <Link className="nav-join" href="/povezi-se">Poveži se <ArrowUpRight /></Link>

        <button className="nav-menu" type="button" onClick={() => setOpen((value: boolean) => !value)} aria-expanded={open} aria-label={open ? 'Zatvori meni' : 'Otvori meni'}>
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div className={`mobile-nav ${open ? 'mobile-nav--open' : ''}`} aria-hidden={!open}>
        <div className="mobile-nav__panel shell">
          <div className="mobile-nav__links">
            {nav.map((item, index) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                <span>{String(index + 1).padStart(2, '0')}</span>{item.label}
              </Link>
            ))}
          </div>
          <Link className="btn btn--primary btn--wide" href="/povezi-se" onClick={() => setOpen(false)}>Uđi u grad <ArrowUpRight /></Link>
        </div>
      </div>
    </header>
  );
}
