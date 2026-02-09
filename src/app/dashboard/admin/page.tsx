'use client';

import { useState, useEffect } from 'react';
import {
  Loader2,
  Eye,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Clock,
  AlertCircle,
  Package,
  CreditCard,
  CheckCircle2,
  Settings2,
  RefreshCw,
  ShoppingCart,
  Users,
  DollarSign,
  Calendar,
  TrendingDown
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Order {
  id: number;
  order_code: string;
  user_id: number;
  restaurant_id: number;
  total_price: string;
  status: string;
  order_status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}

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

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'amber' | 'emerald' | 'green';
  description: string;
  isLoading?: boolean;
  showTrend?: boolean;
  trendValue?: number;
}

interface QuickActionItemProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('processing');
  const [currentPage, setCurrentPage] = useState(1);
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [lastWeekRevenue, setLastWeekRevenue] = useState(0);
  const [isCalculatingRevenue, setIsCalculatingRevenue] =
    useState(false);
  const itemsPerPage = 4;

  useEffect(() => {
    const checkAuth = () => {
      const token =
        typeof window !== 'undefined'
          ? localStorage?.getItem('auth_token')
          : null;
      const userData =
        typeof window !== 'undefined'
          ? localStorage?.getItem('auth_user')
          : null;

      if (!token || !userData) {
        window.location.href = '/auth/login';
        return;
      }

      const parsedUser = JSON.parse(userData);
      if (
        parsedUser.role !== 'admin' &&
        parsedUser.role !== 'superadmin'
      ) {
        window.location.href = '/areas';
        return;
      }

      setUser(parsedUser);
      setIsLoading(false);
      fetchDashboardData();
      fetchOrders();
    };

    checkAuth();
  }, []);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchDashboardData = async () => {
    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage?.getItem('auth_token')
          : null;
      if (!token) return;

      const response = await fetch(`${apiUrl}/api/admin/dashboard`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success && data.data) {
        setDashboardData(data.data);
        // Hitung pendapatan mingguan setelah data dashboard didapat
        fetchAllOrdersForCalculation();
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const fetchOrders = async (status: string = 'processing') => {
    setIsLoadingOrders(true);
    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage?.getItem('auth_token')
          : null;
      if (!token) return;

      const response = await fetch(`${apiUrl}/api/admin/orders`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success && data.data) {
        const filteredOrders = data.data.filter((order: Order) => {
          if (status === 'processing') {
            return (
              order.status === 'paid' &&
              order.order_status === 'processing'
            );
          } else if (status === 'pending') {
            return order.status === 'pending';
          } else if (status === 'completed') {
            return order.order_status === 'completed';
          } else if (status === 'canceled') {
            return order.order_status === 'canceled';
          }
          return true;
        });
        setOrders(filteredOrders);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const fetchAllOrdersForCalculation = async () => {
    setIsCalculatingRevenue(true);
    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage?.getItem('auth_token')
          : null;
      if (!token) return;

      const response = await fetch(`${apiUrl}/api/admin/all-orders`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Fallback jika endpoint all-orders tidak ada
      if (!response.ok) {
        const ordersResponse = await fetch(
          `${apiUrl}/api/admin/orders`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const ordersData = await ordersResponse.json();
        if (ordersData.success && ordersData.data) {
          setAllOrders(ordersData.data);
          calculateRevenue(ordersData.data);
        }
      } else {
        const data = await response.json();
        if (data.success && data.data) {
          setAllOrders(data.data);
          calculateRevenue(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching orders for calculation:', error);
    } finally {
      setIsCalculatingRevenue(false);
    }
  };

  const calculateRevenue = (orders: Order[]) => {
    const now = new Date();

    // Hitung minggu ini (Senin - Minggu)
    const startOfWeek = getStartOfWeek(now);
    const endOfWeek = getEndOfWeek(now);

    // Hitung minggu lalu
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfWeek.getDate() - 7);
    const endOfLastWeek = new Date(endOfWeek);
    endOfLastWeek.setDate(endOfWeek.getDate() - 7);

    let currentWeekRevenue = 0;
    let lastWeekRevenue = 0;

    orders.forEach((order) => {
      const orderDate = new Date(order.created_at);
      const orderAmount = parseFloat(order.total_price);

      // Hanya hitung pesanan yang completed dan paid
      if (
        order.order_status === 'completed' &&
        order.status === 'paid'
      ) {
        // Minggu ini
        if (orderDate >= startOfWeek && orderDate <= endOfWeek) {
          currentWeekRevenue += orderAmount;
        }

        // Minggu lalu
        if (
          orderDate >= startOfLastWeek &&
          orderDate <= endOfLastWeek
        ) {
          lastWeekRevenue += orderAmount;
        }
      }
    });

    setWeeklyRevenue(currentWeekRevenue);
    setLastWeekRevenue(lastWeekRevenue);
  };

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 = Minggu, 1 = Senin, ...
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getEndOfWeek = (date: Date) => {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  };

  const handleStatusChange = (status: string) => {
    setFilterStatus(status);
    fetchOrders(status);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchDashboardData(),
      fetchOrders(filterStatus)
    ]);
    setIsRefreshing(false);
  };

  // Fungsi untuk mendapatkan rentang minggu saat ini
  const getCurrentWeekRange = () => {
    const startOfWeek = getStartOfWeek(new Date());
    const endOfWeek = getEndOfWeek(new Date());

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short'
      });
    };

    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
  };

  // Hitung persentase perubahan dari minggu lalu
  const calculatePercentageChange = () => {
    if (lastWeekRevenue === 0) {
      return weeklyRevenue > 0 ? 100 : 0;
    }
    return (
      ((weeklyRevenue - lastWeekRevenue) / lastWeekRevenue) * 100
    );
  };

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard Admin
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-auto">
                <select
                  value={filterStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 pr-8 text-sm font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="processing">
                    Menunggu Diproses
                  </option>
                  <option value="completed">Selesai</option>
                  <option value="canceled">Dibatalkan</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <ChevronDownIcon />
                </div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600 sm:w-auto"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    isRefreshing ? 'animate-spin' : ''
                  }`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dashboardData ? (
            <>
              <StatCard
                title="Total Pesanan"
                value={dashboardData.orders.total}
                icon={<ShoppingCart className="h-6 w-6" />}
                color="blue"
                description="Semua waktu"
              />
              <StatCard
                title="Menunggu Diproses"
                value={dashboardData.orders.processing}
                icon={<Clock className="h-6 w-6" />}
                color="amber"
                description="Perlu tindakan"
              />
              <StatCard
                title="Selesai"
                value={dashboardData.orders.completed}
                icon={<CheckCircle2 className="h-6 w-6" />}
                color="emerald"
                description="Berhasil diselesaikan"
              />
              <StatCard
                title="Pendapatan Minggu Ini"
                value={formatCurrency(weeklyRevenue)}
                icon={<CreditCard className="h-6 w-6" />}
                color="green"
                description={getCurrentWeekRange()}
                isLoading={isCalculatingRevenue}
                showTrend={true}
                trendValue={weeklyRevenue}
              />
            </>
          ) : (
            // Loading skeleton untuk stat cards
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                  <div className="text-right">
                    <div className="mb-2 h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                </div>
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            ))
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Orders Panel */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
              <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 dark:border-gray-800 dark:from-gray-900 dark:to-gray-800">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        Pesanan Aktif
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {orders.length} pesanan ditemukan
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {filterStatus === 'processing'
                        ? 'Menunggu'
                        : filterStatus === 'completed'
                          ? 'Selesai'
                          : 'Dibatalkan'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-gray-800">
                {isLoadingOrders ? (
                  // Loading skeleton untuk orders
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-6">
                      <div className="space-y-4">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="h-6 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
                              <div className="h-6 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            </div>
                            <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                            <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                          </div>
                          <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 sm:w-28"></div>
                        </div>
                        <div className="flex flex-col justify-between gap-3 border-t border-slate-200 pt-4 dark:border-gray-800 sm:flex-row sm:items-center">
                          <div className="space-y-2">
                            <div className="h-6 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                            <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                          </div>
                          <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <OrderRow key={order.id} order={order} />
                  ))
                ) : (
                  <div className="px-6 py-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                      <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                      Tidak ada pesanan
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Semua pesanan telah diproses
                    </p>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 dark:border-gray-800 dark:bg-gray-800/50 sm:px-6">
                  <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Halaman {currentPage} dari {totalPages}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.max(1, prev - 1)
                          )
                        }
                        disabled={currentPage === 1}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Prev
                      </button>
                      <div className="flex flex-wrap items-center justify-center gap-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) pageNum = i + 1;
                            else if (currentPage <= 3)
                              pageNum = i + 1;
                            else if (currentPage >= totalPages - 2)
                              pageNum = totalPages - 4 + i;
                            else pageNum = currentPage - 2 + i;

                            return (
                              <button
                                key={pageNum}
                                onClick={() =>
                                  setCurrentPage(pageNum)
                                }
                                className={`h-9 w-9 rounded-lg text-sm font-medium transition-all ${
                                  currentPage === pageNum
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}
                      </div>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600">
                  <Settings2 className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Aksi Cepat
                </h3>
              </div>
              <div className="space-y-3">
                <QuickActionItem
                  title="Semua Pesanan"
                  description="Kelola semua pesanan"
                  href="/dashboard/orders"
                  icon={<Package className="h-4 w-4" />}
                />
                <QuickActionItem
                  title="Verifikasi Pembayaran"
                  description="Cek status pembayaran"
                  href="/dashboard/payments"
                  icon={<CreditCard className="h-4 w-4" />}
                />
                <QuickActionItem
                  title="Laporan Bulanan"
                  description="Export data laporan"
                  href="/dashboard/reports"
                  icon={<AlertCircle className="h-4 w-4" />}
                />
              </div>
            </div>

            {/* Revenue Summary */}
            {dashboardData && (
              <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-6 shadow-lg dark:border-emerald-800 dark:from-emerald-900/20 dark:to-green-900/20">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Ringkasan Pendapatan
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Analisis periode
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(
                        dashboardData.payments.total_revenue
                      )}
                    </p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Total semua waktu
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Minggu ini
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(weeklyRevenue)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Minggu lalu
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(lastWeekRevenue)}
                      </span>
                    </div>

                    {lastWeekRevenue > 0 && (
                      <div
                        className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                          weeklyRevenue > lastWeekRevenue
                            ? 'bg-emerald-50 dark:bg-emerald-900/20'
                            : weeklyRevenue < lastWeekRevenue
                              ? 'bg-amber-50 dark:bg-amber-900/20'
                              : 'bg-gray-50 dark:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {weeklyRevenue > lastWeekRevenue ? (
                            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          ) : weeklyRevenue < lastWeekRevenue ? (
                            <TrendingDown className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          ) : (
                            <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          )}
                          <span className="text-sm">
                            {weeklyRevenue > lastWeekRevenue
                              ? 'Naik'
                              : weeklyRevenue < lastWeekRevenue
                                ? 'Turun'
                                : 'Stabil'}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            weeklyRevenue > lastWeekRevenue
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : weeklyRevenue < lastWeekRevenue
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {calculatePercentageChange().toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Alert */}
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-5 dark:border-blue-800 dark:from-blue-900/20 dark:to-blue-800/20">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Penting!
                  </p>
                  <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                    Verifikasi bukti pembayaran sebelum memproses
                    pesanan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function OrderRow({ order }: { order: Order }) {
  return (
    <div className="p-6 transition-colors hover:bg-slate-50/50 dark:hover:bg-gray-800/50">
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-slate-100 px-3 py-1 font-mono text-sm font-semibold text-blue-600 dark:bg-gray-800 dark:text-blue-400">
                {order.order_code}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  order.order_status === 'processing'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : order.order_status === 'completed'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                }`}
              >
                {getStatusLabel(order.order_status)}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {order.user.name}
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {order.user.phone}
            </p>
          </div>
          <button
            onClick={() =>
              (window.location.href = `/dashboard/orders/${order.id}`)
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-blue-700 hover:to-blue-800 sm:w-auto"
          >
            <Eye className="h-4 w-4" />
            Detail
          </button>
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-slate-200 pt-4 dark:border-gray-800 sm:flex-row sm:items-center">
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              Rp {formatPrice(order.total_price)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatDate(order.created_at)}
            </p>
          </div>
          {order.notes && (
            <div className="text-right">
              <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                Ada catatan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  description,
  isLoading = false,
  showTrend = false,
  trendValue = 0
}: StatCardProps) {
  const colorClasses: Record<StatCardProps['color'], string> = {
    blue: 'from-blue-500 to-blue-600',
    amber: 'from-amber-500 to-amber-600',
    emerald: 'from-emerald-500 to-emerald-600',
    green: 'from-green-500 to-green-600'
  };

  const bgClasses: Record<StatCardProps['color'], string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    amber: 'bg-amber-50 dark:bg-amber-900/20',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20',
    green: 'bg-green-50 dark:bg-green-900/20'
  };

  const getTrendInfo = () => {
    if (trendValue === 0) {
      return {
        text: 'Belum ada transaksi',
        color: 'text-gray-500 dark:text-gray-400',
        icon: null
      };
    }
    return {
      text: 'Minggu ini',
      color: 'text-green-600 dark:text-green-400',
      icon: <TrendingUp className="h-3 w-3" />
    };
  };

  const trendInfo = getTrendInfo();

  if (isLoading) {
    return (
      <div
        className={`rounded-2xl border border-slate-200 p-6 transition-all hover:shadow-lg dark:border-gray-800 ${bgClasses[color]}`}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-300 dark:bg-gray-700"></div>
          <div className="text-right">
            <div className="mb-2 h-8 w-24 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
            <div className="h-4 w-20 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
          </div>
        </div>
        <div className="h-4 w-32 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-slate-200 p-6 transition-all hover:shadow-lg dark:border-gray-800 ${bgClasses[color]}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-md`}
        >
          {icon}
        </div>
        <div className="text-right">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </h3>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {title}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
        {showTrend && (
          <div
            className={`flex items-center gap-1 text-xs ${trendInfo.color}`}
          >
            {trendInfo.icon}
            <span>{trendInfo.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickActionItem({
  title,
  description,
  href,
  icon
}: QuickActionItemProps) {
  return (
    <a
      href={href}
      className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm dark:border-gray-800 dark:bg-gray-800 dark:hover:border-blue-700"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 text-slate-600 group-hover:from-blue-100 group-hover:to-blue-50 group-hover:text-blue-600 dark:from-gray-800 dark:to-gray-700 dark:text-gray-400">
          {icon}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {title}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-500" />
    </a>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      className="h-4 w-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    processing: 'Menunggu Diproses',
    completed: 'Selesai',
    canceled: 'Dibatalkan'
  };
  return statusMap[status] || status;
}

function formatPrice(price: string | number): string {
  return new Intl.NumberFormat('id-ID').format(Number(price));
}

function formatCurrency(amount: string | number): string {
  const numAmount = Number(amount);
  if (numAmount === 0) {
    return 'Rp 0';
  }

  // Format dengan Intl.NumberFormat untuk semua kasus
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  return formatter.format(numAmount);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
