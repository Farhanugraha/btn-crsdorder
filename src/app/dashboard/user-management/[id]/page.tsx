import { Metadata } from 'next';
import UserDetailPage from '@/components/dashboard/superadmin/user-management/detail';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  return {
    title: `Detail Pengguna #${params.id} - Dashboard`,
    description: 'Detail informasi pengguna'
  };
}

export default function Page({ params }: PageProps) {
  return <UserDetailPage />;
}
