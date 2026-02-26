export interface UserDetail {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'user' | 'admin' | 'superadmin';
  divisi: string | null;
  unit_kerja: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
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

export interface UserDetailState {
  user: UserDetail | null;
  loading: boolean;
  error: string | null;
  isDeleting: boolean;
  showDeleteConfirm: boolean;
  showMobileMenu: boolean;
}