'use client';

import { STATUS_STYLES } from '../utils/constants';

interface StatusBadgeProps {
  status: string;
  type: 'order' | 'payment';
  size?: 'small' | 'default';
}
type StatusStyle = {
  bg: string;
  text: string;
  icon: React.ComponentType<any>;
  label: string;
};

export const StatusBadge = ({
  status,
  type,
  size = 'default'
}: StatusBadgeProps) => {
  const base = `inline-flex items-center gap-1.5 rounded-full font-medium ${
    size === 'small' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-xs'
  }`;

  const config = (STATUS_STYLES[type][
    status as keyof (typeof STATUS_STYLES)[typeof type]
  ] ||
    (type === 'order'
      ? STATUS_STYLES.order.processing
      : STATUS_STYLES.payment.pending)) as StatusStyle;

  const Icon = config.icon;

  return (
    <span className={`${base} ${config.bg} ${config.text}`}>
      <Icon
        className={size === 'small' ? 'h-3 w-3' : 'h-3.5 w-3.5'}
      />
      {config.label}
    </span>
  );
};
