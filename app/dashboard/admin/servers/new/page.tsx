import { CreateServerForm } from '@/components/create-server-form';

export const dynamic = 'force-dynamic';

export default function ProvisionPage() {
  return <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8"><CreateServerForm /></main>;
}
