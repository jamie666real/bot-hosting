import Link from 'next/link';
import { ArrowRight, Gauge, ShieldCheck, Sparkles } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-black text-white">
            B
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-white">BotHosting</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Cloud platform</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/#features" className="text-sm text-slate-300 hover:text-white">
            Features
          </Link>
          <Link href="/#pricing" className="text-sm text-slate-300 hover:text-white">
            Pricing
          </Link>
          <Link href="/dashboard" className="text-sm text-slate-300 hover:text-white">
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="hidden rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 sm:inline-flex">
            Demo dashboard
          </Link>
          <Link href="/login" className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-400">
            Login
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
