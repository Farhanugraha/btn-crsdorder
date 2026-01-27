'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  AlertCircle,
  Loader2,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

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
  chartData?: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
}

type FilterType = 'today' | 'week' | 'month' | 'custom';

const StatisticsPage = () => {
  const router = useRouter();
  const [statistics, setStatistics] = useState<StatisticsData | null>(
    null
  );
  const [chartData, setChartData] = useState<
    Array<{ date: string; orders: number; revenue: number }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStatistics({}, false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const fetchStatistics = async (
    dateRange?: { startDate?: string; endDate?: string },
    showError = true
  ) => {
    try {
      const isInitialLoad = !statistics;
      if (isInitialLoad) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      setError(null);

      if (!apiUrl) {
        const errorMsg = 'API tidak terkonfigurasi';
        if (showError) setError(errorMsg);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      const token = localStorage.getItem('auth_token');

      if (!token) {
        router.push('/auth/login');
        return;
      }

      let url = `${apiUrl}/api/admin/statistics`;
      const params = new URLSearchParams();

      if (dateRange?.startDate)
        params.append('start_date', dateRange.startDate);
      if (dateRange?.endDate)
        params.append('end_date', dateRange.endDate);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        cache: 'no-cache'
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }
        if (showError) {
          setError('Gagal memuat data statistik. Silakan coba lagi.');
        }
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      const data = await response.json();

      if (data.success && data.data) {
        setStatistics(data.data);

        if (
          data.data.chartData &&
          Array.isArray(data.data.chartData) &&
          data.data.chartData.length > 0
        ) {
          setChartData(data.data.chartData);
        } else {
          setChartData([]);
        }
        setError(null);
      } else {
        if (showError) {
          setError(data.message || 'Data statistik tidak tersedia');
        }
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
      if (showError) {
        setError('Gagal memuat data statistik. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleFilterChange = (type: FilterType) => {
    setFilterType(type);

    const today = new Date();
    let startDate = '';
    let endDate = today.toISOString().split('T')[0];

    switch (type) {
      case 'today':
        startDate = endDate;
        break;
      case 'week':
        const weekAgoDate = new Date(today);
        weekAgoDate.setDate(weekAgoDate.getDate() - 7);
        startDate = weekAgoDate.toISOString().split('T')[0];
        break;
      case 'month':
        const monthAgoDate = new Date(today);
        monthAgoDate.setMonth(monthAgoDate.getMonth() - 1);
        startDate = monthAgoDate.toISOString().split('T')[0];
        break;
      case 'custom':
        return;
    }

    fetchStatistics({ startDate, endDate });
  };

  const handleCustomDateFilter = () => {
    if (!customStartDate || !customEndDate) {
      setError('Silakan pilih tanggal awal dan akhir');
      return;
    }

    if (new Date(customStartDate) > new Date(customEndDate)) {
      setError('Tanggal awal harus lebih kecil dari tanggal akhir');
      return;
    }

    fetchStatistics({
      startDate: customStartDate,
      endDate: customEndDate
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    bgColor,
    iconColor,
    subtext,
    growth
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    bgColor: string;
    iconColor: string;
    subtext?: string;
    growth?: number;
  }) => (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {title}
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              {value}
            </p>
            {subtext && (
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {subtext}
              </p>
            )}
            {growth !== undefined && (
              <div className="mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-600" />
                <span
                  className={`text-xs font-semibold ${
                    growth >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {growth >= 0 ? '+' : ''}
                  {growth.toFixed(1)}% dari periode sebelumnya
                </span>
              </div>
            )}
          </div>
          <div className={`rounded-lg ${bgColor} flex-shrink-0 p-3`}>
            <div className={`${iconColor}`}>{Icon}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const OrderStatusCard = ({
    title,
    count,
    icon: Icon,
    bgColor,
    textColor,
    percentage
  }: {
    title: string;
    count: number;
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
    percentage: number;
  }) => (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            {title}
          </p>
          <p
            className={`mt-2 text-2xl font-bold sm:text-3xl ${textColor}`}
          >
            {count}
          </p>
        </div>
        <div className={`rounded-lg ${bgColor} flex-shrink-0 p-3`}>
          <div className={textColor}>{Icon}</div>
        </div>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={`h-2 rounded-full transition-all ${textColor.replace(
            'text',
            'bg'
          )}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Memuat data statistik...
          </p>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="min-h-screen bg-white px-4 py-8 dark:bg-slate-900 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
            <div className="flex items-start gap-4">
              <AlertCircle className="mt-1 h-6 w-6 flex-shrink-0 text-red-600 dark:text-red-400" />
              <div className="flex-1">
                <h2 className="text-lg font-bold text-red-900 dark:text-red-300">
                  Tidak Dapat Memuat Data
                </h2>
                <p className="mt-1 text-sm text-red-800 dark:text-red-400">
                  {error ||
                    'Terjadi kesalahan saat memuat data statistik'}
                </p>
                <Button
                  onClick={() => fetchStatistics({}, true)}
                  className="mt-4 bg-red-600 text-white hover:bg-red-700"
                >
                  Coba Lagi
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalStatusCount =
    statistics.completedOrders +
    statistics.processingOrders +
    statistics.canceledOrders;
  const completedPercentage =
    totalStatusCount > 0
      ? (statistics.completedOrders / totalStatusCount) * 100
      : 0;
  const processingPercentage =
    totalStatusCount > 0
      ? (statistics.processingOrders / totalStatusCount) * 100
      : 0;
  const canceledPercentage =
    totalStatusCount > 0
      ? (statistics.canceledOrders / totalStatusCount) * 100
      : 0;

  const pieData = [
    {
      name: 'Selesai',
      value: statistics.completedOrders,
      fill: '#10b981'
    },
    {
      name: 'Sedang Diproses',
      value: statistics.processingOrders,
      fill: '#f59e0b'
    },
    {
      name: 'Dibatalkan',
      value: statistics.canceledOrders,
      fill: '#ef4444'
    }
  ];

  return (
    <div className="min-h-screen bg-white px-4 py-6 dark:bg-slate-900 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 dark:text-white sm:text-4xl">
              Dashboard Analitik
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Pantau performa pemesanan online Anda dengan dashboard
              yang intuitif
            </p>
          </div>
          <Button
            onClick={() => fetchStatistics({}, true)}
            disabled={isRefreshing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
            Refresh
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  {error}
                </p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Filter Section */}
        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-blue-900 dark:text-white">
            <Calendar className="h-5 w-5" />
            Rentang Waktu
          </h2>

          <div className="space-y-4">
            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleFilterChange('today')}
                variant={
                  filterType === 'today' ? 'default' : 'outline'
                }
                className="text-sm"
              >
                Hari Ini
              </Button>
              <Button
                onClick={() => handleFilterChange('week')}
                variant={
                  filterType === 'week' ? 'default' : 'outline'
                }
                className="text-sm"
              >
                7 Hari Terakhir
              </Button>
              <Button
                onClick={() => handleFilterChange('month')}
                variant={
                  filterType === 'month' ? 'default' : 'outline'
                }
                className="text-sm"
              >
                1 Bulan Terakhir
              </Button>
              <Button
                onClick={() => setFilterType('custom')}
                variant={
                  filterType === 'custom' ? 'default' : 'outline'
                }
                className="text-sm"
              >
                Kustom
              </Button>
            </div>

            {/* Custom Date Range */}
            {filterType === 'custom' && (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                  <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) =>
                      setCustomStartDate(e.target.value)
                    }
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleCustomDateFilter}
                    className="w-full bg-slate-900 text-white hover:bg-slate-800 sm:w-auto"
                  >
                    Terapkan
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Pesanan"
            value={statistics.totalOrders}
            icon={<ShoppingCart className="h-6 w-6" />}
            bgColor="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
            subtext="Jumlah total pesanan"
            growth={statistics.orderGrowth}
          />
          <StatCard
            title="Total Penerimaan"
            value={formatCurrency(statistics.totalRevenue)}
            icon={<DollarSign className="h-6 w-6" />}
            bgColor="bg-emerald-100 dark:bg-emerald-900/30"
            iconColor="text-emerald-600 dark:text-emerald-400"
            subtext={`Rata-rata per pesanan: ${formatCurrency(
              statistics.averageOrderValue
            )}`}
            growth={statistics.revenueGrowth}
          />
          <StatCard
            title="Pesanan Hari Ini"
            value={statistics.todayOrders}
            icon={<ShoppingCart className="h-6 w-6" />}
            bgColor="bg-purple-100 dark:bg-purple-900/30"
            iconColor="text-purple-600 dark:text-purple-400"
            subtext={`Penerimaan: ${formatCurrency(
              statistics.todayRevenue
            )}`}
          />
          <StatCard
            title="Rata-rata Pesanan"
            value={formatCurrency(statistics.averageOrderValue)}
            icon={<TrendingUp className="h-6 w-6" />}
            bgColor="bg-orange-100 dark:bg-orange-900/30"
            iconColor="text-orange-600 dark:text-orange-400"
            subtext="Nilai per transaksi"
          />
        </div>

        {/* Charts Section */}
        {chartData && chartData.length > 0 && (
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            {/* Line Chart - Revenue & Orders Trend */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="dark:bg-slate-750 border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700">
                <h3 className="font-bold text-blue-900 dark:text-white">
                  Grafik Pesanan & Penerimaan
                </h3>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="date"
                      stroke="#94a3b8"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                      formatter={(value: any) => {
                        if (
                          value !== undefined &&
                          typeof value === 'number'
                        ) {
                          return formatCurrency(value);
                        }
                        return value ?? '0';
                      }}
                      labelFormatter={(label: string) =>
                        `Tanggal: ${label}`
                      }
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#3b82f6"
                      name="Jumlah Pesanan"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      name="Penerimaan"
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart - Status Distribution */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-700/50">
                <h3 className="font-bold text-blue-900 dark:text-white">
                  Distribusi Status Pesanan
                </h3>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) =>
                        value?.toString() ?? '0'
                      }
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        color: '#1f2937',
                        fontSize: '12px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                      cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Legend - Lebih Rapi */}
                <div className="mt-6 space-y-3 border-t border-slate-200 pt-4 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: '#10b981' }}
                      ></div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        Sudah Selesai
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {statistics.completedOrders}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {totalStatusCount > 0
                          ? (
                              (statistics.completedOrders /
                                totalStatusCount) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: '#f59e0b' }}
                      ></div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        Sedang Diproses
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {statistics.processingOrders}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {totalStatusCount > 0
                          ? (
                              (statistics.processingOrders /
                                totalStatusCount) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: '#ef4444' }}
                      ></div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        Pesanan Batal
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {statistics.canceledOrders}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {totalStatusCount > 0
                          ? (
                              (statistics.canceledOrders /
                                totalStatusCount) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Status Summary */}
        <div className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-700/50">
            <h2 className="text-lg font-bold text-blue-900 dark:text-white">
              Status Pesanan Saat Ini
            </h2>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-3">
            <OrderStatusCard
              title="Sedang Diproses"
              count={statistics.processingOrders}
              icon={<Clock className="h-6 w-6" />}
              bgColor="bg-amber-100 dark:bg-amber-900/30"
              textColor="text-amber-600 dark:text-amber-400"
              percentage={processingPercentage}
            />
            <OrderStatusCard
              title="Sudah Selesai"
              count={statistics.completedOrders}
              icon={<CheckCircle className="h-6 w-6" />}
              bgColor="bg-emerald-100 dark:bg-emerald-900/30"
              textColor="text-emerald-600 dark:text-emerald-400"
              percentage={completedPercentage}
            />
            <OrderStatusCard
              title="Pesanan Batal"
              count={statistics.canceledOrders}
              icon={<XCircle className="h-6 w-6" />}
              bgColor="bg-red-100 dark:bg-red-900/30"
              textColor="text-red-600 dark:text-red-400"
              percentage={canceledPercentage}
            />
          </div>
        </div>

        {/* Summary Info */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-700/50">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-blue-900 dark:text-white">
            Ringkasan Performa
          </h3>
          <div className="grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <p className="text-slate-600 dark:text-slate-400">
                % Pesanan Selesai
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                {statistics.totalOrders > 0
                  ? (
                      (statistics.completedOrders /
                        statistics.totalOrders) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-400">
                % Pesanan Diproses
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                {statistics.totalOrders > 0
                  ? (
                      (statistics.processingOrders /
                        statistics.totalOrders) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-400">
                % Pesanan Batal
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                {statistics.totalOrders > 0
                  ? (
                      (statistics.canceledOrders /
                        statistics.totalOrders) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
