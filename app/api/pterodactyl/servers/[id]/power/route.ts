import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  assertAllowedServerId,
  authorizePanelRequest,
  integrationError,
  jsonHeaders,
  panelRequest,
} from '@/lib/pterodactyl';

export const runtime = 'nodejs';

type RouteContext = { params: { id: string } };
const powerSchema = z.object({ signal: z.enum(['start', 'stop', 'restart']) });

export async function POST(request: Request, { params }: RouteContext) {
  if (!authorizePanelRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: jsonHeaders() });
  }

  const parsed = powerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'signal must be start, stop, or restart.' }, { status: 400, headers: jsonHeaders() });
  }

  try {
    const id = assertAllowedServerId(params.id);
    await panelRequest(`/servers/${encodeURIComponent(id)}/power`, {
      method: 'POST',
      body: JSON.stringify({ signal: parsed.data.signal }),
    });
    return new NextResponse(null, { status: 204, headers: jsonHeaders() });
  } catch (error) {
    const result = integrationError(error);
    return NextResponse.json({ error: result.error }, { status: result.status, headers: jsonHeaders() });
  }
}
