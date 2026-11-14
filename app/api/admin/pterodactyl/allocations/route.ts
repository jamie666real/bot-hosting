import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sessionFromRequest } from '@/lib/auth';
import { integrationError, jsonHeaders, panelApplicationRequest } from '@/lib/pterodactyl';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  if (!sessionFromRequest(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: jsonHeaders() });
  const nodeId = z.coerce.number().int().positive().safeParse(new URL(request.url).searchParams.get('nodeId'));
  if (!nodeId.success) return NextResponse.json({ error: 'A valid nodeId is required.' }, { status: 400, headers: jsonHeaders() });
  try {
    const response = await panelApplicationRequest<{ data: Array<{ attributes: { id: number; ip: string; port: number; assigned: boolean } }> }>(`/nodes/${nodeId.data}/allocations?per_page=100`);
    return NextResponse.json({ allocations: response.data.filter(({ attributes }) => !attributes.assigned).map(({ attributes }) => ({ id: attributes.id, ip: attributes.ip, port: attributes.port })) }, { headers: jsonHeaders() });
  } catch (error) {
    const result = integrationError(error);
    return NextResponse.json({ error: result.error }, { status: result.status, headers: jsonHeaders() });
  }
}
