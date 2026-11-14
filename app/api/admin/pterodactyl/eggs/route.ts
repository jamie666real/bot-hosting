import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sessionFromRequest } from '@/lib/auth';
import { integrationError, jsonHeaders, panelApplicationRequest } from '@/lib/pterodactyl';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  if (!sessionFromRequest(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: jsonHeaders() });
  const nestId = new URL(request.url).searchParams.get('nestId');
  const parsed = z.coerce.number().int().positive().safeParse(nestId);
  if (!parsed.success) return NextResponse.json({ error: 'A valid nestId is required.' }, { status: 400, headers: jsonHeaders() });
  try {
    const response = await panelApplicationRequest<{ data: Array<{ attributes: { id: number; name: string; docker_image: string; startup: string }; relationships?: { variables?: { data: Array<{ attributes: { name: string; env_variable: string; default_value: string | null; rules: string; user_viewable: boolean; user_editable: boolean } }> } } }> }>(`/nests/${parsed.data}/eggs?include=variables&per_page=100`);
    return NextResponse.json({ eggs: response.data.map(({ attributes, relationships }) => ({
      id: attributes.id,
      name: attributes.name,
      variables: (relationships?.variables?.data ?? []).map(({ attributes: variable }) => ({
        name: variable.name,
        key: variable.env_variable,
        defaultValue: variable.default_value,
        required: variable.rules.split('|').includes('required'),
        editable: variable.user_editable,
      })),
    })) }, { headers: jsonHeaders() });
  } catch (error) {
    const result = integrationError(error);
    return NextResponse.json({ error: result.error }, { status: result.status, headers: jsonHeaders() });
  }
}
