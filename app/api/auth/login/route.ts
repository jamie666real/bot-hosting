import { NextResponse } from 'next/server';
import { scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { z } from 'zod';
import { createSession, SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth';

export const runtime = 'nodejs';
const scrypt = promisify(scryptCallback);
const schema = z.object({ password: z.string().min(1).max(1024) });

async function matchesPassword(password: string, stored: string | undefined) {
  if (!stored) return false;
  const [salt, hash, extra] = stored.split(':');
  if (!salt || !hash || extra || !/^[a-f0-9]{64}$/i.test(hash)) return false;
  const derived = (await scrypt(password, salt, 32)) as Buffer;
  const expected = Buffer.from(hash, 'hex');
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

export async function POST(request: Request) {
  const input = schema.safeParse(await request.json().catch(() => null));
  if (!input.success || !(await matchesPassword(input.data.password, process.env.ADMIN_PASSWORD_HASH))) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  try {
    const session = createSession();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, session.value, sessionCookieOptions(session.maxAge));
    return response;
  } catch {
    return NextResponse.json({ error: 'Authentication is not configured. Set SESSION_SECRET.' }, { status: 503 });
  }
}
