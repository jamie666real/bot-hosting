import Link from 'next/link';
import { ArrowRight, Check, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { PricingCard } from '@/components/pricing-card';

const stats = [
  { label: 'Bots deployed', value: '42,000+' },
  { label: 'Uptime SLA', value: '99.9%' },
  { label: 'Avg. launch', value: '< 60s' },
  { label: 'Support response', value: '2 min' },
];

const features = [
  'Instant bot deployment in isolated containers',
  'Automatic environment management and backups',
  'Built-in logs, restarts, and alerts',
  'Discord OAuth login and role-based access',
  'Secure secrets handling and private config',
  'Custom domains and multi-instance scaling',
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1 text-sm text-brand-100">
              <Sparkles className="h-4 w-4" />
              Launch your Discord bot in minutes
            </div>

            <h1 className="max-w-xl text-5xl font-black tracking-tight text-white sm:text-6xl">
              Premium Discord bot hosting for serious communities.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Deploy, update, and monitor your bots with enterprise-grade uptime, built-in security,
              and a dashboard made for teams who want to scale fast.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 font-semibold text-white shadow-glow transition hover:bg-brand-400"
              >
                Start hosting <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-semibold text-slate-100 transition hover:border-slate-500"
              >
                View dashboard
              </Link>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <div className="text-2xl font-black text-white">{item.value}</div>
                  <div className="mt-1 text-xs text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950 p-6 shadow-glow">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Bot status</p>
                  <h2 className="text-xl font-bold text-white">NovaManager</h2>
                </div>
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300">
                  Online
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-slate-900 px-3 py-2">
                  <span className="text-slate-300">CPU</span>
                  <span className="font-semibold text-white">18%</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-900 px-3 py-2">
                  <span className="text-slate-300">RAM</span>
                  <span className="font-semibold text-white">442MB</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-900 px-3 py-2">
                  <span className="text-slate-300">Ping</span>
                  <span className="font-semibold text-white">24ms</span>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-brand-500/20 bg-brand-500/10 p-4">
                <div className="flex items-center gap-2 text-brand-100">
                  <ShieldCheck className="h-4 w-4" />
                  Secure environment active
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  3 private variables protected, hourly backups enabled, auto-restart scheduled.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/60">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {features.map((feature) => (
            <div key={feature} className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <Check className="mt-0.5 h-5 w-5 text-brand-400" />
              <p className="text-slate-200">{feature}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-300">Pricing</p>
          <h2 className="mt-4 text-4xl font-black text-white">Simple plans for every bot owner.</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <PricingCard
            name="Starter"
            price="$9"
            description="Perfect for growing communities and hobby bots."
            items={['1 bot instance', '2GB RAM', 'Unlimited logs', 'Basic support']}
            featured={false}
          />
          <PricingCard
            name="Growth"
            price="$19"
            description="Built for teams shipping production bots at scale."
            items={['Unlimited bots', '8GB RAM', 'Custom domains', 'Priority support']}
            featured={true}
          />
          <PricingCard
            name="Enterprise"
            price="$49"
            description="For large communities and custom infrastructure needs."
            items={['Private cluster', 'Dedicated resources', 'SLA guarantee', 'Account manager']}
            featured={false}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-brand-900/30 via-slate-900 to-slate-950 p-8 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-300">Ready to launch?</p>
              <h3 className="mt-2 text-3xl font-black text-white">Power your Discord bot with a platform built for uptime.</h3>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3 font-semibold text-white transition hover:bg-brand-400"
            >
              Get started today
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
