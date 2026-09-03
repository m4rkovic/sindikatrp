import Image from 'next/image';
import { factions } from '@/lib/data/factions';

export function FactionGrid() {
  return (
    <div className="faction-grid">
      {factions.map((faction, index) => (
        <article className={`faction-card faction-card--${index + 1}`} key={faction.file}>
          <Image src={faction.image} fill sizes="(max-width: 900px) 100vw, 50vw" alt={faction.alt} className="faction-card__image" />
          <div className="faction-card__shade" />
          <div className="faction-card__top"><span>{faction.file}</span><span className={faction.tone === 'danger' ? 'text-danger' : ''}>{faction.stamp}</span></div>
          <div className="faction-card__body"><h3>{faction.name}</h3><p>{faction.text}</p></div>
        </article>
      ))}
    </div>
  );
}
