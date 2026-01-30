'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  RefreshCw,
  BarChart3,
  FileText,
  TrendingUp,
  Download,
  Calendar,
  Filter
} from 'lucide-react';

import { FilterCard } from '@/components/reports/FilterCard';
import { Tabs } from '@/components/reports/Tabs';
import { DashboardTab } from '@/components/reports/DashboardTab';
import { BasicTab } from '@/components/reports/BasicTab';
import { StatisticsTab } from '@/components/reports/StatisticsTab';
import {
  SuccessAlert,
  ErrorAlert
} from '@/components/reports/Alerts';

import {
  generateOrdersAuditTXT,
  generateOrdersAuditCSV,
  generateOrdersAuditExcel,
  generateOrdersAuditPDF,
  downloadFile,
  type OrdersDetail
} from '@/lib/exportOrdersAudit';

interface DashboardData {
  orders: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    canceled: number;
  };
  payments: {
    total_revenue: number;
    pending_payments: number;
  };
  users: {
    total_users: number;
    total_admins: number;
  };
}

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
  user_statistics: {
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

type ReportTab = 'dashboard' | 'basic' | 'statistics';
type ExportFormat = 'csv' | 'pdf' | 'excel' | 'txt';

const ReportsPage = () => {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [activeTab, setActiveTab] = useState<ReportTab>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    null
  );

  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);
  const [reportsData, setReportsData] = useState<ReportsData | null>(
    null
  );
  const [statisticsData, setStatisticsData] =
    useState<StatisticsData | null>(null);
  const [ordersDetailData, setOrdersDetailData] = useState<
    OrdersDetail | undefined
  >(undefined);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exportFormat, setExportFormat] =
    useState<ExportFormat>('excel');

  // Track current active filter dates
  const [activeFilterStartDate, setActiveFilterStartDate] =
    useState('');
  const [activeFilterEndDate, setActiveFilterEndDate] = useState('');

  // Initialize dates and fetch data
  useEffect(() => {
    const initializeFilter = async () => {
      const token = getAuthToken();
      if (!token || !apiUrl) {
        setError('Konfigurasi tidak lengkap');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch orders detail without date filter to get earliest data
        const response = await fetch(
          `${apiUrl}/api/admin/orders-detail`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            },
            cache: 'no-cache'
          }
        );

        let startDateStr = '';
        let endDateStr = new Date().toISOString().split('T')[0];

        if (response.ok) {
          const data = await response.json();
          if (
            data.success &&
            data.data?.orders_by_date &&
            data.data.orders_by_date.length > 0
          ) {
            // Get first date from data
            const firstDate = data.data.orders_by_date[0].date;
            startDateStr = firstDate;
          } else {
            // Fallback: if no data, use 1 month ago
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            startDateStr = monthAgo.toISOString().split('T')[0];
          }
        } else {
          // Fallback: if request fails, use 1 month ago
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          startDateStr = monthAgo.toISOString().split('T')[0];
        }

        setStartDate(startDateStr);
        setEndDate(endDateStr);
        setActiveFilterStartDate(startDateStr);
        setActiveFilterEndDate(endDateStr);

        // Fetch all data with determined dates
        const timer = setTimeout(() => {
          fetchAllData(startDateStr, endDateStr);
        }, 300);

        return () => clearTimeout(timer);
      } catch (err) {
        console.error('Error initializing filter:', err);
        // Fallback: use 1 month ago
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        const startDateStr = monthAgo.toISOString().split('T')[0];
        const endDateStr = new Date().toISOString().split('T')[0];

        setStartDate(startDateStr);
        setEndDate(endDateStr);
        setActiveFilterStartDate(startDateStr);
        setActiveFilterEndDate(endDateStr);

        const timer = setTimeout(() => {
          fetchAllData(startDateStr, endDateStr);
        }, 300);

        return () => clearTimeout(timer);
      }
    };

    initializeFilter();
  }, []);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getAuthToken = (): string | null => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/auth/login');
    }
    return token;
  };

  const fetchAllData = async (
    start: string,
    end: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token || !apiUrl) {
        setError('Konfigurasi tidak lengkap');
        setIsLoading(false);
        return;
      }

      await Promise.all([
        fetchDashboard(token),
        fetchReports(token),
        fetchStatistics(token, start, end),
        fetchOrdersDetail(token, start, end)
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Gagal memuat data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboard = async (token: string): Promise<void> => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        },
        cache: 'no-cache'
      });

      if (response.status === 401) {
        router.push('/auth/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setDashboardData(data.data);
        }
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }
  };

  const fetchReports = async (token: string): Promise<void> => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/reports`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        },
        cache: 'no-cache'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setReportsData(data.data);
        }
      }
    } catch (err) {
      console.error('Reports fetch error:', err);
    }
  };

  const fetchStatistics = async (
    token: string,
    start: string,
    end: string
  ): Promise<void> => {
    try {
      const params = new URLSearchParams({
        start_date: start,
        end_date: end
      });
      const response = await fetch(
        `${apiUrl}/api/admin/statistics?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          },
          cache: 'no-cache'
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setStatisticsData(data.data);
        }
      }
    } catch (err) {
      console.error('Statistics fetch error:', err);
    }
  };

  const fetchOrdersDetail = async (
    token: string,
    start: string,
    end: string
  ): Promise<void> => {
    try {
      const params = new URLSearchParams({
        start_date: start,
        end_date: end
      });
      const response = await fetch(
        `${apiUrl}/api/admin/orders-detail?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          },
          cache: 'no-cache'
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setOrdersDetailData(data.data);
        }
      } else {
        console.error(
          'Orders detail response not ok:',
          response.status
        );
      }
    } catch (err) {
      console.error('Orders detail fetch error:', err);
    }
  };

  const handleApplyFilter = (): void => {
    if (!startDate || !endDate) {
      setError('Silakan pilih tanggal awal dan akhir');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Tanggal awal harus lebih kecil dari tanggal akhir');
      return;
    }

    // Update active filter dates
    setActiveFilterStartDate(startDate);
    setActiveFilterEndDate(endDate);

    // Fetch data with new filter
    fetchAllData(startDate, endDate);
  };

  const handleExport = async (): Promise<void> => {
    try {
      setIsExporting(true);
      setError(null);

      // Validate that we have data for the current filter
      if (!ordersDetailData || !ordersDetailData.orders_by_date) {
        setError(
          'Data pesanan tidak tersedia. Pastikan ada pesanan dalam range tanggal yang dipilih.'
        );
        setIsExporting(false);
        return;
      }

      // Check if the exported data matches current filter
      if (
        ordersDetailData.period.start_date !==
          activeFilterStartDate ||
        ordersDetailData.period.end_date !== activeFilterEndDate
      ) {
        setError(
          'Filter telah berubah. Silakan klik "Terapkan" terlebih dahulu untuk memperbarui data.'
        );
        setIsExporting(false);
        return;
      }

      // Check if there's actually data to export
      if (ordersDetailData.orders_by_date.length === 0) {
        setError(
          'Tidak ada data pesanan untuk periode yang dipilih. Silakan ubah tanggal filter.'
        );
        setIsExporting(false);
        return;
      }

      switch (exportFormat) {
        case 'csv': {
          const csvContent = generateOrdersAuditCSV(ordersDetailData);
          downloadFile(
            csvContent,
            `audit-orders-${ordersDetailData.period.start_date}-to-${ordersDetailData.period.end_date}.csv`,
            'text/csv;charset=utf-8'
          );
          break;
        }

        case 'excel': {
          await generateOrdersAuditExcel(ordersDetailData);
          break;
        }

        case 'pdf': {
          await generateOrdersAuditPDF(ordersDetailData);
          break;
        }

        case 'txt': {
          const txtContent = generateOrdersAuditTXT(ordersDetailData);
          downloadFile(
            txtContent,
            `audit-orders-${ordersDetailData.period.start_date}-to-${ordersDetailData.period.end_date}.txt`,
            'text/plain;charset=utf-8'
          );
          break;
        }

        default:
          throw new Error('Format export tidak diketahui');
      }

      setSuccessMessage(
        `Export ${exportFormat.toUpperCase()} berhasil dibuat untuk periode ${activeFilterStartDate} s/d ${activeFilterEndDate}`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Gagal export laporan'
      );
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400"></div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Memuat laporan...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-5 lg:px-6">
        {/* Header Section */}
        <div className="mb-5 sm:mb-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 p-2">
                  <BarChart3 className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                    Laporan & Analytics
                  </h1>
                  <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                    Analisis data dan statistik bisnis
                  </p>
                </div>
              </div>

              {activeFilterStartDate && activeFilterEndDate && (
                <div className="mt-2 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Periode: {activeFilterStartDate} -{' '}
                    {activeFilterEndDate}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  fetchAllData(
                    activeFilterStartDate,
                    activeFilterEndDate
                  )
                }
                className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 sm:px-3.5 sm:py-2 sm:text-sm"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${
                    isLoading ? 'animate-spin' : ''
                  } sm:h-4 sm:w-4`}
                />
                <span className="hidden sm:inline">Refresh</span>
                <span className="inline sm:hidden">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="mb-4 space-y-2">
          {successMessage && (
            <SuccessAlert
              message={successMessage}
              onClose={() => setSuccessMessage(null)}
            />
          )}

          {error && (
            <ErrorAlert
              message={error}
              onClose={() => setError(null)}
            />
          )}
        </div>

        {/* Filter Card - Compact Version */}
        <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold text-gray-900 dark:text-white sm:text-sm">
                Filter & Export
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <span className="hidden sm:inline">Format:</span>
              <select
                value={exportFormat}
                onChange={(e) =>
                  setExportFormat(e.target.value as ExportFormat)
                }
                className="rounded border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
                <option value="txt">TXT</option>
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Tanggal Mulai
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Tanggal Akhir
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={handleApplyFilter}
              disabled={isLoading}
              className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 sm:text-sm"
            >
              Terapkan Filter
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || !ordersDetailData}
              className="flex items-center gap-1.5 rounded-lg border border-green-600 bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50 sm:text-sm"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>

          {isExporting && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <Loader2 className="h-3 w-3 animate-spin" />
              Sedang mengekspor data...
            </div>
          )}
        </div>

        {/* Tabs Navigation */}
        <div className="mb-4">
          <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-xs font-medium sm:px-4 sm:text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('basic')}
              className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-xs font-medium sm:px-4 sm:text-sm ${
                activeTab === 'basic'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Laporan Dasar
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-xs font-medium sm:px-4 sm:text-sm ${
                activeTab === 'statistics'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Statistik Detail
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'dashboard' && dashboardData ? (
            <DashboardTab
              data={dashboardData}
              formatCurrency={formatCurrency}
            />
          ) : activeTab === 'dashboard' && !dashboardData ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <div className="text-center">
                <BarChart3 className="mx-auto mb-3 h-8 w-8 text-gray-400 dark:text-gray-600" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Data dashboard tidak tersedia
                </p>
              </div>
            </div>
          ) : null}

          {activeTab === 'basic' && reportsData ? (
            <BasicTab
              data={reportsData}
              ordersDetail={ordersDetailData}
              formatCurrency={formatCurrency}
              isLoadingOrdersDetail={false}
            />
          ) : activeTab === 'basic' && !reportsData ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <div className="text-center">
                <FileText className="mx-auto mb-3 h-8 w-8 text-gray-400 dark:text-gray-600" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Data laporan tidak tersedia
                </p>
              </div>
            </div>
          ) : null}

          {activeTab === 'statistics' && statisticsData ? (
            <StatisticsTab
              data={statisticsData}
              formatCurrency={formatCurrency}
            />
          ) : activeTab === 'statistics' && !statisticsData ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <div className="text-center">
                <TrendingUp className="mx-auto mb-3 h-8 w-8 text-gray-400 dark:text-gray-600" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Data statistik tidak tersedia
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Empty State - No Data at All */}
        {!dashboardData && !reportsData && !statisticsData && (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <BarChart3 className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
              Belum ada data laporan
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Data akan muncul setelah ada aktivitas dalam sistem
            </p>
            <button
              onClick={() => fetchAllData(startDate, endDate)}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
            >
              Coba Muat Ulang
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportsPage;
