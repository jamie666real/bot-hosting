import { NextResponse } from 'next/server';
import {
  assertAllowedServerId,
  authorizePanelRequest,
  integrationError,
  jsonHeaders,
  panelRequest,
} from '@/lib/pterodactyl';

export const runtime = 'nodejs';

type RouteContext = { params: { id: string } };

export async function GET(request: Request, { params }: RouteContext) {
  if (!authorizePanelRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: jsonHeaders() });
  }

  try {
    const id = assertAllowedServerId(params.id);
    const result = await panelRequest(`/servers/${encodeURIComponent(id)}/resources`);
    return NextResponse.json(result, { headers: jsonHeaders() });
  } catch (error) {
    const result = integrationError(error);
    return NextResponse.json({ error: result.error }, { status: result.status, headers: jsonHeaders() });
  }
}
