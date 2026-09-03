import { ArrowUpRight } from './icons';
import type { Package } from '@/lib/packages';
import { fallbackSrc, srcset } from '@/lib/image-urls';

export function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <article className={`package-card ${pkg.featured ? 'package-card--featured' : ''}`}>
      {pkg.featured && <span className="package-card__featured">Najpopularnije</span>}
      {pkg.image && (
        <picture className="package-card__image">
          <source type="image/avif" srcSet={srcset(pkg.image.basename, pkg.image.widths, 'avif')} />
          <source type="image/webp" srcSet={srcset(pkg.image.basename, pkg.image.widths, 'webp')} />
          <img src={fallbackSrc(pkg.image.basename, pkg.image.widths)} alt={pkg.image.alt} width={pkg.image.width} height={pkg.image.height} loading="lazy" />
        </picture>
      )}
      <div className="package-card__head">
        <span>{pkg.code || 'PAKET'}</span>
        <span>{pkg.periodLabel}</span>
      </div>
      <h3>{pkg.name}</h3>
      <div className="package-card__price">{pkg.price}</div>
      {pkg.description && <p className="package-card__desc">{pkg.description}</p>}
      {pkg.perks.length > 0 && <ul>{pkg.perks.map((perk) => <li key={perk}>{perk}</li>)}</ul>}
      {pkg.url ? (
        <a className="package-card__cta" href={pkg.url} target="_blank" rel="noopener nofollow">Uzmi paket <ArrowUpRight /></a>
      ) : (
        <span className="package-card__cta package-card__cta--disabled">Uskoro</span>
      )}
    </article>
  );
}
