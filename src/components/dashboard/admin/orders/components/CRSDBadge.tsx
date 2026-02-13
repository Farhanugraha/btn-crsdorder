'use client';

import { CRSD_STYLES } from '../utils/constants';

interface CRSDBadgeProps {
  type: 'crsd1' | 'crsd2' | string;
}

export const CRSDBadge = ({ type }: CRSDBadgeProps) => {
  const style =
    CRSD_STYLES[type as keyof typeof CRSD_STYLES] ||
    CRSD_STYLES.crsd1;
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${style.bg} ${style.text}`}
    >
      <Icon className="h-3 w-3" />
      {style.label}
    </span>
  );
};
