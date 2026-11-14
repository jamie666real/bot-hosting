import { NextResponse } from 'next/server';
import { sessionFromRequest } from '@/lib/auth';
import { integrationError, jsonHeaders, panelApplicationRequest } from '@/lib/pterodactyl';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  if (!sessionFromRequest(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: jsonHeaders() });
  try {
    const [locations, nests, nodes] = await Promise.all([
      panelApplicationRequest<{ data: Array<{ attributes: { id: number; short: string; long: string } }> }>('/locations?per_page=100'),
      panelApplicationRequest<{ data: Array<{ attributes: { id: number; name: string } }> }>('/nests?per_page=100'),
      panelApplicationRequest<{ data: Array<{ attributes: { id: number; name: string; location_id: number; maintenance_mode: boolean } }> }>('/nodes?per_page=100'),
    ]);
    return NextResponse.json({
      locations: locations.data.map(({ attributes }) => ({ id: attributes.id, name: attributes.long || attributes.short })),
      nests: nests.data.map(({ attributes }) => ({ id: attributes.id, name: attributes.name })),
      nodes: nodes.data.filter(({ attributes }) => !attributes.maintenance_mode).map(({ attributes }) => ({ id: attributes.id, name: attributes.name, locationId: attributes.location_id })),
    }, { headers: jsonHeaders() });
  } catch (error) {
    const result = integrationError(error);
    return NextResponse.json({ error: result.error }, { status: result.status, headers: jsonHeaders() });
  }
}
