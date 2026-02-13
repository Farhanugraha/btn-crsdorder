'use client';
import { Loader2 } from 'lucide-react';
import {
  useAdminDashboard,
  useOrders,
  DashboardHeader,
  StatsGrid,
  OrdersPanel,
  SidebarWidgets
} from '@/components/dashboard/admin';

export default function AdminDashboard() {
  const {
    user,
    isLoading: isAuthLoading,
    dashboardData,
    isRefreshing,
    handleRefresh
  } = useAdminDashboard();

  const {
    orders,
    paginatedOrders,
    isLoading: isOrdersLoading,
    filterStatus,
    currentPage,
    totalPages,
    weeklyRevenue,
    lastWeekRevenue,
    isCalculatingRevenue,
    handleStatusChange,
    setCurrentPage
  } = useOrders('processing');

  if (isAuthLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950">
      <DashboardHeader
        filterStatus={filterStatus}
        isRefreshing={isRefreshing}
        onStatusChange={handleStatusChange}
        onRefresh={handleRefresh}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <StatsGrid
          dashboardData={dashboardData}
          weeklyRevenue={weeklyRevenue}
          isCalculatingRevenue={isCalculatingRevenue}
          isLoading={isAuthLoading}
        />

        <div className="grid gap-8 lg:grid-cols-3">
          <OrdersPanel
            orders={orders}
            paginatedOrders={paginatedOrders}
            isLoading={isOrdersLoading}
            filterStatus={filterStatus}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          <SidebarWidgets
            dashboardData={dashboardData}
            weeklyRevenue={weeklyRevenue}
            lastWeekRevenue={lastWeekRevenue}
          />
        </div>
      </main>
    </div>
  );
}
