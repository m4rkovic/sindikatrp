import type { ReactNode } from 'react';

export function PageHero({ kicker, title, text, actions }: { kicker: string; title: string; text: string; actions?: ReactNode }) {
  return (
    <section className="page-hero">
      <div className="page-hero__backdrop" />
      <div className="shell page-hero__inner">
        <div className="eyebrow">{kicker}</div>
        <h1>{title}</h1>
        <p>{text}</p>
        {actions && <div className="page-hero__actions">{actions}</div>}
      </div>
    </section>
  );
}
