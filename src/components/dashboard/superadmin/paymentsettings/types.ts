export interface PaymentSettings {
  id: number;
  qris_title: string;
  qris_image: string | null;
  qris_image_url: string | null;
  qris_active: boolean;
  bank_name: string;
  account_number: string;
  account_name: string;
  bank_active: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentFormData {
  qris_title: string;
  qris_active: boolean;
  bank_name: string;
  account_number: string;
  account_name: string;
  bank_active: boolean;
  active: boolean;
  qris_image_file?: File | null;
  qris_image_preview?: string | null;
}

export interface MessageType {
  type: 'success' | 'error' | 'info';
  text: string;
}

export interface User {
  id?: string;
  role?: string;
  email?: string;
  name?: string;
  [key: string]: any;
}