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
  is_open: boolean;
  created_at: string;
  area: Area;
}

export interface Menu {
  id: number;
  restaurant_id: number;
  name: string;
  price: number;
  image: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormData {
  name: string;
  price: number | string;
  image: string;
  is_available: boolean;
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

export type FilterStatus = 'all' | 'available' | 'unavailable';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';