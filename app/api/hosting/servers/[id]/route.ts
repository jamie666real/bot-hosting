import { NextResponse } from 'next/server';
import { sessionFromRequest, isSameOrigin } from '@/lib/auth';
import { assertAllowedServerId, integrationError, jsonHeaders, panelRequest } from '@/lib/pterodactyl';

export const runtime = 'nodejs';
type Context = { params: { id: string } };

export async function GET(request: Request, { params }: Context) {
  if (!sessionFromRequest(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: jsonHeaders() });
  try {
    const id = assertAllowedServerId(params.id);
    const result = await panelRequest(`/servers/${encodeURIComponent(id)}/resources`);
    return NextResponse.json(result, { headers: jsonHeaders() });
  } catch (error) {
    const result = integrationError(error);
    return NextResponse.json({ error: result.error }, { status: result.status, headers: jsonHeaders() });
  }
}

export async function POST(request: Request, { params }: Context) {
  if (!sessionFromRequest(request) || !isSameOrigin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: jsonHeaders() });
  }
  const body = await request.json().catch(() => null) as { signal?: string } | null;
  if (!body || !['start', 'stop', 'restart'].includes(body.signal ?? '')) {
    return NextResponse.json({ error: 'Power signal must be start, stop, or restart.' }, { status: 400, headers: jsonHeaders() });
  }
  try {
    const id = assertAllowedServerId(params.id);
    await panelRequest(`/servers/${encodeURIComponent(id)}/power`, {
      method: 'POST',
      body: JSON.stringify({ signal: body.signal }),
    });
    return new NextResponse(null, { status: 204, headers: jsonHeaders() });
  } catch (error) {
    const result = integrationError(error);
    return NextResponse.json({ error: result.error }, { status: result.status, headers: jsonHeaders() });
  }
}
