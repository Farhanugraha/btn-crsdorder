export interface UserDetail {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'user' | 'admin' | 'superadmin';
  divisi: string | null;
  unit_kerja: string | null;
  data_access: string | null;
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

export interface UpdateUserData {
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin' | 'superadmin';
  divisi: string;
  unit_kerja: string;
  data_access?: string;
}

export interface PasswordData {
  password: string;
  password_confirmation: string;
}

export interface DivisionOption {
  code: string;
  name: string;
  description: string;
  isAllOption?: boolean;
}

export interface FormState {
  loading: boolean;
  updating: boolean;
  error: string | null;
  successMessage: string | null;
}

export interface DivisionInputState {
  selectedDivisions: string[];
  showDivisionSelector: boolean;
  customDivisi: string;
  isCustomDivisi: boolean;
}

export const DIVISI_OPTIONS = [
  { value: 'CRSD 1', label: 'CRSD 1' },
  { value: 'CRSD 2', label: 'CRSD 2' },
  { value: 'LAINNYA', label: 'Lainnya' }
];