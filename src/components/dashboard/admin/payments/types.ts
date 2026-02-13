export interface Payment {
  id: number;
  order_id: number;
  payment_method: 'qris' | 'transfer';
  payment_status: 'pending' | 'completed' | 'rejected';
  transaction_id: string;
  proof_image: string;
  notes: string | null;
  paid_at: string;
  created_at: string;
  updated_at: string;
  order: {
    id: number;
    order_code: string;
    user_id: number;
    total_price: string;
    status: string;
    created_at: string;
    user: {
      id: number;
      name: string;
      email: string;
      phone: string;
    };
  };
}

export type PaymentStatus = 'pending' | 'completed' | 'rejected';
export type PaymentMethod = 'qris' | 'transfer';

export interface DateRange {
  start: string;
  end: string;
}

export interface PaymentsStats {
  total: number;             
  completed: number;         
  rejected: number;          
  totalRevenue: number;      
  
  todayRevenue: number;       
  todayCount: number;         
}

export interface PaymentsFilter {
  search: string;
  datePreset: string;
  dateRange: DateRange;
}