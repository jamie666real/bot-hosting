import { NextResponse } from 'next/server';
import { sessionFromRequest } from '@/lib/auth';
import { assertAllowedServerId, integrationError, jsonHeaders, panelRequest } from '@/lib/pterodactyl';

export const runtime = 'nodejs';

type PanelServer = { attributes: { identifier: string; name: string; uuid: string; relationships?: { allocations?: { data?: Array<{ attributes: { ip: string; port: number } }> } } } };

export async function GET(request: Request) {
  if (!sessionFromRequest(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: jsonHeaders() });
  try {
    const response = await panelRequest<{ data: PanelServer[] }>('/');
    const servers = response.data
      .filter(({ attributes }) => {
        try { assertAllowedServerId(attributes.identifier); return true; } catch { return false; }
      })
      .map(({ attributes }) => ({
        id: attributes.identifier,
        name: attributes.name,
        address: attributes.relationships?.allocations?.data?.[0]?.attributes,
      }));
    return NextResponse.json({ servers }, { headers: jsonHeaders() });
  } catch (error) {
    const result = integrationError(error);
    return NextResponse.json({ error: result.error }, { status: result.status, headers: jsonHeaders() });
  }
}
