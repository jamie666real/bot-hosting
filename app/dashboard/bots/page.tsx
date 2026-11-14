import { Activity, Download, Globe, Server } from 'lucide-react';
import { botCatalog } from '@/lib/mock-data';

export default function BotsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Bot manager</p>
            <h2 className="mt-2 text-2xl font-black text-white">Your deployed bots</h2>
          </div>
          <button className="rounded-xl bg-brand-500 px-4 py-2.5 font-semibold text-white transition hover:bg-brand-400">
            New bot
          </button>
        </div>

        <div className="grid gap-4">
          {botCatalog.map((bot) => (
            <div key={bot.name} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-brand-500/10 p-2 text-brand-300">
                      <Server className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{bot.name}</h3>
                      <p className="text-sm text-slate-400">{bot.type}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2">
                    <div className="text-slate-400">Status</div>
                    <div className="mt-1 font-semibold text-emerald-300">{bot.status}</div>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2">
                    <div className="text-slate-400">Region</div>
                    <div className="mt-1 font-semibold text-white">{bot.region}</div>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2">
                    <div className="text-slate-400">Uptime</div>
                    <div className="mt-1 font-semibold text-white">{bot.uptime}</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 hover:border-slate-500">
                  <Activity className="h-4 w-4" />
                  View logs
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 hover:border-slate-500">
                  <Globe className="h-4 w-4" />
                  Open domain
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 hover:border-slate-500">
                  <Download className="h-4 w-4" />
                  Export config
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
