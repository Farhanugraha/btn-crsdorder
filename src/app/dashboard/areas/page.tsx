import { Metadata } from 'next';
import AreasPage from '@/components/dashboard/superadmin/areas';

export const metadata: Metadata = {
  title: 'Manajemen Area - Dashboard',
  description: 'Kelola area dan lokasi bisnis Anda'
};

export default function Page() {
  return <AreasPage />;
}
