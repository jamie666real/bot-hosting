import Link from 'next/link';
import { Bot, CreditCard, LayoutDashboard, Shield, Users } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/bots', label: 'Bots', icon: Bot },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/admin', label: 'Admin', icon: Shield },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Workspace</p>
          <h1 className="mt-1 text-2xl font-black text-white">BotHosting Control</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-200">
            <Users className="h-4 w-4 text-brand-400" />
            Team plan
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[240px_1fr]">
        <aside className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
          <nav className="space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-200 transition hover:bg-slate-800 hover:text-white"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        <div>{children}</div>
      </div>
    </div>
  );
}
