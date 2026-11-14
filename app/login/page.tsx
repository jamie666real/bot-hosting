import Link from 'next/link';
import { ArrowLeft, Bot, Lock, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center justify-center px-4 py-16">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-glow lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-gradient-to-br from-brand-950 to-slate-900 p-8 sm:p-10">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1 text-sm text-brand-100">
            <Bot className="h-4 w-4" />
            Secure access
          </div>

          <h1 className="text-4xl font-black text-white">Manage your bot fleet.</h1>
          <p className="mt-4 max-w-md text-slate-300">
            Sign in to deploy updates, monitor uptime, manage environments, and scale bot operations in a secure control panel.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/60 p-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span className="text-slate-200">Protected secrets with encrypted env variables</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/60 p-3">
              <Lock className="h-5 w-5 text-brand-400" />
              <span className="text-slate-200">Two-factor ready access control</span>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Welcome back</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Sign in</h2>
            </div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
          </div>

          <form className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                defaultValue="owner@bot-hosting.app"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-0 transition focus:border-brand-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                defaultValue="password123"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-0 transition focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-400"
            >
              Sign in to dashboard
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950/60 p-4 text-sm text-slate-300">
            Demo login: use any email and password to access the dashboard experience.
          </div>
        </div>
      </div>
    </main>
  );
}
