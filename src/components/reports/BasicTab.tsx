'use client';

import {
  ShoppingCart,
  Users,
  Building2,
  UserCog,
  AlertCircle,
  FileText,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  Package
} from 'lucide-react';
import { StatBox } from './StatBox';

interface ReportsData {
  total_orders: number;
  orders_by_status: Array<{
    status: string;
    total: number;
  }>;
  payment_summary: Array<{
    status: string;
    total: number;
    total_amount: number;
  }>;
  user_statistics?: {
    total_users: number;
    total_admins: number;
    active_users: number;
  };
  top_users: Array<{
    id: number;
    name: string;
    email: string;
    orders_count: number;
  }>;
}

interface BasicTabProps {
  data: ReportsData | null;
  formatCurrency: (value: number) => string;
  selectedModule?: string;
}

export const BasicTab = ({
  data,
  formatCurrency,
  selectedModule
}: BasicTabProps) => {
  // Safe defaults
  const safeData = data || {
    total_orders: 0,
    orders_by_status: [],
    payment_summary: [],
    user_statistics: {
      total_users: 0,
      total_admins: 0,
      active_users: 0
    },
    top_users: []
  };

  const userStats = safeData.user_statistics || {
    total_users: 0,
    total_admins: 0,
    active_users: 0
  };

  const ordersByStatus = safeData.orders_by_status || [];
  const paymentSummary = safeData.payment_summary || [];
  const topUsers = safeData.top_users || [];

  // Helper functions
  const getCompletedOrders = () => {
    const completed = ordersByStatus.find(
      (item) =>
        item.status.toLowerCase() === 'completed' ||
        item.status.toLowerCase() === 'selesai'
    );
    return completed?.total || 0;
  };

  const getProcessingOrders = () => {
    const processing = ordersByStatus.find(
      (item) =>
        item.status.toLowerCase() === 'processing' ||
        item.status.toLowerCase() === 'diproses'
    );
    return processing?.total || 0;
  };

  const getPendingOrders = () => {
    const pending = ordersByStatus.find(
      (item) =>
        item.status.toLowerCase() === 'pending' ||
        item.status.toLowerCase() === 'menunggu'
    );
    return pending?.total || 0;
  };

  const getCanceledOrders = () => {
    const canceled = ordersByStatus.find(
      (item) =>
        item.status.toLowerCase() === 'canceled' ||
        item.status.toLowerCase() === 'dibatalkan'
    );
    return canceled?.total || 0;
  };

  const getTotalRevenue = () => {
    if (paymentSummary.length === 0) return 0;
    return paymentSummary.reduce(
      (total, item) => total + item.total_amount,
      0
    );
  };

  // If no data at all
  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="text-center">
          <FileText className="mx-auto mb-3 h-8 w-8 text-gray-400 dark:text-gray-600" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Data laporan tidak tersedia
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
            Silakan pilih filter tanggal atau pilih modul CRSD
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Module Header */}
      {selectedModule && (
        <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-4 dark:border-blue-800 dark:from-blue-900/20 dark:to-blue-800/20">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-600 p-2 dark:bg-blue-700">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900 dark:text-white">
                Laporan Dasar Divisi{' '}
                {selectedModule === 'crsd1' ? 'CRSD 1' : 'CRSD 2'}
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Ringkasan statistik dan data utama
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key Statistics */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
          Statistik Utama
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatBox
            title="Total Pesanan"
            value={safeData.total_orders}
            icon={<ShoppingCart className="h-5 w-5 text-blue-600" />}
            color="bg-blue-100 dark:bg-blue-900/30"
          />
          <StatBox
            title="Total Revenue"
            value={getTotalRevenue()}
            icon={<DollarSign className="h-5 w-5 text-green-600" />}
            color="bg-green-100 dark:bg-green-900/30"
            isCurrency={true}
            formatCurrency={formatCurrency}
          />
          <StatBox
            title="Pengguna Aktif"
            value={userStats.active_users}
            icon={<Users className="h-5 w-5 text-purple-600" />}
            color="bg-purple-100 dark:bg-purple-900/30"
          />
          <StatBox
            title="Total Admin"
            value={userStats.total_admins}
            icon={<UserCog className="h-5 w-5 text-orange-600" />}
            color="bg-orange-100 dark:bg-orange-900/30"
          />
        </div>
      </div>

      {/* Detailed Statistics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* User Statistics */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Statistik Pengguna
            </h3>
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total Pengguna
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {userStats.total_users}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Pengguna Aktif
              </span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {userStats.active_users}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total Admin
              </span>
              <span className="font-semibold text-orange-600 dark:text-orange-400">
                {userStats.total_admins}
              </span>
            </div>
            {selectedModule && (
              <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  <Building2 className="h-3 w-3" />
                  {selectedModule === 'crsd1' ? 'CRSD 1' : 'CRSD 2'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Orders Status */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Status Pesanan
            </h3>
            <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Selesai
                </span>
              </div>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {getCompletedOrders()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Diproses
                </span>
              </div>
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                {getProcessingOrders()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Menunggu
                </span>
              </div>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {getPendingOrders()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Dibatalkan
                </span>
              </div>
              <span className="font-semibold text-red-600 dark:text-red-400">
                {getCanceledOrders()}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Ringkasan Pembayaran
            </h3>
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-3">
            {paymentSummary.length > 0 ? (
              paymentSummary.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm capitalize text-gray-600 dark:text-gray-400">
                    {item.status}
                  </span>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {item.total} transaksi
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {formatCurrency(item.total_amount)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Tidak ada data pembayaran
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Users Section */}
      {topUsers.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Top Pengguna
                </h3>
                {selectedModule && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Berdasarkan jumlah pesanan di Divisi{' '}
                    {selectedModule === 'crsd1' ? 'CRSD 1' : 'CRSD 2'}
                  </p>
                )}
              </div>
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Total Pesanan
                  </th>
                </tr>
              </thead>
              <tbody>
                {topUsers.slice(0, 5).map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                      {user.orders_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedModule && (
            <div className="border-t border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center justify-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  <Building2 className="h-3 w-3" />
                  Divisi{' '}
                  {selectedModule === 'crsd1' ? 'CRSD 1' : 'CRSD 2'}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Ringkasan Laporan
          </h3>
          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {safeData.total_orders}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Pesanan
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {getCompletedOrders()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Pesanan Selesai
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {userStats.total_users}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Pengguna
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {userStats.total_admins}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Admin
            </div>
          </div>
        </div>

        {selectedModule && (
          <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/30">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Divisi{' '}
                  {selectedModule === 'crsd1' ? 'CRSD 1' : 'CRSD 2'}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  Periode:{' '}
                  {new Date().toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {safeData.total_orders === 0 &&
        userStats.total_users === 0 &&
        paymentSummary.length === 0 &&
        topUsers.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <AlertCircle className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
              Tidak ada data yang tersedia
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Data akan muncul setelah ada aktivitas dalam sistem
            </p>
            {selectedModule && (
              <div className="mt-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  <Building2 className="h-4 w-4" />
                  Divisi{' '}
                  {selectedModule === 'crsd1' ? 'CRSD 1' : 'CRSD 2'}
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
};
