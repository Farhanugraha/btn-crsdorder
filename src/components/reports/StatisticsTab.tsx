'use client';

import {
  ShoppingCart,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  FileText,
  AlertCircle,
  Calendar,
  Building2,
  DollarSign,
  Package
} from 'lucide-react';
import { StatBox } from './StatBox';

interface StatisticsData {
  totalOrders: number;
  totalRevenue: number;
  completedOrders: number;
  processingOrders: number;
  canceledOrders: number;
  averageOrderValue: number;
  todayOrders: number;
  todayRevenue: number;
  revenueGrowth: number;
  orderGrowth: number;
  chartData: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
}

interface StatisticsTabProps {
  data: StatisticsData;
  formatCurrency: (value: number) => string;
  selectedModule?: string;
}

export const StatisticsTab = ({
  data,
  formatCurrency,
  selectedModule
}: StatisticsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Module Header */}
      {selectedModule && (
        <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-4 dark:border-blue-800 dark:from-blue-900/20 dark:to-blue-800/20">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-600 p-2 dark:bg-blue-700">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900 dark:text-white">
                Statistik Detail Divisi{' '}
                {selectedModule === 'crsd1' ? 'CRSD 1' : 'CRSD 2'}
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Analisis mendalam dan tren data
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Statistics */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
          Statistik Periode
          {selectedModule && (
            <span className="ml-2 text-sm font-normal text-blue-600 dark:text-blue-400">
              ({selectedModule === 'crsd1' ? 'CRSD 1' : 'CRSD 2'})
            </span>
          )}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatBox
            title="Total Pesanan"
            value={data.totalOrders}
            icon={<ShoppingCart className="h-5 w-5 text-blue-600" />}
            color="bg-blue-100 dark:bg-blue-900/30"
          />
          <StatBox
            title="Total Revenue"
            value={data.totalRevenue}
            icon={<DollarSign className="h-5 w-5 text-green-600" />}
            color="bg-green-100 dark:bg-green-900/30"
            isCurrency={true}
            formatCurrency={formatCurrency}
          />
          <StatBox
            title="Rata-rata Pesanan"
            value={data.averageOrderValue}
            icon={<CreditCard className="h-5 w-5 text-purple-600" />}
            color="bg-purple-100 dark:bg-purple-900/30"
            isCurrency={true}
            formatCurrency={formatCurrency}
          />
          <StatBox
            title="Pesanan Selesai"
            value={data.completedOrders}
            icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
            color="bg-green-100 dark:bg-green-900/30"
          />
        </div>
      </div>

      {/* Growth Metrics */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
          Pertumbuhan & Hari Ini
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Pertumbuhan Revenue
              </h3>
              <TrendingUp
                className={`h-5 w-5 ${
                  data.revenueGrowth >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              />
            </div>
            <p
              className={`text-3xl font-bold ${
                data.revenueGrowth >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {data.revenueGrowth >= 0 ? '↑' : '↓'}{' '}
              {Math.abs(data.revenueGrowth).toFixed(2)}%
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Dibandingkan periode sebelumnya
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Pertumbuhan Pesanan
              </h3>
              <TrendingUp
                className={`h-5 w-5 ${
                  data.orderGrowth >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              />
            </div>
            <p
              className={`text-3xl font-bold ${
                data.orderGrowth >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {data.orderGrowth >= 0 ? '↑' : '↓'}{' '}
              {Math.abs(data.orderGrowth).toFixed(2)}%
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Dibandingkan periode sebelumnya
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Hari Ini
              </h3>
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(data.todayRevenue)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.todayOrders} pesanan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
          Rincian Status Pesanan
          {selectedModule && (
            <span className="ml-2 text-sm font-normal text-blue-600 dark:text-blue-400">
              ({selectedModule === 'crsd1' ? 'CRSD 1' : 'CRSD 2'})
            </span>
          )}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <StatBox
            title="Diproses"
            value={data.processingOrders}
            icon={<FileText className="h-5 w-5 text-amber-600" />}
            color="bg-amber-100 dark:bg-amber-900/30"
          />
          <StatBox
            title="Selesai"
            value={data.completedOrders}
            icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
            color="bg-green-100 dark:bg-green-900/30"
          />
          <StatBox
            title="Dibatalkan"
            value={data.canceledOrders}
            icon={<AlertCircle className="h-5 w-5 text-red-600" />}
            color="bg-red-100 dark:bg-red-900/30"
          />
          <StatBox
            title="Hari Ini"
            value={data.todayOrders}
            icon={<Calendar className="h-5 w-5 text-blue-600" />}
            color="bg-blue-100 dark:bg-blue-900/30"
          />
        </div>
      </div>

      {/* Trend Table */}
      {data.chartData && data.chartData.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Tren Harian Pesanan & Revenue
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Data harian selama periode yang dipilih
                </p>
              </div>
              {selectedModule && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {selectedModule === 'crsd1' ? 'CRSD 1' : 'CRSD 2'}
                </span>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tanggal
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Pesanan
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Revenue
                  </th>
                  {selectedModule && (
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Divisi
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.chartData.slice(0, 10).map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {item.date}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                      {item.orders}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item.revenue)}
                    </td>
                    {selectedModule && (
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {selectedModule === 'crsd1'
                            ? 'CRSD 1'
                            : 'CRSD 2'}
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              {data.chartData.length > 0 && (
                <tfoot className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                  <tr>
                    <td className="px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                      Total
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-gray-700 dark:text-gray-300">
                      {data.chartData.reduce(
                        (sum, item) => sum + item.orders,
                        0
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(
                        data.chartData.reduce(
                          (sum, item) => sum + item.revenue,
                          0
                        )
                      )}
                    </td>
                    {selectedModule && (
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Periode
                        </span>
                      </td>
                    )}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {/* Summary Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Ringkasan Statistik
          </h3>
          <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.totalOrders}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Pesanan
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(data.totalRevenue)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Revenue
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(data.averageOrderValue)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Rata-rata
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {data.revenueGrowth >= 0 ? '+' : ''}
              {data.revenueGrowth.toFixed(2)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Growth
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
                  Statistik Divisi{' '}
                  {selectedModule === 'crsd1' ? 'CRSD 1' : 'CRSD 2'}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  {data.chartData && data.chartData.length > 0
                    ? `Periode: ${data.chartData[0].date} - ${
                        data.chartData[data.chartData.length - 1].date
                      }`
                    : 'Data terbaru'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
