'use client';

import { useEffect, useState } from 'react';

type IdName = { id: number; name: string };
type Options = { locations: IdName[]; nests: IdName[]; nodes: Array<IdName & { locationId: number }> };
type Egg = { id: number; name: string; variables: Array<{ name: string; key: string; defaultValue: string | null; required: boolean; editable: boolean }> };
type Allocation = { id: number; ip: string; port: number };

const input = 'mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none focus:border-brand-500';

export function CreateServerForm() {
  const [options, setOptions] = useState<Options>({ locations: [], nests: [], nodes: [] });
  const [eggs, setEggs] = useState<Egg[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [locationId, setLocationId] = useState('');
  const [nodeId, setNodeId] = useState('');
  const [nestId, setNestId] = useState('');
  const [eggId, setEggId] = useState('');
  const [allocationId, setAllocationId] = useState('');
  const [environment, setEnvironment] = useState('{}');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/pterodactyl/options', { cache: 'no-store' }).then(async (response) => {
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Could not load panel options.');
      setOptions(result);
      setLocationId(String(result.locations[0]?.id ?? ''));
      setNestId(String(result.nests[0]?.id ?? ''));
    }).catch((error) => setMessage(error instanceof Error ? error.message : 'Could not load options.')).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!nestId) return;
    setEggId(''); setEggs([]);
    fetch(`/api/admin/pterodactyl/eggs?nestId=${encodeURIComponent(nestId)}`, { cache: 'no-store' }).then(async (response) => {
      const result = await response.json(); if (!response.ok) throw new Error(result.error ?? 'Could not load eggs.');
      setEggs(result.eggs); setEggId(String(result.eggs[0]?.id ?? ''));
    }).catch((error) => setMessage(error instanceof Error ? error.message : 'Could not load eggs.'));
  }, [nestId]);

  useEffect(() => {
    if (!nodeId) return;
    setAllocationId(''); setAllocations([]);
    fetch(`/api/admin/pterodactyl/allocations?nodeId=${encodeURIComponent(nodeId)}`, { cache: 'no-store' }).then(async (response) => {
      const result = await response.json(); if (!response.ok) throw new Error(result.error ?? 'Could not load allocations.');
      setAllocations(result.allocations); setAllocationId(String(result.allocations[0]?.id ?? ''));
    }).catch((error) => setMessage(error instanceof Error ? error.message : 'Could not load allocations.'));
  }, [nodeId]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('');
    const form = new FormData(event.currentTarget);
    let parsedEnvironment: Record<string, string>;
    try {
      parsedEnvironment = JSON.parse(environment);
      if (!parsedEnvironment || Array.isArray(parsedEnvironment) || typeof parsedEnvironment !== 'object' || Object.values(parsedEnvironment).some((value) => typeof value !== 'string')) throw new Error();
    } catch { setMessage('Environment must be a JSON object with string values.'); setBusy(false); return; }
    const payload = {
      name: form.get('name'), locationId: Number(locationId), nodeId: Number(nodeId), nestId: Number(nestId), eggId: Number(eggId), allocationId: Number(allocationId),
      memory: Number(form.get('memory')), disk: Number(form.get('disk')), cpu: Number(form.get('cpu')), environment: parsedEnvironment,
    };
    try {
      const response = await fetch('/api/admin/pterodactyl/servers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Server creation failed.');
      setMessage(`Created ${result.server.name} (${result.server.identifier}). ${result.note}`);
      (event.currentTarget as HTMLFormElement).reset();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Server creation failed.'); }
    finally { setBusy(false); }
  }

  const selectedEgg = eggs.find((egg) => String(egg.id) === eggId);
  const filteredNodes = options.nodes.filter((node) => !locationId || node.locationId === Number(locationId));

  return <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7">
    <div className="mb-6"><p className="text-sm uppercase tracking-[0.2em] text-brand-300">Pterodactyl Application API</p><h2 className="mt-2 text-2xl font-black text-white">Create a bot server</h2><p className="mt-2 text-sm text-slate-400">Provision a server on a selected node using an installed egg. Resource limits are validated server-side.</p></div>
    {message && <p role="status" className="mb-5 break-words rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200">{message}</p>}
    {loading ? <p className="text-slate-300">Loading locations, nodes, and nests…</p> : <form onSubmit={submit} className="space-y-5">
      <label className="block text-sm text-slate-300">Server name<input className={input} name="name" required minLength={2} maxLength={64} pattern="[A-Za-z0-9_ .-]+" placeholder="My Discord bot" /></label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm text-slate-300">Location<select className={input} value={locationId} onChange={(e) => { setLocationId(e.target.value); setNodeId(''); setAllocationId(''); }} required>{options.locations.map((item) => <option key={item.id} value={item.id}>{item.name} (#{item.id})</option>)}</select></label>
        <label className="block text-sm text-slate-300">Node<select className={input} value={nodeId} onChange={(e) => setNodeId(e.target.value)} required><option value="">Select node</option>{filteredNodes.map((item) => <option key={item.id} value={item.id}>{item.name} (#{item.id})</option>)}</select></label>
        <label className="block text-sm text-slate-300">Nest<select className={input} value={nestId} onChange={(e) => setNestId(e.target.value)} required>{options.nests.map((item) => <option key={item.id} value={item.id}>{item.name} (#{item.id})</option>)}</select></label>
        <label className="block text-sm text-slate-300">Egg<select className={input} value={eggId} onChange={(e) => setEggId(e.target.value)} required><option value="">Select egg</option>{eggs.map((item) => <option key={item.id} value={item.id}>{item.name} (#{item.id})</option>)}</select></label>
        <label className="block text-sm text-slate-300 md:col-span-2">Unassigned port allocation<select className={input} value={allocationId} onChange={(e) => setAllocationId(e.target.value)} required><option value="">Select allocation</option>{allocations.map((item) => <option key={item.id} value={item.id}>{item.ip}:{item.port} (#{item.id})</option>)}</select></label>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm text-slate-300">Memory (MB)<input className={input} name="memory" type="number" min="128" max="32768" defaultValue="512" required /></label>
        <label className="block text-sm text-slate-300">Disk (MB)<input className={input} name="disk" type="number" min="256" max="100000" defaultValue="2048" required /></label>
        <label className="block text-sm text-slate-300">CPU limit (%)<input className={input} name="cpu" type="number" min="10" max="10000" defaultValue="100" required /></label>
      </div>
      {selectedEgg?.variables.length ? <div className="rounded-xl border border-slate-800 bg-slate-950 p-4"><p className="mb-2 text-sm font-semibold text-slate-200">Egg environment variables</p><p className="mb-3 text-xs text-slate-400">Defaults are applied automatically. Override only when needed; secrets are sent to Pterodactyl and are not saved by this dashboard.</p><div className="mb-3 flex flex-wrap gap-2">{selectedEgg.variables.map((variable) => <span key={variable.key} className="rounded-md bg-slate-800 px-2 py-1 font-mono text-xs text-slate-300">{variable.key}{variable.required ? ' *' : ''}</span>)}</div><label className="block text-xs text-slate-400">JSON overrides<textarea className={`${input} min-h-24 font-mono`} value={environment} onChange={(e) => setEnvironment(e.target.value)} spellCheck={false} /></label></div> : null}
      <button disabled={busy || loading || !nodeId || !eggId || !allocationId} className="rounded-xl bg-brand-500 px-5 py-3 font-semibold text-white hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'Creating server…' : 'Create server'}</button>
    </form>}
  </section>;
}
