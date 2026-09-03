import type { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { logoutAction } from '../actions';
import { LogOutIcon } from '@/components/icons';

const links = [
  { href: '/admin', label: 'Paketi', icon: 'P' },
  { href: '/admin/dnevnik', label: 'Dnevnik', icon: 'D' },
  { href: '/admin/nalog', label: 'Nalog', icon: 'N' },
];

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand"><span>S</span><div><b>SINDIKAT</b><small>ADMIN</small></div></Link>
        <nav>{links.map((item) => <Link key={item.href} href={item.href}><i>{item.icon}</i>{item.label}</Link>)}</nav>
        <div className="admin-sidebar__bottom">
          <a href="/" target="_blank" rel="noopener">Otvori sajt ↗</a>
          <div className="admin-user"><span>{session.user.username.slice(0, 1).toUpperCase()}</span><div><b>{session.user.username}</b><small>administrator</small></div></div>
          <form action={logoutAction}><input type="hidden" name="csrf" value={session.csrf} /><button type="submit"><LogOutIcon /> Odjava</button></form>
        </div>
      </aside>
      <div className="admin-main"><div className="admin-mobile-bar"><b>SINDIKAT / ADMIN</b><span>{session.user.username}</span></div>{children}</div>
    </div>
  );
}
