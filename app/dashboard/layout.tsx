import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySession } from '@/lib/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!verifySession(cookies().get(SESSION_COOKIE)?.value)) redirect('/login');
  return <div className="min-h-[calc(100vh-72px)]"><div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8"><div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-4"><div><p className="text-sm uppercase tracking-[0.2em] text-slate-400">Private workspace</p><h1 className="mt-1 text-xl font-black text-white">BotHosting Control</h1></div><div className="flex gap-3"><Link className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:text-white" href="/">Website</Link><form action="/api/auth/logout" method="post"><button className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200">Sign out</button></form></div></div></div>{children}</div>;
}
