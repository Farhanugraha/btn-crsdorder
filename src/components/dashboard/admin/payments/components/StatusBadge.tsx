'use client';

import { STATUS_OPTIONS } from '../utils/constants';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const option =
    STATUS_OPTIONS.find((opt) => opt.value === status) ||
    STATUS_OPTIONS[0];
  const Icon = option.icon;

  const displayStatus =
    status === 'pending'
      ? 'Menunggu'
      : status === 'completed'
        ? 'Dibayar'
        : status === 'rejected'
          ? 'Ditolak'
          : status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold uppercase ${option.bg} ${option.text}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {displayStatus}
    </span>
  );
};
