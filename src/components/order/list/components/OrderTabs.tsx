'use client';

import { STATUS_TABS } from '../constants/orderConstants';
import type { StatusTab } from '../types';

interface OrderTabsProps {
  selectedTab: StatusTab;
  onTabChange: (tab: StatusTab) => void;
  getOrderCountByStatus: (status: string) => number;
}

export const OrderTabs = ({
  selectedTab,
  onTabChange,
  getOrderCountByStatus
}: OrderTabsProps) => {
  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex min-w-max space-x-1 rounded-lg bg-slate-100/50 p-1 dark:bg-slate-800/50">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              selectedTab === tab.value
                ? tab.value === 'pending'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                  : tab.value === 'paid'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : tab.value === 'canceled'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      : 'bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-300'
                : 'text-slate-600 hover:bg-white/50 dark:text-slate-400 dark:hover:bg-slate-800/50'
            }`}
          >
            {tab.label}
            {tab.value === 'pending' &&
              getOrderCountByStatus('pending') > 0 && (
                <span className="ml-2 rounded-full bg-yellow-500 px-1.5 py-0.5 text-xs text-white">
                  {getOrderCountByStatus('pending')}
                </span>
              )}
          </button>
        ))}
      </div>
    </div>
  );
};
