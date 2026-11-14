import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-5"><p className="text-sm uppercase tracking-[0.2em] text-brand-300">Administration</p><h2 className="mt-2 text-2xl font-black text-white">Platform controls</h2></div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"><h3 className="text-lg font-bold text-white">Pterodactyl provisioning</h3><p className="mt-2 text-sm text-slate-400">Create a server with a chosen location, node, egg, port allocation, and resource limits.</p><Link href="/dashboard/admin/servers/new" className="mt-4 inline-flex rounded-xl bg-brand-500 px-4 py-2.5 font-semibold text-white hover:bg-brand-400">Create server</Link></div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"><h3 className="text-lg font-bold text-white">System health</h3><p className="mt-3 text-sm text-slate-300">Website and bot containers run separately. Use the Pterodactyl panel to check Wings/node health and configure resource limits.</p></div>
      </div>
    </div>
  );
}
