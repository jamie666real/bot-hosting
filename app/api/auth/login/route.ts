import { NextResponse } from 'next/server';
import { scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { z } from 'zod';
import { createSession, SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
const scrypt = promisify(scryptCallback);
const schema = z.object({ email: z.string().email().max(254), password: z.string().min(1).max(1024) });

async function matchesPassword(password: string, stored: string) {
  const [salt, hash, extra] = stored.split(':');
  if (!salt || !hash || extra || !/^[a-f0-9]{64}$/i.test(hash)) return false;
  const derived = (await scrypt(password, salt, 32)) as Buffer;
  const expected = Buffer.from(hash, 'hex');
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

export async function POST(request: Request) {
  const input = schema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  const email = input.data.email.trim().toLowerCase();

  try {
    const admin = await prisma.adminAccount.findUnique({ where: { email } });
    if (!admin || !(await matchesPassword(input.data.password, admin.passwordHash))) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }
    const session = createSession(admin.id, admin.email);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, session.value, sessionCookieOptions(session.maxAge));
    return response;
  } catch {
    return NextResponse.json({ error: 'Authentication is unavailable. Check the database and session configuration.' }, { status: 503 });
  }
}
