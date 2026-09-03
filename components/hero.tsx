'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { ServerStatus } from '@/lib/status';
import { seasonCode, seasonShort, server } from '@/lib/data/site';
import { ArrowRight, ArrowUpRight, PlayIcon } from './icons';

const initialStatus: ServerStatus = {
  online: server.online,
  players: 0,
  queue: 0,
  maxPlayers: server.maxPlayers,
  source: 'fallback',
  stale: false,
  fetchedAt: '',
};

export function Hero() {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch('/api/status', { cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json() as ServerStatus;
        if (active) setStatus(data);
      } catch { /* graceful fallback */ }
    };
    load();
    const timer = window.setInterval(load, 30_000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__media" aria-hidden="true">
        <Image src="/images/hero-city.jpg" alt="" fill priority sizes="100vw" className="hero__image" />
        <div className="hero__shade" />
        <div className="hero__glow" />
      </div>

      <div className="shell hero__inner">
        <div className="hero__copy">
          <div className="eyebrow"><span className="status-dot" /> SEZONA {seasonShort}</div>
          <h1 id="hero-title">Grad pamti<br /><span>sve.</span></h1>
          <p>Medium-hard FiveM roleplay gde priča ne nestaje posle restarta. Igraj karakter, gradi reputaciju i živi sa posledicama svojih odluka.</p>
          <div className="hero__actions">
            <Link className="btn btn--primary" href="/povezi-se">Poveži se <ArrowUpRight /></Link>
            <Link className="btn btn--glass" href="/pravila"><PlayIcon /> Kako igramo</Link>
          </div>
        </div>

        <div className="server-card glass-panel">
          <div className="server-card__top">
            <div>
              <span className={`status-pill ${status.online ? 'is-online' : 'is-offline'}`}><i />{status.online ? 'SERVER ONLINE' : 'SERVER OFFLINE'}</span>
              <h2>Večeras u gradu</h2>
            </div>
            <span className="server-card__season">{seasonCode}</span>
          </div>
          <div className="server-card__meter">
            <div className="server-card__numbers"><strong>{status.players}</strong><span>/ {status.maxPlayers}</span></div>
            <div className="meter"><span style={{ width: `${Math.min(100, (status.players / Math.max(1, status.maxPlayers)) * 100)}%` }} /></div>
            <div className="server-card__meta"><span>Igrači online</span><span>{status.queue > 0 ? `${status.queue} u redu` : 'Bez čekanja'}</span></div>
          </div>
          <Link href="/povezi-se" className="server-card__link">Detalji povezivanja <ArrowRight /></Link>
        </div>
      </div>

      <div className="shell hero__foot">
        <div className="hero-stat"><span>01</span><div><b>Medium-hard RP</b><small>priča pre pobede</small></div></div>
        <div className="hero-stat"><span>02</span><div><b>Otvoren pristup</b><small>bez whitelist cirkusa</small></div></div>
        <div className="hero-stat"><span>03</span><div><b>{server.maxPlayers} slotova</b><small>manja, ozbiljnija zajednica</small></div></div>
      </div>
    </section>
  );
}
