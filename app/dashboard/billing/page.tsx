export default function BillingPage() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Billing</p>
        <h2 className="mt-2 text-2xl font-black text-white">Subscription center</h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Current plan</p>
              <h3 className="mt-2 text-3xl font-black text-white">Growth</h3>
            </div>
            <span className="rounded-full border border-brand-500/40 bg-brand-500/10 px-2 py-1 text-xs font-semibold text-brand-200">
              Active
            </span>
          </div>

          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <div className="flex justify-between"><span>Monthly price</span><span className="font-semibold text-white">$19</span></div>
            <div className="flex justify-between"><span>Next invoice</span><span className="font-semibold text-white">22 Nov</span></div>
            <div className="flex justify-between"><span>Deployments</span><span className="font-semibold text-white">12 / 20</span></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <h3 className="text-lg font-bold text-white">Payment methods</h3>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300">
              Visa ending in 4218
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300">
              Billing email: billing@bot-hosting.app
            </div>
          </div>

          <button className="mt-6 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 font-semibold text-white hover:border-slate-500">
            Update payment method
          </button>
        </div>
      </div>
    </div>
  );
}
