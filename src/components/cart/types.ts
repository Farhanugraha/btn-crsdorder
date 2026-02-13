export interface CartMenu {
  id: number;
  restaurant_id: number;
  name: string;
  price: string;
  image: string;
  is_available: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  cart_id: number;
  menu_id: number;
  quantity: number;
  price: string;
  notes: string;
  created_at: string;
  updated_at: string;
  menu: CartMenu;
}

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  is_open: number;
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: number;
  user_id: number;
  restaurant_id: number;
  created_at: string;
  updated_at: string;
  items: CartItem[];
  restaurant?: Restaurant;
}