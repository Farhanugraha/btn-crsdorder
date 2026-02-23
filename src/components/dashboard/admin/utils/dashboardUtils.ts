import { Order } from '../types';

export const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getEndOfWeek = (date: Date): Date => {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
};

export const getCurrentWeekRange = (): string => {
  const startOfWeek = getStartOfWeek(new Date());
  const endOfWeek = getEndOfWeek(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    });
  };

  return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
};

export const calculateRevenue = (orders: Order[]): { weeklyRevenue: number; lastWeekRevenue: number } => {
  const now = new Date();
  const startOfWeek = getStartOfWeek(now);
  const endOfWeek = getEndOfWeek(now);

  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfWeek.getDate() - 7);
  const endOfLastWeek = new Date(endOfWeek);
  endOfLastWeek.setDate(endOfWeek.getDate() - 7);

  let weeklyRevenue = 0;
  let lastWeekRevenue = 0;

  orders.forEach((order) => {
    const orderDate = new Date(order.created_at);
    const orderAmount = parseFloat(order.total_price);

    // Revenue hanya dari order dengan status = 'paid' (payment completed)
    if (order.status === 'paid') {
      if (orderDate >= startOfWeek && orderDate <= endOfWeek) {
        weeklyRevenue += orderAmount;
      }
      if (orderDate >= startOfLastWeek && orderDate <= endOfLastWeek) {
        lastWeekRevenue += orderAmount;
      }
    }
  });

  return { weeklyRevenue, lastWeekRevenue };
};

export const calculatePercentageChange = (weeklyRevenue: number, lastWeekRevenue: number): number => {
  if (lastWeekRevenue === 0) {
    return weeklyRevenue > 0 ? 100 : 0;
  }
  return ((weeklyRevenue - lastWeekRevenue) / lastWeekRevenue) * 100;
};

export const getStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    processing: 'Menunggu Diproses',
    completed: 'Selesai',
    canceled: 'Dibatalkan',
    pending: 'Menunggu Pembayaran'
  };
  return statusMap[status] || status;
};

export const filterOrdersByStatus = (orders: Order[], status: string): Order[] => {
  return orders.filter((order) => {
    if (status === 'processing') {
      return order.order_status === 'processing';
    } else if (status === 'pending') {
      return order.status === 'pending';
    } else if (status === 'completed') {
      return order.order_status === 'completed' && order.status === 'paid';
    } else if (status === 'canceled') {
      return order.order_status === 'canceled' || order.status === 'canceled';
    }
    return true;
  });
};