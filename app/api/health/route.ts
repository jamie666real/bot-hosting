import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    app: 'BotHosting',
    uptime: '99.98%',
    timestamp: new Date().toISOString(),
  });
}
