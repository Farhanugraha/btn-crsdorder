import { FilterRole, TableColumn } from '../types';

export const ROLE_OPTIONS: { value: FilterRole; label: string; color: string }[] = [
  { value: 'all', label: 'Semua Role', color: 'gray' },
  { value: 'superadmin', label: 'Super Admin', color: 'blue' },
  { value: 'admin', label: 'Admin', color: 'purple' },
  { value: 'user', label: 'User', color: 'emerald' }
];

export const PER_PAGE_OPTIONS = [5, 10, 15, 25, 50, 100];

export const TABLE_COLUMNS: TableColumn[] = [
  { key: 'user', label: 'User', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'divisi', label: 'Divisi', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'created_at', label: 'Bergabung', sortable: true },
  { key: 'actions', label: 'Aksi', sortable: false }
];

export const API_ENDPOINTS = {
  USERS: '/superadmin/users',
  ACTIVATE: (id: number) => `/superadmin/users/${id}/activate`,
  DEACTIVATE: (id: number) => `/superadmin/users/${id}/deactivate`,
  DELETE: (id: number) => `/superadmin/users/${id}`
} as const;

export const MESSAGES = {
  DELETE_SUCCESS: 'User berhasil dihapus',
  ACTIVATE_SUCCESS: 'User berhasil diaktifkan',
  DEACTIVATE_SUCCESS: 'User berhasil dinonaktifkan',
  DELETE_CONFIRM: 'Apakah Anda yakin ingin menghapus pengguna ini?',
  DELETE_WARNING: 'Tindakan ini tidak dapat dibatalkan. Semua data terkait akan dihapus permanen.',
  FETCH_ERROR: 'Gagal mengambil data pengguna',
  UNAUTHORIZED: 'Silakan login terlebih dahulu',
  FORBIDDEN: 'Anda tidak memiliki akses ke halaman ini'
} as const;

export const STATUS_OPTIONS = {
  ACTIVE: { label: 'Aktif', color: 'emerald' },
  INACTIVE: { label: 'Nonaktif', color: 'amber' },
  PENDING: { label: 'Pending', color: 'gray' }
} as const;