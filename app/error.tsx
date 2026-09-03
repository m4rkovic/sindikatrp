'use client';

import Link from 'next/link';

export default function GlobalErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="fault">
      <div className="fault__card">
        <span className="fault__code">500</span>
        <h1>Nešto je puklo na našoj strani.</h1>
        <p>Greška je zabeležena. Pokušaj ponovo — ako se ponavlja, javi se staff-u na Discordu.</p>
        <div className="fault__actions">
          <button className="btn btn--primary" type="button" onClick={reset}>Pokušaj ponovo</button>
          <Link className="btn btn--glass" href="/">Nazad na početnu</Link>
        </div>
      </div>
    </main>
  );
}
