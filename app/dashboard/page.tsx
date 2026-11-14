import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySession } from '@/lib/auth';
import { HostingServers } from '@/components/hosting-servers';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  if (!verifySession(cookies().get(SESSION_COOKIE)?.value)) redirect('/login');
  return <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8"><HostingServers /></main>;
}
