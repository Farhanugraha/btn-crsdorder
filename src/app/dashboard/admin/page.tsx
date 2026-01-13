'use client';

import { useState, useEffect } from 'react';
import {
  Loader2,
  Eye,
  ChevronRight,
  TrendingUp,
  Clock,
  AlertCircle,
  Package,
  CreditCard,
  CheckCircle2,
  Settings2,
  RefreshCw
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

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('processing');

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('auth_user');

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

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(
        'http://localhost:8000/api/admin/dashboard',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      if (data.success && data.data) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const fetchOrders = async (status: string = 'processing') => {
    setIsLoadingOrders(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(
        `http://localhost:8000/api/admin/orders`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      if (data.success && data.data) {
        // Filter berdasarkan status yang dipilih
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
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 transition-colors dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header with Date & Filter */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md transition-colors dark:border-slate-700 dark:bg-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <h2 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                Pesanan Masuk
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs transition-all hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:border-slate-500 sm:text-sm"
              >
                <option value="processing">Menunggu</option>
                <option value="completed">Selesai</option>
                <option value="canceled">Dibatalkan</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center justify-center rounded-lg bg-blue-600 p-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600 sm:px-3 sm:py-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    isRefreshing ? 'animate-spin' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* Stats Grid */}
        {dashboardData && (
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            <StatCard
              title="Total Pesanan"
              value={dashboardData.orders.total}
              icon={<Package className="h-5 w-5" />}
              gradient="from-blue-500 to-blue-600"
            />
            <StatCard
              title="Pending"
              value={dashboardData.orders.pending}
              icon={<Clock className="h-5 w-5" />}
              gradient="from-amber-500 to-amber-600"
            />
            <StatCard
              title="Proses"
              value={dashboardData.orders.processing}
              icon={<Settings2 className="h-5 w-5" />}
              gradient="from-sky-500 to-blue-500"
            />
            <StatCard
              title="Selesai"
              value={dashboardData.orders.completed}
              icon={<CheckCircle2 className="h-5 w-5" />}
              gradient="from-emerald-500 to-emerald-600"
            />
            <StatCard
              title="Revenue"
              value={formatCurrency(
                dashboardData.payments.total_revenue
              )}
              icon={<CreditCard className="h-5 w-5" />}
              gradient="from-slate-600 to-slate-700"
            />
          </div>
        )}

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Orders Table */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-md transition-colors dark:border-slate-700 dark:bg-slate-800">
              {/* Header */}
              <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50 px-4 py-4 transition-colors dark:border-slate-700 dark:from-slate-700 dark:to-slate-600 sm:px-6 sm:py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 sm:h-9 sm:w-9">
                      <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 sm:h-5 sm:w-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                        Pesanan Aktif
                      </h2>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        Perlu perhatian
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    {orders.length}
                  </span>
                </div>
              </div>

              {/* Orders List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {isLoadingOrders ? (
                  <div className="flex items-center justify-center py-12 sm:py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  </div>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <OrderRow key={order.id} order={order} />
                  ))
                ) : (
                  <div className="px-4 py-12 text-center sm:py-16">
                    <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Semua terkendali!
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Tidak ada pesanan yang perlu diproses
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-md transition-colors dark:border-slate-700 dark:bg-slate-800 sm:p-6">
              <div className="mb-4 flex items-center gap-2 sm:mb-5 sm:gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 sm:h-9 sm:w-9">
                  <Settings2 className="h-4 w-4 text-blue-600 dark:text-blue-400 sm:h-5 sm:w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                  Aksi Cepat
                </h3>
              </div>
              <div className="space-y-2">
                <QuickActionItem
                  title="Semua Pesanan"
                  description="Kelola pesanan"
                  href="/dashboard/admin/orders"
                  icon="📋"
                />
                <QuickActionItem
                  title="Pembayaran"
                  description="Verifikasi pembayaran"
                  href="/dashboard/admin/payments"
                  icon="💳"
                />
                <QuickActionItem
                  title="Statistik"
                  description="Lihat analytics"
                  href="/dashboard/admin/statistics"
                  icon="📊"
                />
                <QuickActionItem
                  title="Laporan"
                  description="Export data"
                  href="/dashboard/admin/reports"
                  icon="📄"
                />
              </div>
            </div>

            {/* Summary */}
            {dashboardData && (
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-4 text-white shadow-md transition-colors dark:from-blue-700 dark:to-blue-800 sm:p-6">
                <div className="mb-4 flex items-center gap-2 sm:mb-5">
                  <TrendingUp className="h-4 w-4 opacity-80" />
                  <h3 className="text-sm font-bold sm:text-base">
                    Ringkasan Sistem
                  </h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <SummaryItem
                    label="Total Pengguna"
                    value={dashboardData.users.total_users}
                  />
                  <SummaryItem
                    label="Total Admin"
                    value={dashboardData.users.total_admins}
                  />
                  <SummaryItem
                    label="Pembayaran Pending"
                    value={dashboardData.payments.pending_payments}
                    isWarning={true}
                  />
                </div>
              </div>
            )}

            {/* Alert */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 transition-colors dark:border-blue-900/30 dark:bg-blue-900/10 sm:p-5">
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400 sm:h-5 sm:w-5" />
                <p className="text-xs font-medium leading-relaxed text-blue-800 dark:text-blue-300 sm:text-sm">
                  Verifikasi bukti pembayaran sebelum memproses
                  pesanan ke dapur.
                </p>
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
    <div className="p-3 transition-colors hover:bg-blue-50/50 dark:hover:bg-slate-700/50 sm:p-5">
      <div className="space-y-2">
        {/* Top Row - Code & Badge */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-900 dark:bg-slate-700 dark:text-slate-100">
            {order.order_code}
          </span>
          <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            {getStatusLabel(order.order_status)}
          </span>
        </div>

        {/* Middle Row - Customer Name */}
        <p className="text-xs font-medium text-slate-600 dark:text-slate-300 sm:text-sm">
          {order.user.name}
        </p>

        {/* Bottom Row - Price, Date & Button */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-white sm:text-sm">
              Rp {formatPrice(order.total_price)}
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {formatDate(order.created_at)}
            </p>
          </div>
          <button
            onClick={() =>
              (window.location.href = `/dashboard/admin/orders/${order.id}`)
            }
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition-all hover:bg-blue-700 hover:shadow-md active:scale-95 dark:bg-blue-700 dark:hover:bg-blue-600 sm:h-9 sm:w-9"
          >
            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, gradient }: any) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800 sm:p-4">
      <div
        className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br sm:mb-3 sm:h-10 sm:w-10 ${gradient} text-white`}
      >
        {icon}
      </div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white sm:text-2xl">
        {value}
      </h3>
    </div>
  );
}

function QuickActionItem({ title, description, href, icon }: any) {
  return (
    <a
      href={href}
      className="group flex items-center justify-between gap-2 rounded-lg p-3 transition-colors hover:bg-blue-50/50 dark:hover:bg-slate-700/50"
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0 text-base sm:text-lg">{icon}</span>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-900 dark:text-white sm:text-sm">
            {title}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-blue-500 dark:text-slate-600 dark:group-hover:text-blue-400" />
    </a>
  );
}

function SummaryItem({ label, value, isWarning = false }: any) {
  return (
    <div className="flex items-center justify-between border-b border-blue-500/20 pb-3 text-xs last:border-b-0 last:pb-0 sm:text-sm">
      <span className="opacity-90">{label}</span>
      <span
        className={`font-bold ${
          isWarning ? 'text-amber-200' : 'text-white'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function getStatusLabel(status: string): string {
  const statusMap: any = {
    processing: 'Menunggu',
    completed: 'Selesai',
    canceled: 'Dibatalkan'
  };
  return statusMap[status] || status;
}

function formatPrice(price: string | number): string {
  return new Intl.NumberFormat('id-ID').format(Number(price));
}

function formatCurrency(amount: string | number): string {
  const formatted = new Intl.NumberFormat('id-ID').format(
    Number(amount)
  );
  return `Rp ${formatted}`;
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
