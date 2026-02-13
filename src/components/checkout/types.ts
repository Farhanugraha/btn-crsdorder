export interface MenuItem {
  id: number;
  name: string;
  price: string;
  restaurant_id: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_id: number;
  quantity: number;
  price: string;
  notes: string;
  menu: MenuItem;
}

export interface Order {
  id: number;
  order_code: string;
  user_id: number;
  restaurant_id: number;
  total_price: number;
  status: string;
  order_status: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  is_open: number;
}

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

export type PaymentMethod = 'qris' | 'transfer';