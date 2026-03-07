export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  data_access?: string[];
  divisi?: string | null;
}

export interface Order {
  id: number;
  order_code: string;
  user_id: number;
  restaurant_id: number;
  total_price: string | number;
  status: string; // payment status: pending, paid, canceled
  order_status: string; // order status: processing, completed, canceled
  notes: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    divisi?: string;
  };
  items?: OrderItem[];
  crsd_type?: string;
  items_count?: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_id: number;
  quantity: number;
  price: number;
  notes?: string;
  menu?: {
    id: number;
    name: string;
    restaurant_id: number;
    restaurant?: {
      id: number;
      name: string;
      area_id: number;
      area?: {
        id: number;
        name: string;
        icon?: string;
      };
    };
  };
}

export interface DashboardData {
  orders: {
    total: number;
    pending: number; // payment pending
    processing: number; // order processing
    completed: number; // order completed AND payment paid
    canceled: number; // order canceled OR payment canceled
    today?: number;
    completedToday?: number;
  };
  payments: {
    total_revenue: number;
    pending_payments: number;
    today_revenue?: number;
  };
  users: {
    total_users: number;
    total_admins: number;
  };
}

export interface ReportsData {
  total_orders: number;
  orders_by_status: Array<{
    status: string;
    count: number;
    total: number;
  }>;
  payment_summary: Array<{
    status: string;
    count: number;
    total: number;
  }>;
}

export interface OrdersDetailData {
  period: {
    start_date: string;
    end_date: string;
  };
  summary: {
    total_orders: number;
    total_revenue: number;
    average_order_value: number;
  };
  orders_by_date: OrderByDate[];
}

export interface OrderByDate {
  date: string;
  total_orders: number;
  daily_total: number;
  cumulative_total: number;
  orders: Array<{
    order_id: number;
    order_number: string;
    customer: string;
    order_status: string; 
    payment_status: string; 
    created_at: string;
    total: number;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      subtotal: number;
    }>;
  }>;
}

export interface AvailableDate {
  date: string;
  has_data: boolean;
}

export interface UserData {
  data_access: string[];
  role: string;
  divisi: string | null;
  hasMultipleAccess: boolean;
  defaultModule: string;
}

export type FilterStatus = 'processing' | 'pending' | 'completed' | 'canceled' | 'all';
export type ExportFormat = 'excel' | 'csv' | 'pdf' | 'txt';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'amber' | 'emerald' | 'green' | 'purple' | 'red';
  description: string;
  isLoading?: boolean;
  showTrend?: boolean;
  trendValue?: number;
}

export interface QuickActionItemProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}