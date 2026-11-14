'use client';

import { useState } from 'react';

export function LoginForm() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: form.get('password') }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Sign in failed.');
      window.location.assign('/dashboard');
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Sign in failed.');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">Admin password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-brand-500" />
      </div>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      <button disabled={busy} className="w-full rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-400 disabled:opacity-60">
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
