import { ReactNode } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  phone: string;
  divisi: string;
  unit_kerja: string;
  role: 'superadmin' | 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface NavigationItem {
  href: string;
  label: string;
  icon: string; 
  roles?: ('superadmin' | 'admin' | 'user' | 'guest')[];
  condition?: (user: User | null) => boolean;
}

export interface RoleConfig {
  color: string;
  label: string;
}