import { Activity } from 'lucide-react';

export function StatsCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-brand-500/10 p-2 text-brand-300">{icon}</div>
        <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Live</span>
      </div>
      <div className="mt-5 text-3xl font-black text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{title}</div>
    </div>
  );
}
