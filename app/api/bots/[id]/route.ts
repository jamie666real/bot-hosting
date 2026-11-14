import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({
    id: params.id,
    name: 'NovaManager',
    status: 'online',
    memory: '442MB',
    cpu: '18%',
    uptime: '99.98%',
  });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({
    success: true,
    message: `Bot ${params.id} removed from queue`,
  });
}
