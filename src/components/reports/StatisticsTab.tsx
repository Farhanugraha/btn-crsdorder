import {
  ShoppingCart,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  FileText,
  AlertCircle,
  Calendar
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
}

export const StatisticsTab = ({
  data,
  formatCurrency
}: StatisticsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Main Statistics */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          📊 Statistik Periode
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
            value={formatCurrency(data.totalRevenue)}
            icon={<TrendingUp className="h-5 w-5 text-green-600" />}
            color="bg-green-100 dark:bg-green-900/30"
          />
          <StatBox
            title="Rata-rata Pesanan"
            value={formatCurrency(data.averageOrderValue)}
            icon={<CreditCard className="h-5 w-5 text-purple-600" />}
            color="bg-purple-100 dark:bg-purple-900/30"
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
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          📈 Pertumbuhan & Hari Ini
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Pertumbuhan Revenue
            </p>
            <p
              className={`mt-3 text-2xl font-bold ${
                data.revenueGrowth >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {data.revenueGrowth >= 0 ? '↑' : '↓'}{' '}
              {Math.abs(data.revenueGrowth).toFixed(2)}%
            </p>
          </div>

          <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Pertumbuhan Pesanan
            </p>
            <p
              className={`mt-3 text-2xl font-bold ${
                data.orderGrowth >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {data.orderGrowth >= 0 ? '↑' : '↓'}{' '}
              {Math.abs(data.orderGrowth).toFixed(2)}%
            </p>
          </div>

          <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Revenue Hari Ini
            </p>
            <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(data.todayRevenue)}
            </p>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          📦 Rincian Pesanan
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
      {data.chartData.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-bold text-slate-900 dark:text-white">
              📅 Tren Harian Pesanan & Revenue
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Tanggal
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                    Pesanan
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.chartData.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                      {item.date}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                      {item.orders}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(item.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
