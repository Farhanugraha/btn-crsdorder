import { Metadata } from 'next';
import EditUserPage from '@/components/dashboard/superadmin/user-management/edit';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  return {
    title: `Edit Pengguna #${params.id} - Dashboard`,
    description: 'Edit informasi pengguna'
  };
}

export default function Page({ params }: PageProps) {
  return <EditUserPage />;
}
