import Link from 'next/link';
import { ArrowRight, Check, ShieldCheck, Sparkles } from 'lucide-react';

export function PricingCard({
  name,
  price,
  description,
  items,
  featured = false,
}: {
  name: string;
  price: string;
  description: string;
  items: string[];
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-6 ${
        featured
          ? 'border-brand-500 bg-brand-500/10 shadow-glow'
          : 'border-slate-800 bg-slate-900/70'
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">{name}</h3>
        {featured && (
          <span className="rounded-full border border-brand-500/40 bg-brand-500/10 px-2 py-1 text-xs font-medium text-brand-200">
            Popular
          </span>
        )}
      </div>

      <div className="mt-6 flex items-end gap-2">
        <span className="text-4xl font-black text-white">{price}</span>
        <span className="mb-1 text-slate-400">/ month</span>
      </div>

      <p className="mt-4 text-slate-300">{description}</p>

      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3 text-slate-200">
            <Check className="h-4 w-4 text-brand-400" />
            {item}
          </li>
        ))}
      </ul>

      <Link
        href="/login"
        className={`mt-8 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 font-semibold text-white transition ${
          featured ? 'bg-brand-500 hover:bg-brand-400' : 'border border-slate-700 bg-slate-950 hover:border-slate-500'
        }`}
      >
        Choose {name}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </div>
  );
}
