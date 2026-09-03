import type { PackageInput, Period } from './packages';

export class ValidationError extends Error {}

const value = (form: FormData, key: string) => String(form.get(key) ?? '').trim();

export function parsePackageForm(form: FormData, imageId: number | null): PackageInput {
  const name = value(form, 'name');
  if (name.length < 2 || name.length > 80) throw new ValidationError('Naziv paketa mora imati 2–80 znakova.');

  const code = value(form, 'code').slice(0, 24);
  const priceRaw = value(form, 'price').replace(',', '.');
  const price = Number(priceRaw);
  if (!Number.isFinite(price) || price < 0 || price > 100000) throw new ValidationError('Cena nije ispravna.');

  const currency = value(form, 'currency').toUpperCase() || 'EUR';
  if (!/^[A-Z]{3}$/.test(currency)) throw new ValidationError('Valuta mora biti troslovni kod, npr. EUR.');

  const periodValue = value(form, 'period');
  const period: Period = periodValue === 'once' ? 'once' : 'monthly';
  const url = value(form, 'url');
  if (url) {
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
    } catch {
      throw new ValidationError('Link za kupovinu nije ispravan URL.');
    }
  }

  return {
    code,
    name,
    priceCents: Math.round(price * 100),
    currency,
    period,
    perks: value(form, 'perks').slice(0, 4000),
    description: value(form, 'description').slice(0, 2000),
    url,
    imageId,
    featured: form.get('featured') === 'on',
    visible: form.get('visible') === 'on',
  };
}
