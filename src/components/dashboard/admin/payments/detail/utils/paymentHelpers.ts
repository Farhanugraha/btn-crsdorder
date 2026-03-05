import { PaymentStatus, OrderStatus } from '../types';
import { PAYMENT_METHODS, PAYMENT_STATUS, ORDER_STATUS } from '../constants';

export const formatCurrency = (value: string | number): string => {
  return parseInt(String(value)).toLocaleString('id-ID');
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short'
  });
};

export const getPaymentMethodLabel = (method: string): string => {
  return PAYMENT_METHODS[method] || method;
};

export const getPaymentStatusColor = (status: string): string => {
  return PAYMENT_STATUS[status as PaymentStatus]?.color || 
    'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
};

export const getPaymentStatusLabel = (status: string): string => {
  return PAYMENT_STATUS[status as PaymentStatus]?.label || status;
};

export const getPaymentStatusIcon = (status: string) => {
  // Icons akan dihandle di component
  return status;
};

export const getOrderStatusLabel = (status: string): string => {
  return ORDER_STATUS[status as OrderStatus]?.label || status;
};

export const getOrderStatusColor = (status: string): string => {
  return ORDER_STATUS[status as OrderStatus]?.color || 
    'text-gray-600 dark:text-gray-400';
};

export const calculateItemTotal = (price: string, quantity: number): number => {
  return parseInt(price) * quantity;
};