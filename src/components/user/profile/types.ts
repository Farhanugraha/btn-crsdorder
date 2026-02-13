export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  phone: string;
  divisi: string;
  unit_kerja: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileFormData {
  name: string;
  phone: string;
  divisi: string;
  unit_kerja: string;
}

export interface ProfileErrors {
  [key: string]: string[];
}