export interface Area {
  id: number;
  name: string;
  icon: string;
}

export interface Restaurant {
  id: number;
  area_id: number;
  name: string;
  description: string;
  address: string;
  photo?: string;
  is_open: number | boolean;
  menus_count: number;
  created_at: string;
  area: Area;
}

export interface FormData {
  area_id: string | number;
  name: string;
  description: string;
  address: string;
  photoFile?: File | null;
  photoPreview?: string | null;
  currentPhoto?: string | null;
  deletePhoto?: boolean;
}

export interface Message {
  type: 'success' | 'error';
  text: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
}

export type ViewMode = 'grid' | 'list';
export type FilterStatus = 'all' | 'open' | 'closed';

export const API_URL = process.env.NEXT_PUBLIC_API_URL;