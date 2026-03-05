export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  token_type?: string;
  expires_in?: number;
  user?: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    phone: string | null;
    divisi: string | null;
    unit_kerja: string | null;
    role: 'user' | 'admin' | 'superadmin';
    created_at: string;
    updated_at: string;
  };
  errors?: Record<string, string[]>;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
}

export type UserRole = 'user' | 'admin' | 'superadmin';