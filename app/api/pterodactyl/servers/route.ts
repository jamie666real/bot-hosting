import { NextResponse } from 'next/server';
import { authorizePanelRequest, integrationError, jsonHeaders, panelRequest } from '@/lib/pterodactyl';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  if (!authorizePanelRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: jsonHeaders() });
  }

  try {
    const result = await panelRequest<{ data: Array<{ attributes: Record<string, unknown> }> }>('/');
    return NextResponse.json({ data: result.data }, { headers: jsonHeaders() });
  } catch (error) {
    const result = integrationError(error);
    return NextResponse.json({ error: result.error }, { status: result.status, headers: jsonHeaders() });
  }
}
