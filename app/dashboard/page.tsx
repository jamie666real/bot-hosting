import { Bot, Cpu, Database, Gauge, ShieldCheck, Terminal } from 'lucide-react';
import { dashboardBots, metrics } from '@/lib/mock-data';
import { StatsCard } from '@/components/stats-card';

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Overview</p>
          <h1 className="mt-2 text-3xl font-black text-white">Bot dashboard</h1>
        </div>
        <button className="rounded-xl bg-brand-500 px-4 py-2.5 font-semibold text-white transition hover:bg-brand-400">
          Deploy new bot
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Active bots" value={metrics.activeBots.toString()} icon={<Bot className="h-5 w-5" />} />
        <StatsCard title="Avg. memory" value={metrics.averageMemory} icon={<Cpu className="h-5 w-5" />} />
        <StatsCard title="Connections" value={metrics.connections} icon={<Gauge className="h-5 w-5" />} />
        <StatsCard title="Protected secrets" value={metrics.securedSecrets} icon={<ShieldCheck className="h-5 w-5" />} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Bot fleet</h2>
            <span className="text-sm text-slate-400">Last 7 days</span>
          </div>

          <div className="space-y-4">
            {dashboardBots.map((bot) => (
              <div key={bot.name} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      <h3 className="font-semibold text-white">{bot.name}</h3>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{bot.guilds} guilds • {bot.uptime}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300">{bot.plan}</span>
                    <button className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 hover:border-slate-500">
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="mb-5 flex items-center gap-2 text-white">
            <Terminal className="h-5 w-5 text-brand-400" />
            <h2 className="text-xl font-bold">Recent activity</h2>
          </div>

          <div className="space-y-3 text-sm text-slate-300">
            <div className="rounded-xl bg-slate-950/60 p-3">
              <p className="font-medium text-white">NovaManager</p>
              <p className="mt-1">Released v2.8.4 with improved moderation tasks.</p>
            </div>
            <div className="rounded-xl bg-slate-950/60 p-3">
              <p className="font-medium text-white">RaidGuard</p>
              <p className="mt-1">Container restarted due to high memory spike.</p>
            </div>
            <div className="rounded-xl bg-slate-950/60 p-3">
              <p className="font-medium text-white">AtlasBot</p>
              <p className="mt-1">Backup completed successfully at 03:00 UTC.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
