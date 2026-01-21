'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, RefreshCw } from 'lucide-react';

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
          console.log('Orders Detail Data:', data.data);
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

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="px-4 text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-blue-600" />
          <p className="text-xs text-gray-700 dark:text-gray-400 sm:text-sm">
            Memuat data laporan...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-5 dark:bg-slate-900 sm:px-6 md:px-10 lg:px-16 xl:px-20">
      <div className="w-full space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="w-full space-y-3 sm:flex sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl lg:text-3xl">
              Laporan & Statistik
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Kelola dan analisis data bisnis Anda
            </p>
            {activeFilterStartDate && activeFilterEndDate && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                Filter aktif: {activeFilterStartDate} s/d{' '}
                {activeFilterEndDate}
              </p>
            )}
          </div>
          <button
            onClick={() =>
              fetchAllData(activeFilterStartDate, activeFilterEndDate)
            }
            className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 sm:w-auto sm:py-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Alerts */}
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

        {/* Filter Card */}
        <FilterCard
          startDate={startDate}
          endDate={endDate}
          exportFormat={exportFormat}
          isExporting={isExporting}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onExportFormatChange={setExportFormat}
          onApplyFilter={handleApplyFilter}
          onExport={handleExport}
          onRefresh={() =>
            fetchAllData(activeFilterStartDate, activeFilterEndDate)
          }
        />

        {/* Tabs */}
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === 'dashboard' && dashboardData && (
          <DashboardTab
            data={dashboardData}
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === 'basic' && reportsData && (
          <BasicTab
            data={reportsData}
            ordersDetail={ordersDetailData}
            formatCurrency={formatCurrency}
            isLoadingOrdersDetail={false}
          />
        )}

        {activeTab === 'statistics' && statisticsData && (
          <StatisticsTab
            data={statisticsData}
            formatCurrency={formatCurrency}
          />
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
