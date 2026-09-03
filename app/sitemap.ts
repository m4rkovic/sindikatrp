import type { MetadataRoute } from 'next';
import { site } from '@/lib/data/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '',
    '/pravila',
    '/donacije',
    '/kontakt',
    '/povezi-se',
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));
}
