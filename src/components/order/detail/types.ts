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
  status: 'pending' | 'paid' | 'canceled';
  notes: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  phone: string;
  is_open: number;
}

export type OrderStatus = 'pending' | 'paid' | 'canceled';