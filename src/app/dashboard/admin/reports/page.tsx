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

  // Filter State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>(
    'csv'
  );

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
   * Handle export
   */
  const handleExport = (): void => {
    try {
      setIsExporting(true);
      setError(null);

      if (exportFormat === 'csv') {
        exportToCsv();
      } else {
        exportToPdf();
      }

      setSuccessMessage(
        `Export ${exportFormat.toUpperCase()} berhasil dibuat`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Gagal export laporan');
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Export data as CSV
   */
  const exportToCsv = (): void => {
    let csv = 'LAPORAN ADMIN\n';
    csv += `Periode: ${startDate} sampai ${endDate}\n`;
    csv += `Tanggal Export: ${new Date().toLocaleString(
      'id-ID'
    )}\n\n`;

    // Dashboard Section
    if (dashboardData) {
      csv += '=== DASHBOARD ===\n';
      csv += 'PESANAN\n';
      csv += `Total,${dashboardData.orders.total}\n`;
      csv += `Tertunda,${dashboardData.orders.pending}\n`;
      csv += `Diproses,${dashboardData.orders.processing}\n`;
      csv += `Selesai,${dashboardData.orders.completed}\n`;
      csv += `Dibatalkan,${dashboardData.orders.canceled}\n\n`;
      csv += 'PEMBAYARAN\n';
      csv += `Total Revenue,${dashboardData.payments.total_revenue}\n`;
      csv += `Tertunda,${dashboardData.payments.pending_payments}\n\n`;
      csv += 'PENGGUNA\n';
      csv += `Total Pengguna,${dashboardData.users.total_users}\n`;
      csv += `Total Admin,${dashboardData.users.total_admins}\n\n`;
    }

    // Reports Section
    if (reportsData) {
      csv += '=== LAPORAN DASAR ===\n';
      csv += `Total Pesanan,${reportsData.total_orders}\n`;
      csv += `Pengguna Aktif,${reportsData.user_statistics.active_users}\n\n`;

      if (reportsData.orders_by_status.length > 0) {
        csv += 'PESANAN BERDASARKAN STATUS\n';
        csv += 'Status,Jumlah\n';
        reportsData.orders_by_status.forEach((item) => {
          csv += `${item.status},${item.total}\n`;
        });
        csv += '\n';
      }

      if (reportsData.payment_summary.length > 0) {
        csv += 'RINGKASAN PEMBAYARAN\n';
        csv += 'Status,Transaksi,Jumlah\n';
        reportsData.payment_summary.forEach((item) => {
          csv += `${item.status},${item.total},${item.total_amount}\n`;
        });
        csv += '\n';
      }

      if (reportsData.top_users.length > 0) {
        csv += 'TOP 10 PENGGUNA\n';
        csv += 'Nama,Email,Pesanan\n';
        reportsData.top_users.forEach((user) => {
          csv += `"${user.name}","${user.email}",${user.orders_count}\n`;
        });
        csv += '\n';
      }
    }

    // Statistics Section
    if (statisticsData) {
      csv += '=== STATISTIK ===\n';
      csv += `Total Pesanan,${statisticsData.totalOrders}\n`;
      csv += `Total Revenue,${statisticsData.totalRevenue}\n`;
      csv += `Rata-rata Nilai Pesanan,${statisticsData.averageOrderValue}\n`;
      csv += `Pesanan Selesai,${statisticsData.completedOrders}\n`;
      csv += `Pesanan Diproses,${statisticsData.processingOrders}\n`;
      csv += `Pesanan Dibatalkan,${statisticsData.canceledOrders}\n`;
      csv += `Pesanan Hari Ini,${statisticsData.todayOrders}\n`;
      csv += `Revenue Hari Ini,${statisticsData.todayRevenue}\n`;
      csv += `Pertumbuhan Revenue,${statisticsData.revenueGrowth.toFixed(
        2
      )}%\n`;
      csv += `Pertumbuhan Pesanan,${statisticsData.orderGrowth.toFixed(
        2
      )}%\n`;
    }

    downloadFile(
      csv,
      `laporan-${startDate}-ke-${endDate}.csv`,
      'text/csv'
    );
  };

  /**
   * Export data as PDF (Text format)
   */
  const exportToPdf = (): void => {
    let text = 'LAPORAN ADMIN\n';
    text += '='.repeat(80) + '\n';
    text += `Periode: ${startDate} sampai ${endDate}\n`;
    text += `Tanggal Export: ${new Date().toLocaleString('id-ID')}\n`;
    text += `Waktu Pembuatan: ${new Date().toLocaleTimeString(
      'id-ID'
    )}\n`;
    text += '='.repeat(80) + '\n\n';

    // Dashboard Section
    if (dashboardData) {
      text += 'DASHBOARD\n';
      text += '-'.repeat(80) + '\n';
      text += 'PESANAN:\n';
      text += `  Total: ${dashboardData.orders.total}\n`;
      text += `  Tertunda: ${dashboardData.orders.pending}\n`;
      text += `  Diproses: ${dashboardData.orders.processing}\n`;
      text += `  Selesai: ${dashboardData.orders.completed}\n`;
      text += `  Dibatalkan: ${dashboardData.orders.canceled}\n\n`;
      text += 'PEMBAYARAN:\n';
      text += `  Total Revenue: ${formatCurrency(
        dashboardData.payments.total_revenue
      )}\n`;
      text += `  Tertunda: ${dashboardData.payments.pending_payments}\n\n`;
      text += 'PENGGUNA:\n';
      text += `  Total Pengguna: ${dashboardData.users.total_users}\n`;
      text += `  Total Admin: ${dashboardData.users.total_admins}\n\n`;
    }

    // Reports Section
    if (reportsData) {
      text += 'LAPORAN DASAR\n';
      text += '-'.repeat(80) + '\n';
      text += `Total Pesanan: ${reportsData.total_orders}\n`;
      text += `Pengguna Aktif: ${reportsData.user_statistics.active_users}\n\n`;
    }

    // Statistics Section
    if (statisticsData) {
      text += 'STATISTIK\n';
      text += '-'.repeat(80) + '\n';
      text += `Total Pesanan: ${statisticsData.totalOrders}\n`;
      text += `Total Revenue: ${formatCurrency(
        statisticsData.totalRevenue
      )}\n`;
      text += `Rata-rata Nilai Pesanan: ${formatCurrency(
        statisticsData.averageOrderValue
      )}\n`;
      text += `Pesanan Selesai: ${statisticsData.completedOrders}\n`;
      text += `Pesanan Diproses: ${statisticsData.processingOrders}\n`;
      text += `Pesanan Dibatalkan: ${statisticsData.canceledOrders}\n`;
      text += `Pesanan Hari Ini: ${statisticsData.todayOrders}\n`;
      text += `Revenue Hari Ini: ${formatCurrency(
        statisticsData.todayRevenue
      )}\n`;
      text += `Pertumbuhan Revenue: ${statisticsData.revenueGrowth.toFixed(
        2
      )}%\n`;
      text += `Pertumbuhan Pesanan: ${statisticsData.orderGrowth.toFixed(
        2
      )}%\n`;
    }

    downloadFile(
      text,
      `laporan-${startDate}-ke-${endDate}.txt`,
      'text/plain'
    );
  };

  /**
   * Download file utility
   */
  const downloadFile = (
    content: string,
    fileName: string,
    type: string
  ): void => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
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
            formatCurrency={formatCurrency}
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
