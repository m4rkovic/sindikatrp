import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#sadrzaj">Preskoči na sadržaj</a>
      <SiteHeader />
      <main id="sadrzaj">{children}</main>
      <SiteFooter />
    </>
  );
}
