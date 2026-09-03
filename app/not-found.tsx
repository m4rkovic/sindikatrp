import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="fault">
      <div className="fault__card">
        <span className="fault__code">404</span>
        <h1>Ova stranica ne postoji.</h1>
        <p>Link je pogrešan ili je sadržaj pomeren. Grad pamti sve — ali ovu adresu ne.</p>
        <div className="fault__actions">
          <Link className="btn btn--primary" href="/">Nazad na početnu</Link>
          <Link className="btn btn--glass" href="/povezi-se">Poveži se</Link>
        </div>
      </div>
    </main>
  );
}
