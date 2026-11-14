'use client';

import { useCallback, useEffect, useState } from 'react';

type Server = { id: string; name: string; address?: { ip: string; port: number } };
type Resource = { attributes?: { current_state?: string; resources?: { memory_bytes?: number; cpu_absolute?: number; disk_bytes?: number } } };

export function HostingServers() {
  const [servers, setServers] = useState<Server[]>([]);
  const [resources, setResources] = useState<Record<string, Resource>>({});
  const [message, setMessage] = useState('Loading Pterodactyl servers…');
  const [pending, setPending] = useState('');

  const load = useCallback(async () => {
    try {
      const response = await fetch('/api/hosting/servers', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Could not load servers.');
      setServers(result.servers);
      setMessage(result.servers.length ? '' : 'No allowlisted servers found. Configure PTERODACTYL_ALLOWED_SERVER_IDS and verify the panel API key.');
      const statuses = await Promise.all(result.servers.map(async (server: Server) => {
        const res = await fetch(`/api/hosting/servers/${encodeURIComponent(server.id)}`, { cache: 'no-store' });
        return [server.id, res.ok ? await res.json() : null] as const;
      }));
      setResources(Object.fromEntries(statuses.filter(([, value]) => value)));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not connect to Pterodactyl.');
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function power(id: string, signal: 'start' | 'stop' | 'restart') {
    setPending(`${id}:${signal}`);
    setMessage('');
    try {
      const response = await fetch(`/api/hosting/servers/${encodeURIComponent(id)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ signal }),
      });
      const result = response.status === 204 ? null : await response.json();
      if (!response.ok) throw new Error(result?.error ?? 'Power action failed.');
      setMessage(`Sent ${signal} command. Refreshing status shortly…`);
      window.setTimeout(() => void load(), 3000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Power action failed.');
    } finally { setPending(''); }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div><p className="text-sm uppercase tracking-[0.2em] text-brand-300">Pterodactyl</p><h2 className="mt-1 text-2xl font-black text-white">Managed bot servers</h2></div>
        <button onClick={() => void load()} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-slate-500">Refresh</button>
      </div>
      {message && <p role="status" className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">{message}</p>}
      {servers.map((server) => {
        const resource = resources[server.id]?.attributes;
        const usage = resource?.resources;
        return <article key={server.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><h3 className="text-lg font-bold text-white">{server.name}</h3><p className="mt-1 text-sm text-slate-400">{server.address ? `${server.address.ip}:${server.address.port}` : `Server ${server.id}`}</p></div>
            <span className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-200">{resource?.current_state ?? 'Status unavailable'}</span>
          </div>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-xl bg-slate-950 p-3 text-slate-300">CPU: {usage?.cpu_absolute?.toFixed(1) ?? '—'}%</div>
            <div className="rounded-xl bg-slate-950 p-3 text-slate-300">Memory: {usage?.memory_bytes == null ? '—' : `${(usage.memory_bytes / 1024 / 1024).toFixed(0)} MB`}</div>
            <div className="rounded-xl bg-slate-950 p-3 text-slate-300">Disk: {usage?.disk_bytes == null ? '—' : `${(usage.disk_bytes / 1024 / 1024).toFixed(0)} MB`}</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(['start', 'restart', 'stop'] as const).map((signal) => <button key={signal} disabled={!!pending} onClick={() => void power(server.id, signal)} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm capitalize text-slate-100 hover:border-brand-500 disabled:opacity-50">{pending === `${server.id}:${signal}` ? 'Sending…' : signal}</button>)}
          </div>
        </article>;
      })}
    </section>
  );
}
