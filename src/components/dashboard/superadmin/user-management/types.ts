export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'user' | 'admin' | 'superadmin';
  divisi: string | null;
  unit_kerja: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at?: string;
}

export interface AuthData {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'superadmin';
  };
}

export interface PaginatedResponse {
  success: boolean;
  message: string;
  data: {
    data: User[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
}

export type FilterRole = 'all' | 'user' | 'admin' | 'superadmin';

export interface UserFilters {
  search: string;
  role: FilterRole;
  page: number;
  perPage: number;
}

export interface AlertState {
  type: 'success' | 'error' | null;
  message: string | null;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}