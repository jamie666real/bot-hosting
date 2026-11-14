import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sessionFromRequest, isSameOrigin } from '@/lib/auth';
import { integrationError, jsonHeaders, panelApplicationRequest } from '@/lib/pterodactyl';

export const runtime = 'nodejs';
const schema = z.object({
  name: z.string().trim().min(2).max(64).regex(/^[\w .-]+$/, 'Use letters, numbers, spaces, dots, underscores or hyphens.'),
  locationId: z.number().int().positive(),
  nodeId: z.number().int().positive(),
  nestId: z.number().int().positive(),
  eggId: z.number().int().positive(),
  allocationId: z.number().int().positive(),
  memory: z.number().int().min(128).max(32768),
  disk: z.number().int().min(256).max(100000),
  cpu: z.number().int().min(10).max(10000),
  environment: z.record(z.string().max(4096)).default({}),
});

type EggResponse = { attributes: { name: string; docker_image: string; startup: string }; relationships?: { variables?: { data: Array<{ attributes: { env_variable: string; default_value: string | null; rules: string } }> } } };

export async function POST(request: Request) {
  if (!sessionFromRequest(request) || !isSameOrigin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: jsonHeaders() });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid server configuration.', details: parsed.error.flatten() }, { status: 400, headers: jsonHeaders() });

  const ownerId = Number(process.env.PTERODACTYL_DEFAULT_USER_ID);
  if (!Number.isSafeInteger(ownerId) || ownerId < 1) return NextResponse.json({ error: 'Set PTERODACTYL_DEFAULT_USER_ID to the panel account that owns the managed servers.' }, { status: 503, headers: jsonHeaders() });

  try {
    const { data } = parsed;
    const [nodes, allocations, eggResponse] = await Promise.all([
      panelApplicationRequest<{ data: Array<{ attributes: { id: number; location_id: number; maintenance_mode: boolean } }> }>('/nodes?per_page=100'),
      panelApplicationRequest<{ data: Array<{ attributes: { id: number; assigned: boolean } }> }>(`/nodes/${data.nodeId}/allocations?per_page=100`),
      panelApplicationRequest<{ attributes: EggResponse['attributes']; relationships?: EggResponse['relationships'] }>(`/nests/${data.nestId}/eggs/${data.eggId}?include=variables`),
    ]);
    const node = nodes.data.find(({ attributes }) => attributes.id === data.nodeId)?.attributes;
    if (!node || node.maintenance_mode || node.location_id !== data.locationId) {
      return NextResponse.json({ error: 'Selected node is unavailable or does not belong to that location.' }, { status: 400, headers: jsonHeaders() });
    }
    const allocation = allocations.data.find(({ attributes }) => attributes.id === data.allocationId)?.attributes;
    if (!allocation || allocation.assigned) return NextResponse.json({ error: 'Selected allocation is unavailable.' }, { status: 400, headers: jsonHeaders() });

    const egg = eggResponse;
    if (!egg.attributes?.docker_image || !egg.attributes.startup) return NextResponse.json({ error: 'Selected egg is missing Docker image or startup configuration.' }, { status: 400, headers: jsonHeaders() });
    const variables = egg.relationships?.variables?.data ?? [];
    const allowedKeys = new Set(variables.map(({ attributes }) => attributes.env_variable));
    const unknownKeys = Object.keys(data.environment).filter((key) => !allowedKeys.has(key));
    if (unknownKeys.length) return NextResponse.json({ error: `Unknown environment variable(s): ${unknownKeys.join(', ')}` }, { status: 400, headers: jsonHeaders() });
    const environment: Record<string, string> = {};
    for (const { attributes: variable } of variables) {
      const value = data.environment[variable.env_variable] ?? variable.default_value ?? '';
      if (variable.rules.split('|').includes('required') && !value.trim()) {
        return NextResponse.json({ error: `Required egg variable is missing: ${variable.env_variable}` }, { status: 400, headers: jsonHeaders() });
      }
      environment[variable.env_variable] = value;
    }

    const created = await panelApplicationRequest<{ attributes: { id: number; identifier: string; name: string; uuid: string } }>('/servers', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        user: ownerId,
        egg: data.eggId,
        docker_image: egg.attributes.docker_image,
        startup: egg.attributes.startup,
        environment,
        limits: { memory: data.memory, swap: 0, disk: data.disk, io: 500, cpu: data.cpu },
        feature_limits: { databases: 0, allocations: 1, backups: 1 },
        allocation: { default: data.allocationId },
        deploy: { locations: [data.locationId], dedicated_ip: false, port_range: [] },
        start_on_completion: true,
      }),
    });

    return NextResponse.json({ server: created.attributes, note: 'Created on the panel. Add its identifier to the runtime allowlist, or use PTERODACTYL_ALLOWED_SERVER_IDS=* with a dedicated Client API account.' }, { status: 201, headers: jsonHeaders() });
  } catch (error) {
    const result = integrationError(error);
    return NextResponse.json({ error: result.error }, { status: result.status, headers: jsonHeaders() });
  }
}
