'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  Eye,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  AlertCircle,
  Users,
  Settings2,
  RefreshCw,
  Building2,
  MapPin,
  UserPlus,
  BarChart3,
  Search,
  Filter,
  UserCheck,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  Home,
  MoreHorizontal,
  CalendarDays
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
  email_verified_at?: string;
}

interface DashboardData {
  total_orders: number;
  today_orders: number; // Total pesanan hari ini
  total_users: number;
  total_admins: number;
  total_superadmins: number;
  total_crsd1_admins?: number;
  total_crsd2_admins?: number;

  today_processing_orders: number;
  today_completed_orders: number;
  today_canceled_orders: number;
}

interface PaginatedUsers {
  current_page: number;
  data: UserData[];
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export default function SuperadminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 4,
    last_page: 1,
    from: 0,
    to: 0
  });
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterRole, setFilterRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Fetch users when filter or search changes
    if (user) {
      fetchUsers(1);
    }
  }, [filterRole]);

  const checkAuth = () => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('auth_user');

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
    fetchUsers(1);
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        window.location.href = '/auth/login';
        return;
      }

      const response = await fetch(
        `${apiUrl}/api/superadmin/dashboard`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/auth/login';
        return;
      }

      const data = await response.json();
      if (data.success && data.data) {
        setDashboardData(data.data);
      } else {
        console.error('Failed to fetch dashboard:', data.message);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const fetchUsers = async (page: number = 1) => {
    setIsLoadingUsers(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        window.location.href = '/auth/login';
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '4'
      });

      // Only add role filter if not 'all'
      if (filterRole !== 'all') {
        params.append('role', filterRole);
      }

      // Only add search if not empty
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      const response = await fetch(
        `${apiUrl}/api/superadmin/users?${params}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/auth/login';
        return;
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log

      if (data.success) {
        // Check if data is paginated or direct array
        if (data.data && data.data.data) {
          // Laravel paginated response
          setUsers(data.data.data);
          setPagination({
            current_page: data.data.current_page || 1,
            total: data.data.total || 0,
            per_page: data.data.per_page || 4,
            last_page: data.data.last_page || 1,
            from: data.data.from || 0,
            to: data.data.to || 0
          });
        } else if (Array.isArray(data.data)) {
          // Direct array response
          setUsers(data.data);
          setPagination({
            current_page: 1,
            total: data.data.length,
            per_page: 4,
            last_page: Math.ceil(data.data.length / 4),
            from: 1,
            to: Math.min(data.data.length, 4)
          });
        } else {
          setUsers([]);
          setPagination({
            current_page: 1,
            total: 0,
            per_page: 4,
            last_page: 1,
            from: 0,
            to: 0
          });
        }
      } else {
        console.error('Failed to fetch users:', data.message);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleRoleChange = (role: string) => {
    setFilterRole(role);
    // Reset to page 1 when filter changes
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      setPagination((prev) => ({ ...prev, current_page: 1 }));
      fetchUsers(1);
    }, 500);
  };

  const handlePageChange = (page: number) => {
    if (
      page < 1 ||
      page > pagination.last_page ||
      page === pagination.current_page
    )
      return;
    fetchUsers(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchDashboardData(),
      fetchUsers(pagination.current_page)
    ]);
    setIsRefreshing(false);
  };

  const handleViewUser = (userId: number) => {
    router.push(`/dashboard/user-management/${userId}`);
  };

  const handleCreateUser = () => {
    router.push('/dashboard/user-management/create');
  };

  const renderPaginationButtons = () => {
    const buttons: React.ReactNode[] = [];
    const { current_page, last_page } = pagination;

    if (last_page <= 1) return buttons;

    // Always show first page
    buttons.push(
      <PaginationButton
        key={1}
        page={1}
        current_page={current_page}
        onClick={() => handlePageChange(1)}
      />
    );

    // Show ellipsis if needed
    if (current_page > 3) {
      buttons.push(
        <span
          key="ellipsis1"
          className="flex h-9 w-9 items-center justify-center text-slate-400"
        >
          <MoreHorizontal className="h-4 w-4" />
        </span>
      );
    }

    // Show pages around current page
    for (
      let i = Math.max(2, current_page - 1);
      i <= Math.min(last_page - 1, current_page + 1);
      i++
    ) {
      if (i !== 1 && i !== last_page) {
        buttons.push(
          <PaginationButton
            key={i}
            page={i}
            current_page={current_page}
            onClick={() => handlePageChange(i)}
          />
        );
      }
    }

    // Show ellipsis if needed
    if (current_page < last_page - 2) {
      buttons.push(
        <span
          key="ellipsis2"
          className="flex h-9 w-9 items-center justify-center text-slate-400"
        >
          <MoreHorizontal className="h-4 w-4" />
        </span>
      );
    }

    // Always show last page if there is more than 1 page
    if (last_page > 1) {
      buttons.push(
        <PaginationButton
          key={last_page}
          page={last_page}
          current_page={current_page}
          onClick={() => handlePageChange(last_page)}
        />
      );
    }

    return buttons;
  };

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
            Menyiapkan data sistem...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80">
        <div className="mx-auto max-w-[1600px] px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-600 dark:text-slate-400">
                <Home className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                  Dashboard SuperAdmin
                </h1>
                <p className="truncate text-xs text-slate-600 dark:text-slate-400">
                  {new Date().toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:w-auto sm:px-3"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    isRefreshing ? 'animate-spin' : ''
                  }`}
                />
                <span className="hidden text-sm sm:ml-2 sm:inline">
                  Refresh
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
        {/* Stats Grid */}
        {dashboardData && (
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4">
            {/* Pesanan Hari Ini */}
            <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-100 p-1.5 dark:bg-blue-900/20">
                      <Package className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Pesanan Hari Ini
                    </p>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                    {dashboardData.today_orders || 0}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1 text-xs">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                      <span className="text-blue-600 dark:text-blue-400">
                        Menunggu:{' '}
                        {dashboardData.today_processing_orders || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Selesai:{' '}
                        {dashboardData.today_completed_orders || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                      <span className="text-red-600 dark:text-red-400">
                        Batal:{' '}
                        {dashboardData.today_canceled_orders || 0}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                    {new Date().toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="ml-4 rounded-lg bg-blue-100 p-2.5 dark:bg-blue-900/20">
                  <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            {/* Total Pengguna */}
            <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-purple-100 p-1.5 dark:bg-purple-900/20">
                      <Users className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Total Pengguna
                    </p>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                    {dashboardData.total_users}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1 text-xs">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
                      <span className="text-orange-600 dark:text-orange-400">
                        Admin: {dashboardData.total_admins}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                      <span className="text-red-600 dark:text-red-400">
                        SuperAdmin: {dashboardData.total_superadmins}
                      </span>
                    </div>
                    <div className="col-span-2 mt-1 flex items-center gap-1 text-xs">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                      <span className="text-blue-600 dark:text-blue-400">
                        User Biasa:{' '}
                        {dashboardData.total_users -
                          dashboardData.total_admins -
                          dashboardData.total_superadmins}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                    Semua pengguna terdaftar
                  </p>
                </div>
                <div className="ml-4 rounded-lg bg-purple-100 p-2.5 dark:bg-purple-900/20">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Main Content - Users Management */}
          <div className="flex-1">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
              {/* Header */}
              <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-4 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800 sm:px-6 sm:py-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="rounded-lg bg-blue-600 p-2 text-white sm:rounded-xl sm:p-2.5">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white sm:text-lg">
                        Manajemen Pengguna
                      </h2>
                      <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                        Kelola semua pengguna sistem
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <div className="relative w-full sm:w-48">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Cari nama/email..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-slate-400" />
                      <select
                        value={filterRole}
                        onChange={(e) =>
                          handleRoleChange(e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white sm:w-auto"
                      >
                        <option value="all">Semua Role</option>
                        <option value="superadmin">SuperAdmin</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Users List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {isLoadingUsers ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="mb-4 h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Memuat data...
                    </p>
                  </div>
                ) : users.length > 0 ? (
                  users.map((userData) => (
                    <UserListItem
                      key={userData.id}
                      userData={userData}
                      onView={handleViewUser}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="mb-4 rounded-full bg-blue-100 p-4 dark:bg-blue-900/20">
                      <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                      {searchTerm || filterRole !== 'all'
                        ? 'Tidak ditemukan'
                        : 'Belum ada pengguna'}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {searchTerm || filterRole !== 'all'
                        ? 'Tidak ada data yang cocok dengan kriteria Anda'
                        : 'Tambahkan pengguna baru untuk memulai'}
                    </p>
                    <button
                      onClick={handleCreateUser}
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                      <UserPlus className="h-4 w-4" />
                      Tambah Pengguna Baru
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination - Tampilkan hanya jika total > 4 */}
              {pagination.last_page > 1 && (
                <div className="border-t border-slate-100 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-800/50 sm:px-6">
                  <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-medium">
                        {pagination.from}-{pagination.to}
                      </span>{' '}
                      dari{' '}
                      <span className="font-medium">
                        {pagination.total}
                      </span>{' '}
                      pengguna
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Previous Button */}
                      <button
                        onClick={() =>
                          handlePageChange(
                            pagination.current_page - 1
                          )
                        }
                        disabled={pagination.current_page === 1}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {renderPaginationButtons()}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={() =>
                          handlePageChange(
                            pagination.current_page + 1
                          )
                        }
                        disabled={
                          pagination.current_page ===
                          pagination.last_page
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Quick Access & Status Pesanan */}
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            <div className="space-y-6">
              {/* Status Pesanan */}
              {dashboardData && (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-4 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800 sm:px-5 sm:py-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-emerald-600 p-2 text-white">
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                          Status Pesanan
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="space-y-4">
                      {/* Progress Bars untuk Status Pesanan Hari Ini */}
                      <div className="space-y-3">
                        {/* Menunggu (Processing) */}
                        <div>
                          <div className="mb-1 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                              <span className="text-sm text-slate-700 dark:text-slate-300">
                                Menunggu
                              </span>
                            </div>
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                              {dashboardData.today_processing_orders ||
                                0}
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                            <div
                              className="h-full rounded-full bg-blue-500 transition-all duration-500"
                              style={{
                                width: `${
                                  ((dashboardData.today_processing_orders ||
                                    0) /
                                    (dashboardData.today_orders ||
                                      1)) *
                                  100
                                }%`
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Selesai (Completed) */}
                        <div>
                          <div className="mb-1 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                              <span className="text-sm text-slate-700 dark:text-slate-300">
                                Selesai
                              </span>
                            </div>
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                              {dashboardData.today_completed_orders ||
                                0}
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                              style={{
                                width: `${
                                  ((dashboardData.today_completed_orders ||
                                    0) /
                                    (dashboardData.today_orders ||
                                      1)) *
                                  100
                                }%`
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Dibatalkan (Canceled) */}
                        <div>
                          <div className="mb-1 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              <span className="text-sm text-slate-700 dark:text-slate-300">
                                Dibatalkan
                              </span>
                            </div>
                            <span className="text-sm font-bold text-red-600 dark:text-red-400">
                              {dashboardData.today_canceled_orders ||
                                0}
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                            <div
                              className="h-full rounded-full bg-red-500 transition-all duration-500"
                              style={{
                                width: `${
                                  ((dashboardData.today_canceled_orders ||
                                    0) /
                                    (dashboardData.today_orders ||
                                      1)) *
                                  100
                                }%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Ringkasan */}
                      <div className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-700/30">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-center">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Aktif
                            </p>
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              {dashboardData.today_processing_orders ||
                                0}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Selesai
                            </p>
                            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                              {(dashboardData.today_completed_orders ||
                                0) +
                                (dashboardData.today_canceled_orders ||
                                  0)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-4 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800 sm:px-5 sm:py-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-600 p-2 text-white">
                      <Settings2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                      Akses Cepat
                    </h3>
                  </div>
                </div>

                <div className="space-y-1 p-4 sm:p-5">
                  <QuickActionItem
                    title="Tambah User"
                    description="Buat akun baru"
                    href="/dashboard/user-management/create"
                    icon={<UserPlus className="h-4 w-4" />}
                    color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  />
                  <QuickActionItem
                    title="Kelola Area"
                    description="Manajemen area"
                    href="/dashboard/areas"
                    icon={<MapPin className="h-4 w-4" />}
                    color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                  />
                  <QuickActionItem
                    title="Kelola Restoran"
                    description="Data restoran"
                    href="/dashboard/restaurants"
                    icon={<Building2 className="h-4 w-4" />}
                    color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                  />
                  <QuickActionItem
                    title="Laporan"
                    description="Analytics sistem"
                    href="/dashboard/reports"
                    icon={<BarChart3 className="h-4 w-4" />}
                    color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                  />
                </div>
              </div>

              {/* System Alert */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10 sm:p-5">
                <div className="flex gap-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400 sm:h-5 sm:w-5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Akses SuperAdmin
                    </p>
                    <p className="mt-1 text-xs text-blue-700 dark:text-blue-400">
                      Anda memiliki akses penuh ke semua fitur sistem.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Component: User List Item
function UserListItem({
  userData,
  onView
}: {
  userData: UserData;
  onView: (id: number) => void;
}) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30';
      case 'admin':
        return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30';
      case 'user':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800/30';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'SuperAdmin';
      case 'admin':
        return 'Admin';
      case 'user':
        return 'User';
      default:
        return role;
    }
  };

  const isVerified = !!userData.email_verified_at;

  return (
    <div className="group px-4 py-3 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-700/30 sm:px-6 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 sm:h-12 sm:w-12">
              <Users className="h-4 w-4 text-slate-600 dark:text-slate-400 sm:h-5 sm:w-5" />
            </div>
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-100 p-0.5 dark:bg-emerald-900/30 sm:p-1">
                <UserCheck className="h-2 w-2 text-emerald-600 dark:text-emerald-400 sm:h-3 sm:w-3" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
                {userData.name}
              </h3>
              <span
                className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getRoleColor(
                  userData.role
                )}`}
              >
                {getRoleLabel(userData.role)}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
              {userData.email}
            </p>
            <div className="mt-1 flex items-center gap-2">
              {userData.divisi && (
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                  {userData.divisi}
                </span>
              )}
              {userData.unit_kerja && (
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                  {userData.unit_kerja}
                </span>
              )}
              {userData.phone && (
                <span className="hidden rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-400 sm:inline">
                  {userData.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(userData.id)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 sm:px-4 sm:py-2 sm:text-sm"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Detail</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Component: Pagination Button
function PaginationButton({
  page,
  current_page,
  onClick
}: {
  page: number;
  current_page: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
        current_page === page
          ? 'bg-blue-600 text-white'
          : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400'
      }`}
    >
      {page}
    </button>
  );
}

// Component: Quick Action Item
function QuickActionItem({
  title,
  description,
  href,
  icon,
  color
}: any) {
  return (
    <a
      href={href}
      className="group flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30 sm:p-4"
    >
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${color}`}>{icon}</div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-500" />
    </a>
  );
}
