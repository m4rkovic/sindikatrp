export const site = {
  name: 'Sindikat Roleplay',
  shortName: 'SINDIKAT RP',
  url: 'https://sindikatrp.com',
  season: { number: 4, name: 'New Beginning' },
  discord: 'https://discord.gg/sindikatrp',
  copyrightYear: 2026,
} as const;

export const server = {
  online: true,
  maxPlayers: 48,
  cfxJoinCode: '6g6xaj',
  statusUrl: null as string | null,
  fallback: { players: 0, queue: 0 },
} as const;

export const nav = [
  { label: 'Server', href: '/#server' },
  { label: 'Frakcije', href: '/#frakcije' },
  { label: 'Grad', href: '/#grad' },
  { label: 'Arhiva', href: '/#arhiva' },
  { label: 'Pravila', href: '/pravila' },
  { label: 'Donacije', href: '/donacije' },
  { label: 'Kontakt', href: '/kontakt' },
] as const;

const seasonNo = String(site.season.number).padStart(2, '0');
export const seasonCode = `S${seasonNo}`;
export const seasonShort = `${seasonNo} · ${site.season.name}`;

export const REDACTED_CFX = 'cfx.re/join/██████';

export function cfxAddress() {
  return server.cfxJoinCode ? `cfx.re/join/${server.cfxJoinCode}` : REDACTED_CFX;
}

export function cfxJoinUrl() {
  return server.cfxJoinCode ? `https://cfx.re/join/${server.cfxJoinCode}` : null;
}
