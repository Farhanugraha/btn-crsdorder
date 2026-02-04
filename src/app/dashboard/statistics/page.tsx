'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
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
  Calendar,
  Users,
  Package,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Download,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
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

type FilterType = 'hari-ini' | 'minggu-ini' | 'bulan-ini' | 'kustom';

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
  const [filterType, setFilterType] =
    useState<FilterType>('bulan-ini');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    ringkasan: true,
    grafik: true,
    status: true,
    performa: true
  });
  const [isExporting, setIsExporting] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fungsi untuk mendapatkan tanggal awal berdasarkan filter
  const getStartDateByFilter = useCallback(
    (filter: FilterType): string => {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      switch (filter) {
        case 'hari-ini':
          return todayStr;
        case 'minggu-ini':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 6);
          return weekAgo.toISOString().split('T')[0];
        case 'bulan-ini':
          const monthAgo = new Date(today);
          monthAgo.setDate(1);
          return monthAgo.toISOString().split('T')[0];
        case 'kustom':
          return customStartDate || todayStr;
        default:
          return todayStr;
      }
    },
    [customStartDate]
  );

  const getEndDateByFilter = useCallback((): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  const fetchStatistics = useCallback(
    async (
      startDate?: string,
      endDate?: string,
      showError = true
    ) => {
      try {
        if (!statistics) {
          setIsLoading(true);
        } else {
          setIsRefreshing(true);
        }

        setError(null);

        const token = localStorage.getItem('auth_token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const finalStartDate =
          startDate || getStartDateByFilter(filterType);
        const finalEndDate = endDate || getEndDateByFilter();

        const params = new URLSearchParams({
          start_date: finalStartDate,
          end_date: finalEndDate
        });

        const url = `${apiUrl}/api/admin/statistics?${params.toString()}`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        });

        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Gagal mengambil data');
        }

        const data = await response.json();

        if (data.success && data.data) {
          setStatistics(data.data);
          setChartData(data.data.chartData || []);
          setError(null);
        } else {
          throw new Error(data.message || 'Gagal memuat data');
        }
      } catch (err) {
        if (showError) {
          setError(
            err instanceof Error
              ? err.message
              : 'Terjadi kesalahan saat mengambil data'
          );
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [
      apiUrl,
      router,
      statistics,
      filterType,
      getStartDateByFilter,
      getEndDateByFilter
    ]
  );

  // Inisialisasi tanggal kustom dengan bulan ini
  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    setCustomStartDate(firstDayOfMonth.toISOString().split('T')[0]);
    setCustomEndDate(today.toISOString().split('T')[0]);

    // Load data awal
    fetchStatistics(
      firstDayOfMonth.toISOString().split('T')[0],
      today.toISOString().split('T')[0],
      false
    );
  }, []);

  // Load data saat filter berubah
  useEffect(() => {
    if (filterType !== 'kustom') {
      const startDate = getStartDateByFilter(filterType);
      const endDate = getEndDateByFilter();
      fetchStatistics(startDate, endDate, false);
    }
  }, [filterType]);

  // Hitung data pie chart
  const { pieChartData, pieColors, percentages } = useMemo(() => {
    if (!statistics) {
      return {
        pieChartData: [],
        pieColors: [],
        percentages: { completed: 0, processing: 0, canceled: 0 }
      };
    }

    const total =
      statistics.completedOrders +
      statistics.processingOrders +
      statistics.canceledOrders;

    const data = [
      {
        name: 'Selesai',
        value: statistics.completedOrders,
        color: '#10b981',
        percentage:
          total > 0 ? (statistics.completedOrders / total) * 100 : 0
      },
      {
        name: 'Diproses',
        value: statistics.processingOrders,
        color: '#f59e0b',
        percentage:
          total > 0 ? (statistics.processingOrders / total) * 100 : 0
      },
      {
        name: 'Dibatalkan',
        value: statistics.canceledOrders,
        color: '#ef4444',
        percentage:
          total > 0 ? (statistics.canceledOrders / total) * 100 : 0
      }
    ].filter((item) => item.value > 0);

    const colors = data.map((item) => item.color);

    return {
      pieChartData: data,
      pieColors: colors,
      percentages: {
        completed:
          total > 0 ? (statistics.completedOrders / total) * 100 : 0,
        processing:
          total > 0 ? (statistics.processingOrders / total) * 100 : 0,
        canceled:
          total > 0 ? (statistics.canceledOrders / total) * 100 : 0
      }
    };
  }, [statistics]);

  // Format currency dan number
  const formatters = useMemo(
    () => ({
      currency: (value: number) => {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0
        }).format(value);
      },
      number: (value: number) => {
        return new Intl.NumberFormat('id-ID').format(value);
      }
    }),
    []
  );

  const handleFilterChange = useCallback((type: FilterType) => {
    setFilterType(type);
    setError(null);
  }, []);

  const handleCustomDateFilter = useCallback(() => {
    if (!customStartDate || !customEndDate) {
      setError('Silakan pilih tanggal mulai dan tanggal selesai');
      return;
    }
    if (new Date(customStartDate) > new Date(customEndDate)) {
      setError('Tanggal mulai harus lebih awal dari tanggal selesai');
      return;
    }
    fetchStatistics(customStartDate, customEndDate);
  }, [customStartDate, customEndDate, fetchStatistics]);

  const handleExportData = async () => {
    if (!statistics) return;

    setIsExporting(true);
    try {
      const exportData = {
        ...statistics,
        periode: {
          filter: filterType,
          tanggal: {
            mulai: getStartDateByFilter(filterType),
            selesai: getEndDateByFilter()
          },
          diekspor: new Date().toISOString()
        }
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `statistik-${
        new Date().toISOString().split('T')[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Gagal mengekspor data');
    } finally {
      setIsExporting(false);
    }
  };

  const toggleSection = useCallback(
    (section: keyof typeof expandedSections) => {
      setExpandedSections((prev) => ({
        ...prev,
        [section]: !prev[section]
      }));
    },
    []
  );

  // Komponen pie chart
  const OptimizedPieChart = useMemo(() => {
    if (pieChartData.length === 0) {
      return (
        <div className="flex h-[250px] items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            Tidak ada data status tersedia
          </p>
        </div>
      );
    }

    return (
      <>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              label={(entry) =>
                `${entry.name}: ${formatters.number(entry.value)}`
              }
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={500}
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={pieColors[index]}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <RechartsTooltip
              formatter={(value: unknown) => [
                formatters.number(Number(value) || 0),
                'Jumlah'
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-6 grid grid-cols-3 gap-2">
          {pieChartData.map((item, index) => (
            <div key={item.name} className="text-center">
              <div className="inline-flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: pieColors[index] }}
                />
                <span className="text-sm font-medium">
                  {item.name}
                </span>
              </div>
              <p
                className="mt-1 text-xl font-bold"
                style={{ color: pieColors[index] }}
              >
                {formatters.number(item.value)}
              </p>
              <p className="text-xs text-gray-500">
                {item.percentage.toFixed(1)}% dari total
              </p>
            </div>
          ))}
        </div>
      </>
    );
  }, [pieChartData, pieColors, formatters]);

  // Komponen line chart
  const OptimizedLineChart = useMemo(() => {
    if (chartData.length === 0) {
      return (
        <div className="flex h-[300px] items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            Tidak ada data grafik tersedia
          </p>
        </div>
      );
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="rounded-lg bg-white p-3 shadow-lg dark:bg-gray-800">
            <p className="mb-2 font-medium text-gray-900 dark:text-white">
              Tanggal: {label}
            </p>
            {payload.map((entry: any, index: number) => (
              <p
                key={index}
                className="text-sm"
                style={{ color: entry.color }}
              >
                {entry.name}:{' '}
                {entry.name === 'Pendapatan'
                  ? formatters.currency(entry.value)
                  : formatters.number(entry.value)}
              </p>
            ))}
          </div>
        );
      }
      return null;
    };

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickFormatter={formatters.number}
            tickLine={false}
          />
          <RechartsTooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={chartData.length <= 30}
            name="Pesanan"
            isAnimationActive={true}
            animationDuration={500}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={2}
            dot={chartData.length <= 30}
            name="Pendapatan"
            isAnimationActive={true}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }, [chartData, formatters]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 animate-pulse text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Memuat Statistik
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Sedang mengambil data statistik...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 dark:bg-gray-900 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
            <div className="flex items-start gap-4">
              <AlertCircle className="mt-1 h-6 w-6 flex-shrink-0 text-red-600 dark:text-red-400" />
              <div>
                <h2 className="text-lg font-bold text-red-900 dark:text-red-300">
                  Gagal Memuat Data
                </h2>
                <p className="mt-1 text-sm text-red-800 dark:text-red-400">
                  {error || 'Tidak dapat memuat data statistik'}
                </p>
                <Button
                  onClick={() =>
                    fetchStatistics(undefined, undefined, true)
                  }
                  className="mt-4 bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 dark:from-gray-900 dark:to-blue-950/20 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">
                Dashboard Statistik
              </h1>
              <p className="mt-2 opacity-90">
                Pantau performa dan analisis pesanan Anda
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() =>
                  fetchStatistics(undefined, undefined, true)
                }
                disabled={isRefreshing}
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    isRefreshing ? 'animate-spin' : ''
                  }`}
                />
                <span className="ml-2">Segarkan</span>
              </Button>
              <Button
                onClick={handleExportData}
                disabled={isExporting}
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20"
              >
                <Download className="h-4 w-4" />
                <span className="ml-2">Ekspor</span>
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="animate-fade-in mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  {error}
                </p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-amber-600 hover:text-amber-800 dark:text-amber-400"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Statistik Utama */}
        <div className="mb-8">
          <div
            className="mb-4 flex cursor-pointer items-center justify-between rounded-xl bg-white p-4 dark:bg-gray-800"
            onClick={() => toggleSection('ringkasan')}
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Ringkasan Statistik
              </h3>
            </div>
            {expandedSections.ringkasan ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>

          {expandedSections.ringkasan && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Pendapatan
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                      {formatters.currency(statistics.totalRevenue)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <TrendingUp
                        className={`h-4 w-4 ${
                          statistics.revenueGrowth >= 0
                            ? 'text-emerald-500'
                            : 'text-red-500'
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          statistics.revenueGrowth >= 0
                            ? 'text-emerald-600'
                            : 'text-red-600'
                        }`}
                      >
                        {statistics.revenueGrowth >= 0 ? '+' : ''}
                        {statistics.revenueGrowth.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                    <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Pesanan
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                      {formatters.number(statistics.totalOrders)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <TrendingUp
                        className={`h-4 w-4 ${
                          statistics.orderGrowth >= 0
                            ? 'text-emerald-500'
                            : 'text-red-500'
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          statistics.orderGrowth >= 0
                            ? 'text-emerald-600'
                            : 'text-red-600'
                        }`}
                      >
                        {statistics.orderGrowth >= 0 ? '+' : ''}
                        {statistics.orderGrowth.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
                    <ShoppingCart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Pesanan Hari Ini
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                      {formatters.number(statistics.todayOrders)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {formatters.currency(statistics.todayRevenue)}{' '}
                      pendapatan
                    </p>
                  </div>
                  <div className="rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900/30">
                    <Package className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Rata-rata Nilai Pesanan
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                      {formatters.currency(
                        statistics.averageOrderValue
                      )}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Per transaksi
                    </p>
                  </div>
                  <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-900/30">
                    <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 rounded-xl bg-white p-4 dark:bg-gray-800 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Filter Periode
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'hari-ini' as FilterType, label: 'Hari Ini' },
                {
                  key: 'minggu-ini' as FilterType,
                  label: 'Minggu Ini'
                },
                {
                  key: 'bulan-ini' as FilterType,
                  label: 'Bulan Ini'
                },
                { key: 'kustom' as FilterType, label: 'Kustom' }
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  onClick={() => handleFilterChange(key)}
                  variant={filterType === key ? 'default' : 'outline'}
                  size="sm"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {filterType === 'kustom' && (
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) =>
                      setCustomStartDate(e.target.value)
                    }
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleCustomDateFilter}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Terapkan Filter
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Grafik Section */}
        <div className="mb-8">
          <div
            className="mb-4 flex cursor-pointer items-center justify-between rounded-xl bg-white p-4 dark:bg-gray-800"
            onClick={() => toggleSection('grafik')}
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Analisis Grafik
              </h3>
            </div>
            {expandedSections.grafik ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>

          {expandedSections.grafik && (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Grafik Trend */}
              <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LineChartIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Tren Pesanan & Pendapatan
                    </h4>
                  </div>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                {OptimizedLineChart}
              </div>

              {/* Grafik Status */}
              <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Distribusi Status Pesanan
                    </h4>
                  </div>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                {OptimizedPieChart}
              </div>
            </div>
          )}
        </div>

        {/* Status Pesanan Section */}
        <div className="mb-8">
          <div
            className="mb-4 flex cursor-pointer items-center justify-between rounded-xl bg-white p-4 dark:bg-gray-800"
            onClick={() => toggleSection('status')}
          >
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Status Pesanan
              </h3>
            </div>
            {expandedSections.status ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>

          {expandedSections.status && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border-l-4 border-amber-500 bg-white p-5 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Sedang Diproses
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                      {formatters.number(statistics.processingOrders)}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${percentages.processing}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {percentages.processing.toFixed(1)}% dari total
                  </p>
                </div>
              </div>

              <div className="rounded-xl border-l-4 border-emerald-500 bg-white p-5 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Selesai
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                      {formatters.number(statistics.completedOrders)}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${percentages.completed}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {percentages.completed.toFixed(1)}% dari total
                  </p>
                </div>
              </div>

              <div className="rounded-xl border-l-4 border-red-500 bg-white p-5 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Dibatalkan
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                      {formatters.number(statistics.canceledOrders)}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-red-500 transition-all duration-500"
                      style={{ width: `${percentages.canceled}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {percentages.canceled.toFixed(1)}% dari total
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Metrik Performa */}
        <div className="rounded-xl bg-white p-6 dark:bg-gray-800">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Metrik Performa
            </h3>
            <span className="text-sm text-gray-500">
              Terakhir diperbarui:{' '}
              {new Date().toLocaleDateString('id-ID')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tingkat Penyelesaian
              </p>
              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {statistics.totalOrders > 0
                  ? (
                      (statistics.completedOrders /
                        statistics.totalOrders) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
              <p className="text-xs text-gray-500">
                {formatters.number(statistics.completedOrders)} dari{' '}
                {formatters.number(statistics.totalOrders)} pesanan
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tingkat Pengerjaan
              </p>
              <p className="mt-2 text-2xl font-bold text-amber-600">
                {statistics.totalOrders > 0
                  ? (
                      (statistics.processingOrders /
                        statistics.totalOrders) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
              <p className="text-xs text-gray-500">
                {formatters.number(statistics.processingOrders)} dari{' '}
                {formatters.number(statistics.totalOrders)} pesanan
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tingkat Pembatalan
              </p>
              <p className="mt-2 text-2xl font-bold text-red-600">
                {statistics.totalOrders > 0
                  ? (
                      (statistics.canceledOrders /
                        statistics.totalOrders) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
              <p className="text-xs text-gray-500">
                {formatters.number(statistics.canceledOrders)} dari{' '}
                {formatters.number(statistics.totalOrders)} pesanan
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pertumbuhan Pendapatan
              </p>
              <p
                className={`mt-2 text-2xl font-bold ${
                  statistics.revenueGrowth >= 0
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }`}
              >
                {statistics.revenueGrowth >= 0 ? '+' : ''}
                {statistics.revenueGrowth.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">
                Dibandingkan periode sebelumnya
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
