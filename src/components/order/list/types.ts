export interface OrderItem {
  id: number;
  menu_id: number;
  quantity: number;
  price: string;
  menu_name?: string;
  menu_image?: string;
  menu?: {
    name: string;
    price: number;
  };
}

export interface Order {
  id: number;
  order_code: string;
  user_id: number;
  restaurant_id: number;
  total_price: number;
  status: 'pending' | 'paid' | 'canceled';
  order_status: 'processing' | 'completed' | 'canceled';
  notes: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  restaurant_name?: string;
  restaurant?: {
    name: string;
  };
}

export type SortBy = 'newest' | 'oldest' | 'price_high' | 'price_low';
export type DateFilter = 'all' | 'today' | 'yesterday' | 'week' | 'month';
export type StatusTab = 'all' | 'pending' | 'paid' | 'canceled';
export type StatsPeriod = 'today' | 'month' | 'year' | 'all';

export interface OrderFilterType {
  searchQuery: string;
  sortBy: SortBy;
  dateFilter: DateFilter;
  priceRange: [number, number];
  selectedTab: StatusTab;
}