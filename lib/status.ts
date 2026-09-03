import { server } from './data/site';

export interface ServerStatus {
  online: boolean;
  players: number;
  queue: number;
  maxPlayers: number;
  source: 'cfx' | 'direct' | 'fallback';
  stale: boolean;
  fetchedAt: string;
}

interface CfxServer {
  Data?: { clients?: number; sv_maxclients?: number | string; svMaxclients?: number | string };
}
interface FiveMDynamic { clients?: number; sv_maxclients?: number | string; players?: number }

const CFX_API = 'https://frontend.cfx-services.net/api/servers/single/';
const CACHE_MS = 20_000;
const STALE_MS = 5 * 60_000;
const TIMEOUT_MS = 4_000;

let cached: { at: number; value: ServerStatus } | null = null;
let lastGood: { at: number; value: ServerStatus } | null = null;

const stamp = () => new Date().toISOString();

function fallback(): ServerStatus {
  return {
    online: server.online,
    players: server.online ? server.fallback.players : 0,
    queue: server.online ? server.fallback.queue : 0,
    maxPlayers: server.maxPlayers,
    source: 'fallback',
    stale: false,
    fetchedAt: stamp(),
  };
}

function normalise(rawPlayers: unknown, rawMax: unknown, source: 'cfx' | 'direct'): ServerStatus {
  const players = Number(rawPlayers ?? 0);
  if (!Number.isFinite(players)) throw new Error('Unparseable player count');
  const max = Number(rawMax);
  const maxPlayers = Number.isFinite(max) && max > 0 ? max : server.maxPlayers;
  return { online: true, players, queue: Math.max(0, players - maxPlayers), maxPlayers, source, stale: false, fetchedAt: stamp() };
}

async function fetchCfx(joinCode: string): Promise<ServerStatus> {
  const response = await fetch(CFX_API + encodeURIComponent(joinCode), {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { accept: 'application/json' },
    cache: 'no-store',
  });
  if (response.status === 404) return { ...fallback(), online: false, players: 0, queue: 0, source: 'cfx' };
  if (!response.ok) throw new Error(`CFX status ${response.status}`);
  const body = (await response.json()) as CfxServer;
  if (!body.Data) throw new Error('CFX payload missing Data');
  return normalise(body.Data.clients, body.Data.sv_maxclients ?? body.Data.svMaxclients, 'cfx');
}

async function fetchDirect(url: string): Promise<ServerStatus> {
  const response = await fetch(new URL('/dynamic.json', url), {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { accept: 'application/json' },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Status ${response.status}`);
  const body = (await response.json()) as FiveMDynamic;
  return normalise(body.clients ?? body.players, body.sv_maxclients, 'direct');
}

export async function getServerStatus(): Promise<ServerStatus> {
  const now = Date.now();
  if (cached && now - cached.at < CACHE_MS) return cached.value;

  let value: ServerStatus;
  if (!server.statusUrl && !server.cfxJoinCode) {
    value = fallback();
  } else {
    try {
      value = server.statusUrl ? await fetchDirect(server.statusUrl) : await fetchCfx(server.cfxJoinCode);
      lastGood = { at: now, value };
    } catch {
      value = lastGood && now - lastGood.at < STALE_MS
        ? { ...lastGood.value, stale: true, fetchedAt: stamp() }
        : { ...fallback(), online: false, players: 0, queue: 0 };
    }
  }
  cached = { at: now, value };
  return value;
}
