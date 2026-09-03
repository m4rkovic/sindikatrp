import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;
const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

export function ArrowUpRight(props: Props) {
  return <svg {...base} {...props}><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>;
}
export function ArrowRight(props: Props) {
  return <svg {...base} {...props}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>;
}
export function MenuIcon(props: Props) {
  return <svg {...base} {...props}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
}
export function CloseIcon(props: Props) {
  return <svg {...base} {...props}><path d="m6 6 12 12M18 6 6 18"/></svg>;
}
export function PlayIcon(props: Props) {
  return <svg {...base} {...props}><path d="m8 5 11 7-11 7V5Z"/></svg>;
}
export function ShieldIcon(props: Props) {
  return <svg {...base} {...props}><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z"/><path d="m9.5 12 1.6 1.6 3.6-4"/></svg>;
}
export function UsersIcon(props: Props) {
  return <svg {...base} {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
export function MapIcon(props: Props) {
  return <svg {...base} {...props}><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/></svg>;
}
export function ActivityIcon(props: Props) {
  return <svg {...base} {...props}><path d="M3 12h4l2-7 4 14 2-7h6"/></svg>;
}
export function ChevronUp(props: Props) {
  return <svg {...base} {...props}><path d="m6 15 6-6 6 6"/></svg>;
}
export function ChevronDown(props: Props) {
  return <svg {...base} {...props}><path d="m6 9 6 6 6-6"/></svg>;
}
export function EyeIcon(props: Props) {
  return <svg {...base} {...props}><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></svg>;
}
export function EyeOffIcon(props: Props) {
  return <svg {...base} {...props}><path d="m3 3 18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 4.2A11 11 0 0 1 12 4c6.5 0 10 8 10 8a18 18 0 0 1-2.2 3.3M6.6 6.6C3.6 8.4 2 12 2 12s3.5 8 10 8a10 10 0 0 0 5.4-1.6"/></svg>;
}
export function EditIcon(props: Props) {
  return <svg {...base} {...props}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"/></svg>;
}
export function LogOutIcon(props: Props) {
  return <svg {...base} {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>;
}
