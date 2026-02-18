export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  order_id: number;
  order_number: string;
  customer: string;
  status: string;
  items: OrderItem[];
  total: number;
  created_at: string;
}

export interface OrderByDate {
  date: string;
  total_orders: number;
  daily_total: number;
  cumulative_total: number;
  orders: Order[];
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

export interface DashboardData {
  orders: {
    total: number;
  };
  payments: {
    total_revenue: number;
  };
}

export interface ReportsData {
  total_orders: number;
  orders_by_status: Array<{
    status: string;
    total: number;
  }>;
  payment_summary: Array<{
    status: string;
    total: number;
    total_amount: number;
  }>;
}

export type ExportFormat = 'csv' | 'pdf' | 'excel' | 'txt';

export interface ModuleColors {
  bg: string;
  text: string;
  border: string;
}

export interface UserData {
  data_access: string[];
  role: string;
  divisi: string | null;
  hasMultipleAccess: boolean;
  defaultModule: string;
}

export interface AvailableDate {
  date: string;
  has_data: boolean;
}