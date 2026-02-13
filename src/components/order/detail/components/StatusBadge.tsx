'use client';

import { getStatusBadge } from '../utils/orderDetailUtils';
import type { OrderStatus } from '../types';

interface StatusBadgeProps {
  status: OrderStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = getStatusBadge(status);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1 text-xs font-semibold sm:text-sm ${config.bg} ${config.text}`}
    >
      <Icon className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
      <span className="hidden sm:inline">{config.label}</span>
      <span className="sm:hidden">{config.shortLabel}</span>
    </span>
  );
};
