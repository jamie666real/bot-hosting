import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'BotHosting — Discord Bot Hosting',
  description: 'Deploy, manage, and scale Discord bots with premium hosting infrastructure.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-100 antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
