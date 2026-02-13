import { Payment, DateRange, PaymentsStats } from '../types';

// ============= FORMATTERS =============
export const formatCurrency = (amount: number): string => {
  if (amount >= 1000000000) {
    return `Rp ${(amount / 1000000000).toFixed(1)}M`;
  }
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1)}jt`;
  }
  if (amount >= 1000) {
    return `Rp ${(amount / 1000).toFixed(0)}k`;
  }
  return `Rp ${amount.toLocaleString('id-ID')}`;
};

export const formatFullCurrency = (amount: number): string => {
  return `Rp ${amount.toLocaleString('id-ID')}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short'
  });
};

export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

// ============= FILTER FUNCTIONS =============
export const filterPaymentsBySearch = (payments: Payment[], searchQuery: string): Payment[] => {
  if (!searchQuery.trim()) return payments;
  
  const query = searchQuery.toLowerCase();
  return payments.filter(p => 
    p.transaction_id.toLowerCase().includes(query) ||
    p.order.order_code.toLowerCase().includes(query) ||
    p.order.user.name.toLowerCase().includes(query) ||
    p.order.user.email.toLowerCase().includes(query)
  );
};

export const filterPaymentsByDatePreset = (payments: Payment[], preset: string): Payment[] => {
  if (preset === 'all') return payments;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  const thisWeek = new Date(today);
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  thisWeek.setDate(diff);
  thisWeek.setHours(0, 0, 0, 0);
  
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  return payments.filter(p => {
    const paymentDate = new Date(p.created_at);
    paymentDate.setHours(0, 0, 0, 0);
    
    switch (preset) {
      case 'today':
        return paymentDate.getTime() === today.getTime();
      case 'yesterday':
        return paymentDate.getTime() === yesterday.getTime();
      case 'thisWeek':
        return paymentDate >= thisWeek;
      case 'thisMonth':
        return paymentDate >= thisMonth;
      default:
        return true;
    }
  });
};

export const filterPaymentsByDateRange = (payments: Payment[], dateRange: DateRange): Payment[] => {
  if (!dateRange.start && !dateRange.end) return payments;
  
  return payments.filter(p => {
    const paymentDate = new Date(p.created_at);
    paymentDate.setHours(0, 0, 0, 0);
    
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      return paymentDate >= startDate && paymentDate <= endDate;
    } else if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      startDate.setHours(0, 0, 0, 0);
      return paymentDate >= startDate;
    } else if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      return paymentDate <= endDate;
    }
    
    return true;
  });
};

// ============= STATISTICS - SEMUA MENGIKUTI FILTER PERIODE =============
export const calculateStats = (
  payments: Payment[], 
  datePreset: string = 'today',
  dateRange: DateRange = { start: '', end: '' }
): PaymentsStats => {
  

  let filteredPayments = [...payments];
  
  if (datePreset !== 'all') {
    filteredPayments = filterPaymentsByDatePreset(filteredPayments, datePreset);
  }
  
  if (dateRange.start || dateRange.end) {
    filteredPayments = filterPaymentsByDateRange(filteredPayments, dateRange);
  }

  const total = filteredPayments.length;
  const completed = filteredPayments.filter(p => p.payment_status === 'completed').length;
  const rejected = filteredPayments.filter(p => p.payment_status === 'rejected').length;
  const totalRevenue = filteredPayments
    .filter(p => p.payment_status === 'completed')
    .reduce((sum, p) => sum + parseInt(p.order.total_price), 0);

  const todayPayments = filterPaymentsByDatePreset(payments, 'today');
  const todayCompleted = todayPayments.filter(p => p.payment_status === 'completed');
  const todayRevenue = todayCompleted.reduce((sum, p) => sum + parseInt(p.order.total_price), 0);
  const todayCount = todayPayments.length;

  return {
    total,
    completed,
    rejected,
    totalRevenue,
    todayRevenue,
    todayCount
  };
};

// ============= PAGINATION =============
export const paginatePayments = (payments: Payment[], page: number, perPage: number): Payment[] => {
  return payments.slice((page - 1) * perPage, page * perPage);
};

export const getTotalPages = (totalItems: number, perPage: number): number => {
  return Math.ceil(totalItems / perPage);
};

// ============= HELPER FUNCTIONS =============
export const getPaymentMethodDisplay = (method: string): string => {
  const methods: Record<string, string> = {
    transfer: 'Transfer Bank',
    qris: 'QRIS'
  };
  return methods[method] || method;
};

export const hasActiveFilters = (
  search: string,
  datePreset: string,
  dateRange: DateRange
): boolean => {
  return !!(
    search ||
    datePreset !== 'today' ||
    dateRange.start ||
    dateRange.end
  );
};

export const getDateDisplayText = (datePreset: string, dateRange: DateRange): string => {
  if (dateRange.start || dateRange.end) {
    if (dateRange.start && dateRange.end) {
      return `${formatShortDate(dateRange.start)} - ${formatShortDate(dateRange.end)}`;
    }
    if (dateRange.start) return `Dari ${formatShortDate(dateRange.start)}`;
    if (dateRange.end) return `Sampai ${formatShortDate(dateRange.end)}`;
  }
  
  switch (datePreset) {
    case 'today': return 'Hari Ini';
    case 'yesterday': return 'Kemarin';
    case 'thisWeek': return 'Minggu Ini';
    case 'thisMonth': return 'Bulan Ini';
    default: return 'Semua Waktu';
  }
};