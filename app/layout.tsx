import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { site } from '@/lib/data/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Sindikat Roleplay', template: '%s · Sindikat Roleplay' },
  description: 'Srpski FiveM medium-hard roleplay server. Priča, karakter i posledice pre pobede po svaku cenu.',
  alternates: { canonical: './' },
  openGraph: {
    type: 'website',
    locale: 'sr_RS',
    siteName: site.name,
    images: [{ url: '/og.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/favicon.png' },
};

export const viewport: Viewport = { themeColor: '#06090d', colorScheme: 'dark' };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="sr"><body>{children}</body></html>;
}
