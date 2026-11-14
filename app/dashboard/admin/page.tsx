export default function AdminPage() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-5">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Administration</p>
        <h2 className="mt-2 text-2xl font-black text-white">Platform controls</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <h3 className="text-lg font-bold text-white">System health</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="flex justify-between"><span>API uptime</span><span className="font-semibold text-emerald-300">99.98%</span></div>
            <div className="flex justify-between"><span>Datacenter</span><span className="font-semibold text-white">Frankfurt</span></div>
            <div className="flex justify-between"><span>Container manager</span><span className="font-semibold text-white">Docker</span></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <h3 className="text-lg font-bold text-white">Recent actions</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div>Bot whitelist updated for premium cluster.</div>
            <div>New security policy pushed to all nodes.</div>
            <div>Automated backup completed successfully.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
