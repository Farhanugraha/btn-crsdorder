export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  divisi?: string;
  unit_kerja?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
}

export interface DivisiOption {
  value: string;
  label: string;
}

export type RegisterStep = 'form' | 'loading' | 'success' | 'error';