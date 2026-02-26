import { ReactNode } from 'react';

export interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'user' | 'admin' | 'superadmin';
  divisi: string | null;
  unit_kerja: string | null;
  email_verified_at: string | null;
  created_at: string;
}

export interface AuthInfo {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'superadmin';
  };
}

export interface FetchState {
  loading: boolean;
  error: string | null;
}

export interface StatCardProps {
  label: string;
  count: number;
  Icon: React.FC<{ className?: string }>;
  gradient: string;
  iconBg: string;
  iconRing: string;
  iconColor: string;
  barFrom: string;
  barTo: string;
}

export type FilterRole = 'all' | 'user' | 'admin' | 'superadmin';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export interface DeleteModalProps {
  isOpen: boolean;
  isProcessing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}