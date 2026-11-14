import { timingSafeEqual } from 'node:crypto';

const API_VERSION = 'Application/vnd.pterodactyl.v1+json';

export class PterodactylError extends Error {
  constructor(message: string, public readonly status = 502) { super(message); this.name = 'PterodactylError'; }
}

function config() {
  const panelUrl = process.env.PTERODACTYL_PANEL_URL?.trim().replace(/\/+$/, '');
  const apiKey = process.env.PTERODACTYL_CLIENT_API_KEY?.trim();
  const accessToken = process.env.BOT_HOSTING_API_TOKEN?.trim();
  const allowedIds = (process.env.PTERODACTYL_ALLOWED_SERVER_IDS ?? '').split(',').map((id) => id.trim().toLowerCase()).filter(Boolean);
  if (!panelUrl || !apiKey) throw new PterodactylError('Pterodactyl integration is not configured.', 503);
  let parsedUrl: URL;
  try { parsedUrl = new URL(panelUrl); } catch { throw new PterodactylError('PTERODACTYL_PANEL_URL must be a valid URL.', 503); }
  if (!['https:', 'http:'].includes(parsedUrl.protocol) || parsedUrl.username || parsedUrl.password) throw new PterodactylError('PTERODACTYL_PANEL_URL must use HTTP(S) and contain no credentials.', 503);
  if (parsedUrl.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(parsedUrl.hostname)) throw new PterodactylError('Use HTTPS for a remotely accessible Pterodactyl panel.', 503);
  return { panelUrl, apiKey, accessToken, allowedIds: new Set(allowedIds) };
}

export function authorizePanelRequest(request: Request): boolean {
  let expected: string;
  try { expected = config().accessToken ?? ''; } catch { return false; }
  if (!expected) return false;
  const match = /^Bearer\s+(.+)$/i.exec(request.headers.get('authorization') ?? '');
  if (!match) return false;
  const actualBytes = Buffer.from(match[1]); const expectedBytes = Buffer.from(expected);
  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
}

export function assertAllowedServerId(serverId: string): string {
  const normalized = serverId.toLowerCase();
  if (!/^[a-z0-9]{1,64}$/.test(normalized)) throw new PterodactylError('Invalid Pterodactyl server identifier.', 400);
  const { allowedIds } = config();
  if (!allowedIds.has('*') && !allowedIds.has(normalized)) throw new PterodactylError('This server is not in PTERODACTYL_ALLOWED_SERVER_IDS.', 404);
  return normalized;
}

export async function panelRequest<T>(path: string, init?: RequestInit): Promise<T> {
  return requestPanel<T>(`/api/client${path}`, process.env.PTERODACTYL_CLIENT_API_KEY?.trim(), init);
}

export async function panelApplicationRequest<T>(path: string, init?: RequestInit): Promise<T> {
  return requestPanel<T>(`/api/application${path}`, process.env.PTERODACTYL_APPLICATION_API_KEY?.trim(), init);
}

async function requestPanel<T>(path: string, apiKey: string | undefined, init?: RequestInit): Promise<T> {
  const { panelUrl } = config();
  if (!apiKey) throw new PterodactylError('The required Pterodactyl API key is not configured.', 503);
  let response: Response;
  try {
    response = await fetch(`${panelUrl}${path}`, {
      ...init, cache: 'no-store', signal: AbortSignal.timeout(15_000),
      headers: { Accept: `${API_VERSION}, application/json`, Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch { throw new PterodactylError('Could not connect to the Pterodactyl panel.', 502); }
  if (!response.ok) {
    const status = response.status === 404 ? 404 : response.status === 422 ? 400 : response.status === 429 ? 503 : 502;
    throw new PterodactylError(`Pterodactyl API request failed (HTTP ${response.status}).`, status);
  }
  try { return (await response.json()) as T; } catch { throw new PterodactylError('Pterodactyl returned an invalid response.', 502); }
}

export function integrationError(error: unknown) {
  if (error instanceof PterodactylError) return { error: error.message, status: error.status };
  return { error: 'Unexpected hosting integration error.', status: 500 };
}
export function jsonHeaders() { return { 'Cache-Control': 'no-store' }; }
