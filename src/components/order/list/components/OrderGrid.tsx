'use client';

import { AnimatePresence } from 'framer-motion';
import { OrderCard } from './OrderCard';
import type { Order } from '../types';

interface OrderGridProps {
  orders: Order[];
  onOrderClick: (orderId: number) => void;
}

export const OrderGrid = ({
  orders,
  onOrderClick
}: OrderGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <AnimatePresence>
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onClick={onOrderClick}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
