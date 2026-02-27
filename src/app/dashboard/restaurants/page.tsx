import { Metadata } from 'next';
import RestaurantsPage from '@/components/dashboard/superadmin/restaurants';

export const metadata: Metadata = {
  title: 'Manajemen Restoran - Dashboard',
  description: 'Kelola restoran dan tenant di area Anda'
};

export default function Page() {
  return <RestaurantsPage />;
}
