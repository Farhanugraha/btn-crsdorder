import { Metadata } from 'next';
import CreateUserPage from '@/components/dashboard/superadmin/user-management/create';

export const metadata: Metadata = {
  title: 'Tambah Pengguna Baru - Dashboard',
  description: 'Tambah pengguna baru ke sistem'
};

export default function Page() {
  return <CreateUserPage />;
}
