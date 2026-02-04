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
  Filter,
  Building2,
  ChevronRight,
  AlertCircle,
  Users,
  Package,
  CreditCard,
  Layers,
  Home,
  CheckCircle,
  Sparkles,
  Shield,
  Globe,
  PieChart,
  Target
} from 'lucide-react';

import { DashboardTab } from '@/components/reports/DashboardTab';
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

type ExportFormat = 'csv' | 'pdf' | 'excel' | 'txt';

const ReportsPage = () => {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    null
  );
  const [showModuleSelection, setShowModuleSelection] =
    useState(false);
  const [availableModules, setAvailableModules] = useState<string[]>(
    []
  );
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [userDataAccess, setUserDataAccess] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string>('');

  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);
  const [reportsData, setReportsData] = useState<ReportsData | null>(
    null
  );
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
        // Fallback: use 1 month ago if can't fetch data
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        const startDateStr = monthAgo.toISOString().split('T')[0];
        const endDateStr = new Date().toISOString().split('T')[0];

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
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/auth/login');
      return null;
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

      // First, check user data access from dashboard
      try {
        const dashboardResponse = await fetch(
          `${apiUrl}/api/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            }
          }
        );

        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();

          if (dashboardData.success) {
            // Store user's data access
            if (dashboardData.data_access) {
              setUserDataAccess(dashboardData.data_access);
            }

            // Store user role
            if (dashboardData.user_role) {
              setUserRole(dashboardData.user_role);
            }

            // Check if user needs to select module
            const hasMultipleCRSDAccess =
              dashboardData.data_access?.filter((access: string) =>
                ['crsd1', 'crsd2'].includes(access)
              ).length > 1;

            const requiresSelection =
              dashboardData.requires_selection ||
              dashboardData.requires_module_selection ||
              (hasMultipleCRSDAccess && !selectedModule);

            if (requiresSelection && !selectedModule) {
              setShowModuleSelection(true);
              setAvailableModules(
                dashboardData.available_modules ||
                  dashboardData.data_access ||
                  []
              );

              // If dashboard already has data, show it (for general dashboard)
              if (dashboardData.data) {
                setDashboardData(dashboardData.data);
              }

              setIsLoading(false);
              return;
            }

            // If no selection needed, set dashboard data
            if (dashboardData.data) {
              setDashboardData(dashboardData.data);
            }
          }
        }
      } catch (err) {
        console.error('Dashboard check error:', err);
        // Continue with other data fetching
      }

      // Fetch other data
      await Promise.all([
        fetchReports(token),
        fetchOrdersDetail(token, start, end)
      ]);
    } catch (err) {
      console.error('Error in fetchAllData:', err);
      setError(
        err instanceof Error ? err.message : 'Gagal memuat data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleModuleSelect = async (module: string) => {
    try {
      setIsLoading(true);
      setSelectedModule(module);
      setError(null);

      const token = getAuthToken();
      if (!token || !apiUrl) {
        setError('Konfigurasi tidak lengkap');
        setIsLoading(false);
        return;
      }

      let dashboardUrl = `${apiUrl}/api/admin/dashboard`;

      // If module is selected, add it as parameter
      if (module && module !== 'general') {
        dashboardUrl = `${apiUrl}/api/admin/${module}/dashboard`;
      }

      const dashboardResponse = await fetch(dashboardUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });

      if (!dashboardResponse.ok) {
        const errorText = await dashboardResponse.text();
        console.error('Dashboard error response:', errorText);
        throw new Error(
          `HTTP error! status: ${dashboardResponse.status}`
        );
      }

      const dashboardData = await dashboardResponse.json();

      if (dashboardData.success) {
        if (dashboardData.data) {
          setDashboardData(dashboardData.data);
        }

        setShowModuleSelection(false);

        // Also fetch other data
        await Promise.all([
          fetchReports(token),
          fetchOrdersDetail(
            token,
            activeFilterStartDate || startDate,
            activeFilterEndDate || endDate
          )
        ]);

        setSuccessMessage(
          module === 'general'
            ? 'Dashboard umum berhasil dimuat'
            : `Dashboard ${
                module === 'crsd1' ? 'CRSD 1' : 'CRSD 2'
              } berhasil dimuat`
        );
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(dashboardData.message || 'Gagal memuat dashboard');
      }
    } catch (err) {
      console.error('Module select error:', err);
      setError(
        err instanceof Error ? err.message : 'Gagal memilih modul'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToGeneralDashboard = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setSelectedModule('general');
      setError(null);

      const token = getAuthToken();
      if (!token || !apiUrl) {
        setError('Konfigurasi tidak lengkap');
        setIsLoading(false);
        return;
      }

      // Fetch general dashboard (without module selection)
      const dashboardResponse = await fetch(
        `${apiUrl}/api/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        }
      );

      if (!dashboardResponse.ok) {
        throw new Error(
          `HTTP error! status: ${dashboardResponse.status}`
        );
      }

      const dashboardData = await dashboardResponse.json();

      if (dashboardData.success) {
        if (dashboardData.data) {
          setDashboardData(dashboardData.data);
        }

        setShowModuleSelection(false);
        setSelectedModule('general');

        // Also fetch other data
        await Promise.all([
          fetchReports(token),
          fetchOrdersDetail(
            token,
            activeFilterStartDate || startDate,
            activeFilterEndDate || endDate
          )
        ]);

        setSuccessMessage('Dashboard umum berhasil dimuat');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(dashboardData.message || 'Gagal memuat dashboard');
      }
    } catch (err) {
      console.error('General dashboard error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal memuat dashboard umum'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboard = async (token: string): Promise<void> => {
    try {
      // Use appropriate dashboard based on selectedModule
      let dashboardUrl = `${apiUrl}/api/admin/dashboard`;

      if (selectedModule && selectedModule !== 'general') {
        if (selectedModule === 'crsd1') {
          dashboardUrl = `${apiUrl}/api/admin/crsd1/dashboard`;
        } else if (selectedModule === 'crsd2') {
          dashboardUrl = `${apiUrl}/api/admin/crsd2/dashboard`;
        }
      }

      const response = await fetch(dashboardUrl, {
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
        if (data.success) {
          if (data.data) {
            setDashboardData(data.data);
          }
          // Update user data access if available
          if (data.data_access) {
            setUserDataAccess(data.data_access);
          }
          if (data.user_role) {
            setUserRole(data.user_role);
          }
        }
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }
  };

  const fetchReports = async (token: string): Promise<void> => {
    try {
      // Apply date filters to reports if available
      const params = new URLSearchParams();
      if (activeFilterStartDate) {
        params.append('start_date', activeFilterStartDate);
      }
      if (activeFilterEndDate) {
        params.append('end_date', activeFilterEndDate);
      }

      // Add module parameter if selected
      if (selectedModule && selectedModule !== 'general') {
        params.append('crsd_type', selectedModule);
      }

      const url = `${apiUrl}/api/admin/reports${
        params.toString() ? `?${params.toString()}` : ''
      }`;

      const response = await fetch(url, {
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

      // Add module parameter if selected
      if (selectedModule && selectedModule !== 'general') {
        params.append('crsd_type', selectedModule);
      }

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

      if (!ordersDetailData || !ordersDetailData.orders_by_date) {
        setError(
          'Data pesanan tidak tersedia. Pastikan ada pesanan dalam range tanggal yang dipilih.'
        );
        setIsExporting(false);
        return;
      }

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

  const getModuleDisplayName = (module: string): string => {
    switch (module) {
      case 'crsd1':
        return 'CRSD 1';
      case 'crsd2':
        return 'CRSD 2';
      case 'general':
        return 'Dashboard Umum';
      default:
        return module;
    }
  };

  const getModuleDescription = (module: string): string => {
    switch (module) {
      case 'general':
        return 'Tampilan menyeluruh semua divisi yang Anda akses';
      case 'crsd1':
        return 'Dashboard khusus untuk divisi CRSD 1';
      case 'crsd2':
        return 'Dashboard khusus untuk divisi CRSD 2';
      default:
        return 'Dashboard divisi khusus';
    }
  };

  const getModuleColor = (
    module: string
  ): { bg: string; text: string; border: string } => {
    switch (module) {
      case 'crsd1':
        return {
          bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
          text: 'text-blue-600',
          border: 'border-blue-200'
        };
      case 'crsd2':
        return {
          bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
          text: 'text-emerald-600',
          border: 'border-emerald-200'
        };
      case 'general':
        return {
          bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
          text: 'text-purple-600',
          border: 'border-purple-200'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-500 to-gray-600',
          text: 'text-gray-600',
          border: 'border-gray-200'
        };
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'crsd1':
        return <Building2 className="h-6 w-6 text-white" />;
      case 'crsd2':
        return <Building2 className="h-6 w-6 text-white" />;
      case 'general':
        return <Globe className="h-6 w-6 text-white" />;
      default:
        return <PieChart className="h-6 w-6 text-white" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'superadmin':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1 text-xs font-medium text-white">
            <Shield className="h-3 w-3" />
            Super Admin
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1 text-xs font-medium text-white">
            <Users className="h-3 w-3" />
            Admin
          </span>
        );
      default:
        return null;
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-900">
        <div className="relative">
          <Loader2 className="h-14 w-14 animate-spin text-blue-600 dark:text-blue-400" />
          <div className="absolute inset-0 -z-10 rounded-full bg-blue-50 blur-sm dark:bg-blue-900/10"></div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-lg font-medium text-slate-800 dark:text-slate-200">
            Memuat Dashboard
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Menyiapkan data statistik...
          </p>
        </div>
      </div>
    );
  }

  // Module Selection Screen
  if (showModuleSelection) {
    // Add "General Dashboard" option if user has multiple CRSD access
    const availableOptions = [...availableModules];
    const hasMultipleCRSD =
      userDataAccess.filter((access) =>
        ['crsd1', 'crsd2'].includes(access)
      ).length > 1;

    if (hasMultipleCRSD) {
      availableOptions.unshift('general');
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-4 top-1/4 h-72 w-72 animate-pulse rounded-full bg-gradient-to-r from-blue-100 to-purple-100 opacity-20 blur-3xl dark:from-blue-900/20 dark:to-purple-900/20"></div>
          <div className="absolute -right-4 bottom-1/4 h-72 w-72 animate-pulse rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 opacity-20 blur-3xl dark:from-emerald-900/20 dark:to-blue-900/20"></div>
        </div>

        <main className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
            <div className="w-full max-w-4xl">
              {/* Header Section */}
              <div className="mb-10 text-center">
                <div className="mb-6 inline-flex items-center gap-3 rounded-2xl bg-white/80 px-6 py-3 backdrop-blur-sm dark:bg-gray-800/80">
                  <div className="text-left">
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                      Selamat Datang di Dashboard Laporan
                    </h1>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Pilih tampilan dashboard yang sesuai dengan
                        kebutuhan Anda
                      </p>
                      {getRoleBadge(userRole)}
                    </div>
                  </div>
                </div>

                <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
                  Pilih Mode Tampilan
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                  {hasMultipleCRSD
                    ? 'Anda memiliki akses ke beberapa divisi. Pilih salah satu untuk fokus atau tampilan umum untuk overview lengkap.'
                    : 'Pilih tampilan dashboard yang paling sesuai dengan peran Anda.'}
                </p>
              </div>

              {/* Module Cards Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {availableOptions.map((module) => {
                  const colors = getModuleColor(module);
                  const isSelected = selectedModule === module;

                  return (
                    <div
                      key={module}
                      className={`group relative overflow-hidden rounded-2xl border-2 bg-white p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:bg-gray-800 ${
                        isSelected
                          ? `${colors.border} border-2 shadow-xl`
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                      }`}
                      onClick={() => handleModuleSelect(module)}
                    >
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute -right-6 -top-6 h-12 w-12 rounded-bl-full bg-gradient-to-br from-blue-500 to-purple-500">
                          <CheckCircle className="absolute right-2 top-2 h-4 w-4 text-white" />
                        </div>
                      )}

                      {/* Icon badge */}
                      <div
                        className={`mb-6 inline-flex rounded-xl p-3 ${colors.bg}`}
                      >
                        {getModuleIcon(module)}
                      </div>

                      {/* Content */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {getModuleDisplayName(module)}
                          </h3>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {getModuleDescription(module)}
                          </p>
                        </div>

                        {/* Stats preview (simulated) */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              Total Orders
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {module === 'general'
                                ? 'All'
                                : 'Divisi'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              Revenue
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {module === 'general'
                                ? 'Combined'
                                : 'Specific'}
                            </span>
                          </div>
                        </div>

                        {/* CTA */}
                        <button
                          className={`mt-4 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                          disabled={isLoading}
                        >
                          {isSelected ? (
                            <span className="flex items-center justify-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Dipilih
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              Masuk ke Dashboard
                              <ChevronRight className="h-4 w-4" />
                            </span>
                          )}
                        </button>
                      </div>

                      {/* Hover effect */}
                      <div
                        className={`absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-5 ${colors.bg.replace(
                          'bg-gradient-to-br',
                          ''
                        )}`}
                      ></div>
                    </div>
                  );
                })}
              </div>

              {/* User Access Info */}
              {userDataAccess.length > 0 && (
                <div className="mt-10 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-6 dark:from-gray-800 dark:to-gray-900">
                  <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div>
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
                        Informasi Akses Anda
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {userDataAccess.map((access) => (
                          <span
                            key={access}
                            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                              access === 'crsd1'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                : access === 'crsd2'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {access === 'crsd1'
                              ? 'CRSD 1'
                              : access === 'crsd2'
                                ? 'CRSD 2'
                                : access}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Pilihan yang tersedia disesuaikan dengan
                        <br />
                        hak akses yang Anda miliki
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="animate-fade-in mt-6 rounded-xl border border-red-200 bg-red-50/50 p-4 backdrop-blur-sm dark:border-red-800/30 dark:bg-red-900/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-300">
                        Terjadi Kesalahan
                      </p>
                      <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Note */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Dashboard dapat diubah kapan saja melalui menu
                  pilihan modul
                </p>
                <button
                  onClick={() => setShowModuleSelection(false)}
                  className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  ← Kembali ke dashboard
                </button>
              </div>
            </div>
          </div>
        </main>
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
                    {selectedModule === 'general'
                      ? 'Dashboard Umum - Semua Divisi'
                      : selectedModule
                        ? `Divisi ${getModuleDisplayName(
                            selectedModule
                          )}`
                        : 'Analisis data dan statistik bisnis'}
                  </p>
                </div>
              </div>

              {/* User access info */}
              {userDataAccess.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Akses:{' '}
                    {userDataAccess
                      .map((access) => {
                        if (access === 'crsd1') return 'CRSD 1';
                        if (access === 'crsd2') return 'CRSD 2';
                        return access;
                      })
                      .join(', ')}
                  </span>
                </div>
              )}

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
              {(userDataAccess.length > 1 || selectedModule) && (
                <button
                  onClick={() => setShowModuleSelection(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span>
                    {selectedModule ? 'Ganti' : 'Pilih'} Modul
                  </span>
                </button>
              )}
              <button
                onClick={() =>
                  fetchAllData(
                    activeFilterStartDate,
                    activeFilterEndDate
                  )
                }
                disabled={isLoading}
                className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 sm:px-3.5 sm:py-2 sm:text-sm"
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

            {selectedModule && (
              <div className="flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 dark:bg-blue-900/30">
                <div
                  className={`h-2 w-2 rounded-full ${
                    selectedModule === 'crsd1'
                      ? 'bg-blue-600'
                      : 'bg-green-600'
                  }`}
                ></div>
                <span className="text-xs font-medium text-blue-800 dark:text-blue-300">
                  {getModuleDisplayName(selectedModule)}
                </span>
              </div>
            )}
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
              <span className="inline sm:hidden">Export</span>
            </button>
          </div>

          {isExporting && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <Loader2 className="h-3 w-3 animate-spin" />
              Sedang mengekspor data...
            </div>
          )}
        </div>

        {/* Dashboard Content */}
        <div className="min-h-[400px]">
          <DashboardTab
            data={
              dashboardData || {
                orders: {
                  total: 0,
                  pending: 0,
                  processing: 0,
                  completed: 0,
                  canceled: 0
                },
                payments: { total_revenue: 0, pending_payments: 0 },
                users: { total_users: 0, total_admins: 0 }
              }
            }
            formatCurrency={formatCurrency}
            selectedModule={selectedModule}
          />
        </div>

        {/* Empty State - No Data at All */}
        {!dashboardData && !showModuleSelection && (
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
            <div className="mt-4 space-x-2">
              <button
                onClick={() => fetchAllData(startDate, endDate)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
              >
                Coba Muat Ulang
              </button>
              <button
                onClick={() => setShowModuleSelection(true)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
              >
                Pilih Modul
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportsPage;
