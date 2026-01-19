'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  CreditCard,
  ShoppingCart,
  AlertCircle,
  Loader2,
  RefreshCw,
  Filter,
  CheckCircle2
} from 'lucide-react';

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

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>(
    'csv'
  );

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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

  const fetchAllData = async (start: string, end: string) => {
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
        return;
      }

      // Fetch Dashboard
      try {
        const dashResponse = await fetch(
          `${apiUrl}/api/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            },
            cache: 'no-cache'
          }
        );

        if (dashResponse.status === 401) {
          router.push('/auth/login');
          return;
        }

        if (dashResponse.ok) {
          const data = await dashResponse.json();
          if (data.success && data.data) {
            setDashboardData(data.data);
          }
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }

      // Fetch Reports
      try {
        const reportsResponse = await fetch(
          `${apiUrl}/api/admin/reports`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            },
            cache: 'no-cache'
          }
        );

        if (reportsResponse.ok) {
          const data = await reportsResponse.json();
          if (data.success && data.data) {
            setReportsData(data.data);
          }
        }
      } catch (err) {
        console.error('Reports fetch error:', err);
      }

      // Fetch Statistics
      try {
        const params = new URLSearchParams();
        params.append('start_date', start);
        params.append('end_date', end);

        const statsResponse = await fetch(
          `${apiUrl}/api/admin/statistics?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            },
            cache: 'no-cache'
          }
        );

        if (statsResponse.ok) {
          const data = await statsResponse.json();
          if (data.success && data.data) {
            setStatisticsData(data.data);
          }
        }
      } catch (err) {
        console.error('Statistics fetch error:', err);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Gagal memuat data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilter = async () => {
    if (!startDate || !endDate) {
      setError('Silakan pilih tanggal awal dan akhir');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Tanggal awal harus lebih kecil dari tanggal akhir');
      return;
    }

    await fetchAllData(startDate, endDate);
  };

  const handleExport = async () => {
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

  const exportToCsv = () => {
    let csv = 'Laporan Admin\n';
    csv += `Periode: ${startDate} sampai ${endDate}\n`;
    csv += `Tanggal Export: ${new Date().toLocaleString(
      'id-ID'
    )}\n\n`;

    if (dashboardData) {
      csv += '=== DASHBOARD ===\n';
      csv += `Total Pesanan,${dashboardData.orders.total}\n`;
      csv += `Pesanan Tertunda,${dashboardData.orders.pending}\n`;
      csv += `Pesanan Diproses,${dashboardData.orders.processing}\n`;
      csv += `Pesanan Selesai,${dashboardData.orders.completed}\n`;
      csv += `Pesanan Dibatalkan,${dashboardData.orders.canceled}\n`;
      csv += `Total Revenue,${dashboardData.payments.total_revenue}\n`;
      csv += `Pembayaran Tertunda,${dashboardData.payments.pending_payments}\n`;
      csv += `Total Pengguna,${dashboardData.users.total_users}\n`;
      csv += `Total Admin,${dashboardData.users.total_admins}\n\n`;
    }

    if (reportsData) {
      csv += '=== BASIC REPORTS ===\n';
      csv += `Total Pesanan,${reportsData.total_orders}\n`;
      csv += `Total Pengguna Aktif,${reportsData.user_statistics.active_users}\n\n`;

      if (reportsData.orders_by_status.length > 0) {
        csv += '=== PESANAN BERDASARKAN STATUS ===\n';
        reportsData.orders_by_status.forEach((item) => {
          csv += `${item.status},${item.total}\n`;
        });
        csv += '\n';
      }

      if (reportsData.payment_summary.length > 0) {
        csv += '=== RINGKASAN PEMBAYARAN ===\n';
        csv += 'Status,Transaksi,Jumlah\n';
        reportsData.payment_summary.forEach((item) => {
          csv += `${item.status},${item.total},${item.total_amount}\n`;
        });
        csv += '\n';
      }

      if (reportsData.top_users.length > 0) {
        csv += '=== TOP 10 PENGGUNA ===\n';
        csv += 'Nama,Email,Jumlah Pesanan\n';
        reportsData.top_users.forEach((user) => {
          csv += `"${user.name}","${user.email}",${user.orders_count}\n`;
        });
      }
    }

    if (statisticsData) {
      csv += '=== STATISTIK ===\n';
      csv += `Total Pesanan,${statisticsData.totalOrders}\n`;
      csv += `Total Revenue,${statisticsData.totalRevenue}\n`;
      csv += `Rata-rata Nilai Pesanan,${statisticsData.averageOrderValue}\n`;
      csv += `Pesanan Selesai,${statisticsData.completedOrders}\n`;
      csv += `Pesanan Diproses,${statisticsData.processingOrders}\n`;
      csv += `Pesanan Dibatalkan,${statisticsData.canceledOrders}\n`;
      csv += `Pesanan Hari Ini,${statisticsData.todayOrders}\n`;
      csv += `Pertumbuhan Revenue,${statisticsData.revenueGrowth.toFixed(
        2
      )}%\n`;
      csv += `Pertumbuhan Pesanan,${statisticsData.orderGrowth.toFixed(
        2
      )}%\n`;
    }

    downloadFile(
      csv,
      `report-${startDate}-to-${endDate}.csv`,
      'text/csv'
    );
  };

  const exportToPdf = () => {
    let text = 'LAPORAN ADMIN\n';
    text += '='.repeat(80) + '\n';
    text += `Periode: ${startDate} sampai ${endDate}\n`;
    text += `Tanggal Export: ${new Date().toLocaleString('id-ID')}\n`;
    text += '='.repeat(80) + '\n\n';

    if (dashboardData) {
      text += 'DASHBOARD\n';
      text += '-'.repeat(80) + '\n';
      text += `Total Pesanan: ${dashboardData.orders.total}\n`;
      text += `Pesanan Tertunda: ${dashboardData.orders.pending}\n`;
      text += `Pesanan Diproses: ${dashboardData.orders.processing}\n`;
      text += `Pesanan Selesai: ${dashboardData.orders.completed}\n`;
      text += `Pesanan Dibatalkan: ${dashboardData.orders.canceled}\n`;
      text += `Total Revenue: ${formatCurrency(
        dashboardData.payments.total_revenue
      )}\n`;
      text += `Pembayaran Tertunda: ${dashboardData.payments.pending_payments}\n`;
      text += `Total Pengguna: ${dashboardData.users.total_users}\n`;
      text += `Total Admin: ${dashboardData.users.total_admins}\n\n`;
    }

    if (reportsData) {
      text += 'BASIC REPORTS\n';
      text += '-'.repeat(80) + '\n';
      text += `Total Pesanan: ${reportsData.total_orders}\n`;
      text += `Total Pengguna Aktif: ${reportsData.user_statistics.active_users}\n\n`;
    }

    if (statisticsData) {
      text += 'STATISTIK PERIODE\n';
      text += '-'.repeat(80) + '\n';
      text += `Total Pesanan: ${statisticsData.totalOrders}\n`;
      text += `Total Revenue: ${formatCurrency(
        statisticsData.totalRevenue
      )}\n`;
      text += `Rata-rata Nilai Pesanan: ${formatCurrency(
        statisticsData.averageOrderValue
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
      `report-${startDate}-to-${endDate}.txt`,
      'text/plain'
    );
  };

  const downloadFile = (
    content: string,
    fileName: string,
    type: string
  ) => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const StatBox = ({
    title,
    value,
    icon: Icon,
    color
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
  }) => (
    <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className={`rounded-lg ${color} flex-shrink-0 p-2.5`}>
          {Icon}
        </div>
      </div>
    </div>
  );

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
        {/* Header */}
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

        {/* Alerts */}
        {successMessage && (
          <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
            <p className="flex-1 text-sm font-medium text-green-800 dark:text-green-300">
              {successMessage}
            </p>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-green-600 hover:text-green-800 dark:text-green-400"
            >
              ✕
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
            <p className="flex-1 text-sm font-medium text-red-800 dark:text-red-300">
              {error}
            </p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 dark:text-red-400"
            >
              ✕
            </button>
          </div>
        )}

        {/* Filter Card */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <Filter className="h-5 w-5" />
            Filter & Export
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                Tanggal Selesai
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                Format Export
              </label>
              <select
                value={exportFormat}
                onChange={(e) =>
                  setExportFormat(e.target.value as 'csv' | 'pdf')
                }
                className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="csv">CSV</option>
                <option value="pdf">PDF (Text)</option>
              </select>
            </div>

            <button
              onClick={handleApplyFilter}
              className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Terapkan
            </button>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Export...' : 'Export'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-700">
          <div className="flex gap-1 rounded-t-lg bg-white dark:bg-slate-800">
            {(
              ['dashboard', 'basic', 'statistics'] as ReportTab[]
            ).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 border-b-2 px-4 py-3 text-center text-sm font-semibold transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {tab === 'dashboard' && '📊 Dashboard'}
                {tab === 'basic' && '📋 Laporan Dasar'}
                {tab === 'statistics' && '📈 Statistik'}
              </button>
            ))}
          </div>
        </div>

        {/* Content - Dashboard Tab */}
        {activeTab === 'dashboard' && dashboardData && (
          <div className="space-y-6">
            {/* Orders Section */}
            <div>
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                Ringkasan Pesanan
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <StatBox
                  title="Total"
                  value={dashboardData.orders.total}
                  icon={
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  }
                  color="bg-blue-100 dark:bg-blue-900/30"
                />
                <StatBox
                  title="Tertunda"
                  value={dashboardData.orders.pending}
                  icon={
                    <Calendar className="h-5 w-5 text-yellow-600" />
                  }
                  color="bg-yellow-100 dark:bg-yellow-900/30"
                />
                <StatBox
                  title="Diproses"
                  value={dashboardData.orders.processing}
                  icon={
                    <FileText className="h-5 w-5 text-amber-600" />
                  }
                  color="bg-amber-100 dark:bg-amber-900/30"
                />
                <StatBox
                  title="Selesai"
                  value={dashboardData.orders.completed}
                  icon={
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  }
                  color="bg-green-100 dark:bg-green-900/30"
                />
                <StatBox
                  title="Dibatalkan"
                  value={dashboardData.orders.canceled}
                  icon={
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  }
                  color="bg-red-100 dark:bg-red-900/30"
                />
              </div>
            </div>

            {/* Payments Section */}
            <div>
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                Ringkasan Pembayaran
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StatBox
                  title="Total Revenue"
                  value={formatCurrency(
                    dashboardData.payments.total_revenue
                  )}
                  icon={
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  }
                  color="bg-green-100 dark:bg-green-900/30"
                />
                <StatBox
                  title="Pembayaran Tertunda"
                  value={dashboardData.payments.pending_payments}
                  icon={
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  }
                  color="bg-blue-100 dark:bg-blue-900/30"
                />
              </div>
            </div>

            {/* Users Section */}
            <div>
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                Ringkasan Pengguna
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StatBox
                  title="Total Pengguna"
                  value={dashboardData.users.total_users}
                  icon={<Users className="h-5 w-5 text-blue-600" />}
                  color="bg-blue-100 dark:bg-blue-900/30"
                />
                <StatBox
                  title="Total Admin"
                  value={dashboardData.users.total_admins}
                  icon={
                    <FileText className="h-5 w-5 text-purple-600" />
                  }
                  color="bg-purple-100 dark:bg-purple-900/30"
                />
              </div>
            </div>
          </div>
        )}

        {/* Content - Basic Tab */}
        {activeTab === 'basic' && reportsData && (
          <div className="space-y-6">
            {/* Summary */}
            <div>
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                Ringkasan
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StatBox
                  title="Total Pesanan"
                  value={reportsData.total_orders}
                  icon={
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  }
                  color="bg-blue-100 dark:bg-blue-900/30"
                />
                <StatBox
                  title="Pengguna Aktif"
                  value={reportsData.user_statistics.active_users}
                  icon={<Users className="h-5 w-5 text-green-600" />}
                  color="bg-green-100 dark:bg-green-900/30"
                />
              </div>
            </div>

            {/* Orders by Status Table */}
            {reportsData.orders_by_status.length > 0 && (
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                <div className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Pesanan Berdasarkan Status
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                          Status
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                          Jumlah
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportsData.orders_by_status.map(
                        (item, idx) => (
                          <tr
                            key={idx}
                            className="border-t border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                          >
                            <td className="px-4 py-3 capitalize text-slate-700 dark:text-slate-300">
                              {item.status}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">
                              {item.total}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Payment Summary */}
            {reportsData.payment_summary.length > 0 && (
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                <div className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Ringkasan Pembayaran
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                          Status
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                          Transaksi
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                          Jumlah
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {reportsData.payment_summary.map(
                        (item, idx) => (
                          <tr
                            key={idx}
                            className="border-t border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                          >
                            <td className="px-4 py-3 capitalize text-slate-700 dark:text-slate-300">
                              {item.status}
                            </td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                              {item.total}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">
                              {formatCurrency(item.total_amount)}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Top Users */}
            {reportsData.top_users.length > 0 && (
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                <div className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Top 10 Pengguna
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                          Nama
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                          Email
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                          Pesanan
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportsData.top_users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-t border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                        >
                          <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                            {user.name}
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                            {user.email}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">
                            {user.orders_count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content - Statistics Tab */}
        {activeTab === 'statistics' && statisticsData && (
          <div className="space-y-6">
            {/* Main Statistics */}
            <div>
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                📊 Statistik Periode
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatBox
                  title="Total Pesanan"
                  value={statisticsData.totalOrders}
                  icon={
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  }
                  color="bg-blue-100 dark:bg-blue-900/30"
                />
                <StatBox
                  title="Total Revenue"
                  value={formatCurrency(statisticsData.totalRevenue)}
                  icon={
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  }
                  color="bg-green-100 dark:bg-green-900/30"
                />
                <StatBox
                  title="Rata-rata Pesanan"
                  value={formatCurrency(
                    statisticsData.averageOrderValue
                  )}
                  icon={
                    <CreditCard className="h-5 w-5 text-purple-600" />
                  }
                  color="bg-purple-100 dark:bg-purple-900/30"
                />
                <StatBox
                  title="Pesanan Selesai"
                  value={statisticsData.completedOrders}
                  icon={
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  }
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
                      statisticsData.revenueGrowth >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {statisticsData.revenueGrowth >= 0 ? '↑' : '↓'}{' '}
                    {Math.abs(statisticsData.revenueGrowth).toFixed(
                      2
                    )}
                    %
                  </p>
                </div>

                <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Pertumbuhan Pesanan
                  </p>
                  <p
                    className={`mt-3 text-2xl font-bold ${
                      statisticsData.orderGrowth >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {statisticsData.orderGrowth >= 0 ? '↑' : '↓'}{' '}
                    {Math.abs(statisticsData.orderGrowth).toFixed(2)}%
                  </p>
                </div>

                <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Revenue Hari Ini
                  </p>
                  <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(statisticsData.todayRevenue)}
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
                  value={statisticsData.processingOrders}
                  icon={
                    <FileText className="h-5 w-5 text-amber-600" />
                  }
                  color="bg-amber-100 dark:bg-amber-900/30"
                />
                <StatBox
                  title="Selesai"
                  value={statisticsData.completedOrders}
                  icon={
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  }
                  color="bg-green-100 dark:bg-green-900/30"
                />
                <StatBox
                  title="Dibatalkan"
                  value={statisticsData.canceledOrders}
                  icon={
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  }
                  color="bg-red-100 dark:bg-red-900/30"
                />
                <StatBox
                  title="Hari Ini"
                  value={statisticsData.todayOrders}
                  icon={
                    <Calendar className="h-5 w-5 text-blue-600" />
                  }
                  color="bg-blue-100 dark:bg-blue-900/30"
                />
              </div>
            </div>

            {/* Trend Table */}
            {statisticsData.chartData.length > 0 && (
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
                      {statisticsData.chartData.map((item, idx) => (
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
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
