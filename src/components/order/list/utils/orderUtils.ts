import { Order, OrderItem } from '../types';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 24) {
    if (diffInHours < 1) {
      const minutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${minutes} menit yang lalu`;
    }
    return `${diffInHours} jam yang lalu`;
  }

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

export const getItemDisplayName = (item: OrderItem): string => {
  if (item.menu_name) {
    return item.menu_name;
  }
  if (item.menu?.name) {
    return item.menu.name;
  }
  return `Item #${item.menu_id}`;
};

export const getItemPrice = (item: OrderItem): number => {
  if (item.menu?.price) {
    return item.menu.price * item.quantity;
  }
  if (item.price) {
    return parseFloat(item.price) * item.quantity;
  }
  return 0;
};

export const getRestaurantName = (order: Order): string => {
  return order.restaurant_name || order.restaurant?.name || '';
};