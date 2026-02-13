export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Order {
  id: number;
  order_code: string;
  user_id: number;
  restaurant_id: number;
  total_price: string;
  status: string;
  order_status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}

export interface DashboardData {
  orders: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    canceled: number;
  };
  payments: {
    total_revenue: number;
    pending_payments: number;
  };
  users: {
    total_users: number;
    total_admins: number;
  };
}

export type FilterStatus = 'processing' | 'pending' | 'completed' | 'canceled';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'amber' | 'emerald' | 'green';
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