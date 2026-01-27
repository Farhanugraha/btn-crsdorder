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
  Users,
  CreditCard,
  CheckCircle2,
  Settings2,
  RefreshCw,
  Building2,
  MapPin,
  UtensilsCrossed
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  divisi?: string;
  unit_kerja?: string;
  created_at: string;
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

export default function SuperadminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
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
      if (parsedUser.role !== 'superadmin') {
        window.location.href = '/dashboard/admin';
        return;
      }

      setUser(parsedUser);
      setIsLoading(false);
      fetchDashboardData();
      fetchUsers();
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
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const fetchUsers = async (role: string = 'all') => {
    setIsLoadingUsers(true);
    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage?.getItem('auth_token')
          : null;
      if (!token) return;

      const response = await fetch(`${apiUrl}/api/admin/users`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success && data.data && data.data.data) {
        // Filter berdasarkan role yang dipilih
        let filteredUsers = data.data.data;
        if (role !== 'all') {
          filteredUsers = filteredUsers.filter(
            (u: UserData) => u.role === role
          );
        }
        setUsers(filteredUsers);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleRoleChange = (role: string) => {
    setFilterRole(role);
    fetchUsers(role);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchDashboardData(), fetchUsers(filterRole)]);
    setIsRefreshing(false);
  };

  // Pagination logic
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

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
                Manajemen Sistem
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterRole}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs transition-all hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:border-slate-500 sm:text-sm"
              >
                <option value="all">Semua User</option>
                <option value="user">User Biasa</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
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
              icon={<UtensilsCrossed className="h-5 w-5" />}
              gradient="from-blue-500 to-blue-600"
            />
            <StatCard
              title="Total User"
              value={dashboardData.users.total_users}
              icon={<Users className="h-5 w-5" />}
              gradient="from-purple-500 to-purple-600"
            />
            <StatCard
              title="Total Admin"
              value={dashboardData.users.total_admins}
              icon={<Settings2 className="h-5 w-5" />}
              gradient="from-orange-500 to-orange-600"
            />
            <StatCard
              title="Pendapatan"
              value={formatCurrency(
                dashboardData.payments.total_revenue
              )}
              icon={<CreditCard className="h-5 w-5" />}
              gradient="from-emerald-500 to-emerald-600"
            />
          </div>
        )}

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Users Table */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-md transition-colors dark:border-slate-700 dark:bg-slate-800">
              {/* Header */}
              <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50 px-4 py-4 transition-colors dark:border-slate-700 dark:from-slate-700 dark:to-slate-600 sm:px-6 sm:py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 sm:h-9 sm:w-9">
                      <Users className="h-4 w-4 text-blue-600 dark:text-blue-400 sm:h-5 sm:w-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                        Daftar User
                      </h2>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        Kelola semua pengguna
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    {users.length}
                  </span>
                </div>
              </div>

              {/* Users List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {isLoadingUsers ? (
                  <div className="flex items-center justify-center py-12 sm:py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  </div>
                ) : paginatedUsers.length > 0 ? (
                  paginatedUsers.map((userData) => (
                    <UserRow key={userData.id} userData={userData} />
                  ))
                ) : (
                  <div className="px-4 py-12 text-center sm:py-16">
                    <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Tidak ada data
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      User tidak ditemukan dengan filter ini
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination - Only show if more than 4 items */}
              {totalPages > 1 && (
                <div className="border-t border-slate-100 bg-slate-50 px-4 py-4 transition-colors dark:border-slate-700 dark:bg-slate-700/50 sm:px-6">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                      Halaman {currentPage} dari {totalPages} (
                      {users.length} user)
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.max(1, prev - 1)
                          )
                        }
                        disabled={currentPage === 1}
                        className="flex items-center justify-center rounded-lg border border-slate-300 bg-white p-2 text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                        title="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`flex items-center justify-center rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all sm:px-3 sm:py-2 ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="flex items-center justify-center rounded-lg border border-slate-300 bg-white p-2 text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                        title="Next page"
                      >
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
                  title="Buat Admin"
                  description="Tambah admin baru"
                  href="/dashboard/superadmin/user-management"
                  icon="👤"
                />
                <QuickActionItem
                  title="Area"
                  description="Kelola area"
                  href="/dashboard/superadmin/areas"
                  icon={<MapPin className="h-4 w-4" />}
                />
                <QuickActionItem
                  title="Restaurant"
                  description="Kelola restaurant"
                  href="/dashboard/superadmin/restaurants"
                  icon={<Building2 className="h-4 w-4" />}
                />
                <QuickActionItem
                  title="Laporan"
                  description="Lihat laporan"
                  href="/dashboard/superadmin/reports"
                  icon="📊"
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
                    value={
                      dashboardData.users.total_users +
                      dashboardData.users.total_admins
                    }
                  />
                  <SummaryItem
                    label="Pesanan Menunggu"
                    value={dashboardData.orders.processing}
                  />
                  <SummaryItem
                    label="Pesanan Selesai"
                    value={dashboardData.orders.completed}
                    isWarning={false}
                  />
                </div>
              </div>
            )}

            {/* Alert */}
            <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4 transition-colors dark:border-purple-900/30 dark:bg-purple-900/10 sm:p-5">
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400 sm:h-5 sm:w-5" />
                <p className="text-xs font-medium leading-relaxed text-purple-800 dark:text-purple-300 sm:text-sm">
                  Anda memiliki akses penuh ke semua fitur sistem.
                  Gunakan dengan bijak.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function UserRow({ userData }: { userData: UserData }) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'admin':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'user':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'Superadmin';
      case 'admin':
        return 'Admin';
      case 'user':
        return 'User';
      default:
        return role;
    }
  };

  return (
    <div className="p-3 transition-colors hover:bg-blue-50/50 dark:hover:bg-slate-700/50 sm:p-5">
      <div className="space-y-2">
        {/* Top Row - Name & Badge */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-900 dark:bg-slate-700 dark:text-slate-100">
            {userData.name}
          </span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${getRoleColor(
              userData.role
            )}`}
          >
            {getRoleLabel(userData.role)}
          </span>
        </div>

        {/* Email */}
        <p className="text-xs font-medium text-slate-600 dark:text-slate-300 sm:text-sm">
          {userData.email}
        </p>

        {/* Additional Info */}
        {(userData.divisi || userData.unit_kerja) && (
          <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
            {userData.divisi && (
              <span className="rounded bg-slate-100 px-2 py-0.5 dark:bg-slate-700">
                {userData.divisi}
              </span>
            )}
            {userData.unit_kerja && (
              <span className="rounded bg-slate-100 px-2 py-0.5 dark:bg-slate-700">
                {userData.unit_kerja}
              </span>
            )}
          </div>
        )}

        {/* Bottom Row - Date & Button */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatDate(userData.created_at)}
            </p>
          </div>
          <button
            onClick={() =>
              (window.location.href = `/dashboard/superadmin/users/${userData.id}`)
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
        {typeof icon === 'string' ? (
          <span className="shrink-0 text-base sm:text-lg">
            {icon}
          </span>
        ) : (
          <span className="shrink-0 text-slate-600 dark:text-slate-400">
            {icon}
          </span>
        )}
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
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
