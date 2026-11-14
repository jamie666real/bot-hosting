import { NextResponse } from 'next/server';
import { z } from 'zod';

const botSchema = z.object({
  name: z.string().min(2),
  type: z.string().min(2),
  region: z.string().min(2),
  plan: z.string().min(2),
});

export async function GET() {
  return NextResponse.json({
    bots: [
      { id: 'bot_001', name: 'NovaManager', status: 'online', region: 'Frankfurt', plan: 'Growth' },
      { id: 'bot_002', name: 'RaidGuard', status: 'online', region: 'US East', plan: 'Starter' },
      { id: 'bot_003', name: 'AtlasBot', status: 'offline', region: 'London', plan: 'Growth' },
    ],
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = botSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    bot: {
      id: `bot_${Date.now()}`,
      ...parsed.data,
      status: 'pending',
    },
  });
}
