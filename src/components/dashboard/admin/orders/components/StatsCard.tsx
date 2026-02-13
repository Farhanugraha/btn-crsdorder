'use client';

import { STATS_CARD_COLORS } from '../utils/constants';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: any;
  color?: 'blue' | 'green' | 'purple' | 'amber';
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  color = 'blue'
}: StatsCardProps) => {
  const colors = STATS_CARD_COLORS[color];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {title}
          </p>
          <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg}`}
        >
          <Icon className={`h-5 w-5 ${colors.icon}`} />
        </div>
      </div>
    </div>
  );
};
