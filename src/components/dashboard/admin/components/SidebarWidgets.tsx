'use client';

import { Settings2 } from 'lucide-react';
import { QuickActionItem } from './QuickActionItem';
import { RevenueSummary } from './RevenueSummary';
import { AlertBanner } from './AlertBanner';
import { DashboardData } from '../types';
import { QUICK_ACTIONS } from '../constants/dashboardConstants';

interface SidebarWidgetsProps {
  dashboardData: DashboardData | null;
  weeklyRevenue: number;
  lastWeekRevenue: number;
}

export const SidebarWidgets = ({
  dashboardData,
  weeklyRevenue,
  lastWeekRevenue
}: SidebarWidgetsProps) => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600">
            <Settings2 className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Aksi Cepat
          </h3>
        </div>
        <div className="space-y-3">
          {QUICK_ACTIONS.map((action) => (
            <QuickActionItem
              key={action.href}
              title={action.title}
              description={action.description}
              href={action.href}
              icon={action.icon}
            />
          ))}
        </div>
      </div>

      {/* Revenue Summary */}
      {dashboardData && (
        <RevenueSummary
          dashboardData={dashboardData}
          weeklyRevenue={weeklyRevenue}
          lastWeekRevenue={lastWeekRevenue}
        />
      )}

      {/* Alert */}
      <AlertBanner />
    </div>
  );
};
