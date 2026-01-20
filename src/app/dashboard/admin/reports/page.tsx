// app/dashboard/admin/reports/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, RefreshCw } from 'lucide-react';

// Import Components
import { FilterCard } from '@/components/reports/FilterCard';
import { Tabs } from '@/components/reports/Tabs';
import { DashboardTab } from '@/components/reports/DashboardTab';
import { BasicTab } from '@/components/reports/BasicTab';
import { StatisticsTab } from '@/components/reports/StatisticsTab';
import {
  SuccessAlert,
  ErrorAlert
} from '@/components/reports/Alerts';

// Import Export Functions
import {
  generateOrdersAuditTXT,
  generateOrdersAuditCSV,
  downloadFile,
  type OrdersDetail
} from '@/lib/exportOrdersAudit';

// Types
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
type ExportFormat = 'csv' | 'pdf';

const ReportsPage = () => {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // State Management
  const [activeTab, setActiveTab] = useState<ReportTab>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    null
  );

  // Data State
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
  const [isLoadingOrdersDetail, setIsLoadingOrdersDetail] =
    useState(false);

  // Filter State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exportFormat, setExportFormat] =
    useState<ExportFormat>('csv');

  // Initialize dates on mount
  useEffect(() => {
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const startDateStr = monthAgo.toISOString().split('T')[0];
    const endDateStr = today.toISOString().split('T')[0];

    setStartDate(startDateStr);
    setEndDate(endDateStr);

    const timer = setTimeout(() => {
      fetchAllData(startDateStr, endDateStr);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  /**
   * Format currency to IDR
   */
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  /**
   * Fetch all data from API
   */
  const fetchAllData = async (
    start: string,
    end: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      if (!apiUrl) {
        setError('API tidak terkonfigurasi');
        setIsLoading(false);
        return;
      }

      // Fetch Dashboard Data
      await fetchDashboard(token);

      // Fetch Reports Data
      await fetchReports(token);

      // Fetch Statistics Data
      await fetchStatistics(token, start, end);

      // Fetch Orders Detail
      await fetchOrdersDetail(token, start, end);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Gagal memuat data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch dashboard data
   */
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

  /**
   * Fetch reports data
   */
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

  /**
   * Fetch statistics data with date range
   */
  const fetchStatistics = async (
    token: string,
    start: string,
    end: string
  ): Promise<void> => {
    try {
      const params = new URLSearchParams();
      params.append('start_date', start);
      params.append('end_date', end);

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

  /**
   * Fetch orders detail with items
   */
  const fetchOrdersDetail = async (
    token: string,
    start: string,
    end: string
  ): Promise<void> => {
    try {
      setIsLoadingOrdersDetail(true);
      const params = new URLSearchParams();
      params.append('start_date', start);
      params.append('end_date', end);

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
      }
    } catch (err) {
      console.error('Orders detail fetch error:', err);
    } finally {
      setIsLoadingOrdersDetail(false);
    }
  };

  /**
   * Handle apply filter
   */
  const handleApplyFilter = (): void => {
    if (!startDate || !endDate) {
      setError('Silakan pilih tanggal awal dan akhir');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Tanggal awal harus lebih kecil dari tanggal akhir');
      return;
    }

    fetchAllData(startDate, endDate);
  };

  /**
   * Handle export - Main Export Function
   * Menggunakan generateOrdersAuditTXT & generateOrdersAuditCSV dari exportOrdersAudit.ts
   */
  const handleExport = (): void => {
    try {
      setIsExporting(true);
      setError(null);

      // Check if ordersDetailData exists
      if (!ordersDetailData) {
        setError('Data pesanan tidak tersedia untuk di-export');
        setIsExporting(false);
        return;
      }

      if (exportFormat === 'csv') {
        exportOrdersDetailAsCSV();
      } else {
        exportOrdersDetailAsPDF();
      }

      setSuccessMessage(
        `Export ${exportFormat.toUpperCase()} berhasil dibuat`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Gagal export laporan');
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Export orders detail as PDF (TXT) format
   * Menggunakan generateOrdersAuditTXT dari exportOrdersAudit.ts
   */
  const exportOrdersDetailAsPDF = (): void => {
    if (!ordersDetailData) return;

    try {
      const txtContent = generateOrdersAuditTXT(ordersDetailData);
      downloadFile(
        txtContent,
        `audit-orders-${ordersDetailData.period.start_date}-to-${ordersDetailData.period.end_date}.txt`,
        'text/plain;charset=utf-8'
      );
    } catch (err) {
      console.error('PDF export error:', err);
      throw err;
    }
  };

  /**
   * Export orders detail as CSV format
   * Menggunakan generateOrdersAuditCSV dari exportOrdersAudit.ts
   */
  const exportOrdersDetailAsCSV = (): void => {
    if (!ordersDetailData) return;

    try {
      const csvContent = generateOrdersAuditCSV(ordersDetailData);
      downloadFile(
        csvContent,
        `audit-orders-${ordersDetailData.period.start_date}-to-${ordersDetailData.period.end_date}.csv`,
        'text/csv;charset=utf-8'
      );
    } catch (err) {
      console.error('CSV export error:', err);
      throw err;
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Memuat data laporan...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-900 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header Section */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Laporan & Statistik
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Kelola dan analisis data bisnis Anda
            </p>
          </div>
          <button
            onClick={() => fetchAllData(startDate, endDate)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Alerts Section */}
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
          onRefresh={() => fetchAllData(startDate, endDate)}
        />

        {/* Tabs Navigation */}
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
            isLoadingOrdersDetail={isLoadingOrdersDetail}
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
