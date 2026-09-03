import type { ReactNode } from 'react';

export function SectionHeading({ kicker, title, text, aside }: { kicker: string; title: ReactNode; text?: string; aside?: ReactNode }) {
  return (
    <div className="section-heading">
      <div>
        <div className="eyebrow eyebrow--muted">{kicker}</div>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {aside && <div className="section-heading__aside">{aside}</div>}
    </div>
  );
}
