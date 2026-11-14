import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySession } from '@/lib/auth';
import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  if (verifySession(cookies().get(SESSION_COOKIE)?.value)) redirect('/dashboard');
  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center justify-center px-4 py-16">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-glow lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-gradient-to-br from-brand-950 to-slate-900 p-8 sm:p-10">
          <div className="mb-8 inline-flex rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1 text-sm text-brand-100">Private control panel</div>
          <h1 className="text-4xl font-black text-white">Manage your bot fleet.</h1>
          <p className="mt-4 max-w-md text-slate-300">Sign in to manage the Pterodactyl servers you have explicitly allowlisted.</p>
        </div>
        <div className="p-8 sm:p-10">
          <div className="mb-8"><p className="text-sm uppercase tracking-[0.2em] text-slate-400">Administrator</p><h2 className="mt-2 text-2xl font-bold text-white">Sign in</h2></div>
          <LoginForm />
          <p className="mt-6 text-sm text-slate-400">Single administrator access. Set ADMIN_PASSWORD_HASH and SESSION_SECRET in your server environment.</p>
          <Link href="/" className="mt-6 inline-block text-sm text-slate-400 hover:text-white">← Home</Link>
        </div>
      </div>
    </main>
  );
}
