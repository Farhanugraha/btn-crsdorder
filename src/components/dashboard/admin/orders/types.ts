export interface Area {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  order?: number;
}

export interface Restaurant {
  id: number;
  name: string;
  area_id: number;
  area?: Area;
  description?: string;
  address?: string;
  is_open?: boolean;
}

export interface Menu {
  id: number;
  name: string;
  restaurant_id: number;
  restaurant: Restaurant;
  price: string;
}

export interface OrderItem {
  id: number;
  menu_id: number;
  quantity: number;
  price: string;
  notes: string;
  is_checked: number;
  menu: Menu;
}

export interface Order {
  id: number;
  order_code: string;
  user_id: number;
  restaurant_id: number | null;
  total_price: number;
  status: 'pending' | 'paid' | 'canceled';
  order_status: 'processing' | 'completed' | 'canceled';
  notes: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    divisi?: string;
    unit_kerja?: string;
    data_access?: any[];
    role: string;
  };
  items: OrderItem[];
  restaurant?: Restaurant;
  crsd_type?: 'crsd1' | 'crsd2';
  items_count?: number;
  area_name?: string;
  area_icon?: string;
  area?: Area;
  all_restaurants?: Restaurant[];
  all_areas?: Area[];
  restaurants_count?: number;
  areas_count?: number;
}

export type OrderStatusFilter = 'processing' | 'completed' | 'all';
export type DateFilterType = 'today' | 'yesterday' | 'thisWeek' | 'all';
export type CrsdFilterType = 'all' | 'crsd1' | 'crsd2';

export interface FilteredStats {
  totalOrders: number;
  totalRevenue: number;
}