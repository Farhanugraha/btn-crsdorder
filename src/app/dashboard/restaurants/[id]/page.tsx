import { Metadata } from 'next';
import RestaurantDetailPage from '@/components/dashboard/superadmin/restaurants/detail';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  return {
    title: `Detail Restoran #${params.id} - Dashboard`,
    description: 'Detail informasi restoran dan daftar menu'
  };
}

export default function Page({ params }: PageProps) {
  return <RestaurantDetailPage />;
}
