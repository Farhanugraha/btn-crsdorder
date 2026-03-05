export interface PaymentItem {
  id: number;
  order_id: number;
  menu_id: number;
  quantity: number;
  price: string;
  notes: string;
  menu: {
    id: number;
    name: string;
    price: string;
    image: string;
  };
}

export interface OrderData {
  id: number;
  order_code: string;
  user_id: number;
  restaurant_id: number;
  total_price: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  items: PaymentItem[];
  restaurant?: {
    id: number;
    name: string;
  };
  area?: {
    id: number;
    name: string;
  };
}

export interface Payment {
  id: number;
  order_id: number;
  payment_method: string;
  payment_status: string;
  transaction_id: string;
  proof_image: string;
  notes: string | null;
  paid_at: string;
  created_at: string;
  updated_at: string;
  order: OrderData;
}

export type PaymentStatus = 'pending' | 'completed' | 'rejected';
export type OrderStatus = 'processing' | 'paid' | 'completed';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}