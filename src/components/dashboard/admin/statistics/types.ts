export interface PieChartItem {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface RechartsPieDataItem {
  name: string;
  value: number;
  color?: string;
  [key: string]: any; 
}

export interface PieChartData {
  data: PieChartItem[];
  colors: string[];
  percentages: {
    completed: number;
    processing: number;
    canceled: number;
  };
  rechartsData: RechartsPieDataItem[];
}

export interface StatisticsData {
  totalOrders: number;
  totalRevenue: number;
  completedOrders: number;
  processingOrders: number;
  canceledOrders: number;
  averageOrderValue: number;
  todayOrders: number;
  todayRevenue: number;
  revenueGrowth: number;
  orderGrowth: number;
  chartData?: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
}

export type FilterType = 'hari-ini' | 'minggu-ini' | 'bulan-ini' | 'kustom';

export interface FilterDates {
  startDate: string;
  endDate: string;
}

export interface ExpandedSections {
  ringkasan: boolean;
  grafik: boolean;
  status: boolean;
  performa: boolean;
}