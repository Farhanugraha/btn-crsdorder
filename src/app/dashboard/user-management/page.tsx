import { Metadata } from 'next';
import UserManagement from '@/components/dashboard/superadmin/user-management';

export const metadata: Metadata = {
  title: 'Kelola Pengguna - Dashboard',
  description: 'Manajemen pengguna dan hak akses sistem'
};

export default function UserManagementPage() {
  return <UserManagement />;
}
