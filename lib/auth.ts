import { createHmac, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'bot_hosting_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type Session = { role: 'admin'; exp: number };

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error('SESSION_SECRET must contain at least 32 characters.');
  return value;
}

export function createSession() {
  const payload: Session = { role: 'admin', exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', secret()).update(encoded).digest('base64url');
  return { value: `${encoded}.${signature}`, maxAge: SESSION_TTL_SECONDS };
}

export function verifySession(value?: string | null): boolean {
  if (!value) return false;
  const [encoded, supplied, extra] = value.split('.');
  if (!encoded || !supplied || extra) return false;
  try {
    const expected = createHmac('sha256', secret()).update(encoded).digest();
    const actual = Buffer.from(supplied, 'base64url');
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return false;
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString()) as Session;
    return payload.role === 'admin' && Number.isInteger(payload.exp) && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function sessionFromRequest(request: Request) {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  return verifySession(match ? decodeURIComponent(match.slice(SESSION_COOKIE.length + 1)) : null);
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (!origin || !configured) return false;
  try {
    return new URL(origin).origin === new URL(configured).origin;
  } catch {
    return false;
  }
}

export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}
