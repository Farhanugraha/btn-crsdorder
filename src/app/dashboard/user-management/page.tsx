'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Shield,
  Building,
  CheckCircle,
  XCircle,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  Eye,
  Calendar,
  Loader2
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'user' | 'admin' | 'superadmin';
  divisi: string | null;
  unit_kerja: string | null;
  email_verified_at: string | null;
  created_at: string;
}

interface PaginatedResponse {
  success: boolean;
  message: string;
  data: {
    data: User[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

interface AuthData {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'superadmin';
  };
}

export default function UserManagement() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<
    'all' | 'user' | 'admin' | 'superadmin'
  >('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<
    number | null
  >(null);
  const [showMobileMenu, setShowMobileMenu] = useState<number | null>(
    null
  );
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const getApiUrl = useCallback(() => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;

    if (envUrl && envUrl.includes('/api')) {
      return envUrl;
    }

    if (envUrl) {
      return `${envUrl}/api`;
    }

    return 'http://localhost:8000/api';
  }, []);

  const getAuthToken = useCallback((): string | null => {
    try {
      if (typeof window === 'undefined') return null;

      const token = localStorage.getItem('auth_token');
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }, []);

  const checkAuthentication = useCallback(() => {
    try {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('auth_user');

      if (!token || !userStr) {
        setIsAuthenticated(false);
        setAuthData(null);
        setError('Silakan login terlebih dahulu');

        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
        return;
      }

      const userData = JSON.parse(userStr);

      if (userData.role !== 'superadmin') {
        setIsAuthenticated(false);
        setAuthData(null);
        setError('Hanya superadmin yang dapat mengakses halaman ini');

        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
        return;
      }

      setAuthData({
        token,
        user: userData
      });
      setIsAuthenticated(true);
      setError(null);
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
      setAuthData(null);
      setError('Terjadi kesalahan pada autentikasi');

      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    }
  }, [router]);

  useEffect(() => {
    setMounted(true);
    checkAuthentication();
  }, [checkAuthentication]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();

      if (!token) {
        setError('Token tidak ditemukan. Silakan login kembali.');
        setIsAuthenticated(false);
        setTimeout(() => router.push('/auth/login'), 2000);
        return;
      }

      const apiUrl = getApiUrl();

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        per_page: perPage.toString()
      });

      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }

      if (filterRole !== 'all') {
        queryParams.append('role', filterRole);
      }

      const url = `${apiUrl}/superadmin/users?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError(
            'Token Anda telah kadaluarsa. Silakan login kembali.'
          );
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setTimeout(() => router.push('/auth/login'), 2000);
          return;
        }

        if (response.status === 403) {
          setError('Anda tidak memiliki akses ke halaman ini.');
          setIsAuthenticated(false);
          return;
        }

        if (response.status === 404) {
          setUsers([]);
          setTotalPages(1);
          setTotalUsers(0);
          return;
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP Error: ${response.status}`
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || 'Gagal mengambil data pengguna'
        );
      }

      const userData = result.data?.data || result.data || [];
      const lastPage =
        result.data?.last_page || result.last_page || 1;
      const total = result.data?.total || result.total || 0;

      setUsers(Array.isArray(userData) ? userData : []);
      setTotalPages(lastPage);
      setTotalUsers(total);
    } catch (err) {
      console.error('Fetch error:', err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan koneksi';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    perPage,
    searchTerm,
    filterRole,
    getAuthToken,
    getApiUrl,
    router
  ]);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      fetchUsers();
    }
  }, [mounted, isAuthenticated, fetchUsers]);

  const handleDeleteUser = useCallback(
    async (id: number) => {
      try {
        setIsProcessing(true);
        const token = getAuthToken();

        if (!token) {
          setError('Token tidak ditemukan');
          return;
        }

        const apiUrl = getApiUrl();
        const url = `${apiUrl}/superadmin/users/${id}`;

        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Gagal menghapus pengguna');
        }

        setSuccessMessage('User berhasil dihapus');
        setShowDeleteConfirm(null);
        setShowMobileMenu(null);
        setTimeout(() => setSuccessMessage(null), 3000);
        await fetchUsers();
      } catch (error) {
        console.error('Delete error:', error);
        setError(
          error instanceof Error
            ? error.message
            : 'Gagal menghapus pengguna'
        );
        setTimeout(() => setError(null), 3000);
      } finally {
        setIsProcessing(false);
      }
    },
    [getAuthToken, getApiUrl, fetchUsers]
  );

  const handleActivateUser = useCallback(
    async (id: number) => {
      try {
        setIsProcessing(true);
        const token = getAuthToken();

        if (!token) {
          setError('Token tidak ditemukan');
          return;
        }

        const apiUrl = getApiUrl();
        const url = `${apiUrl}/superadmin/users/${id}/activate`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || 'Gagal mengaktifkan pengguna'
          );
        }

        setSuccessMessage('User berhasil diaktifkan');
        setTimeout(() => setSuccessMessage(null), 3000);
        setShowMobileMenu(null);
        await fetchUsers();
      } catch (error) {
        console.error('Activate error:', error);
        setError(
          error instanceof Error
            ? error.message
            : 'Gagal mengaktifkan pengguna'
        );
        setTimeout(() => setError(null), 3000);
      } finally {
        setIsProcessing(false);
      }
    },
    [getAuthToken, getApiUrl, fetchUsers]
  );

  const handleDeactivateUser = useCallback(
    async (id: number) => {
      try {
        setIsProcessing(true);
        const token = getAuthToken();

        if (!token) {
          setError('Token tidak ditemukan');
          return;
        }

        const apiUrl = getApiUrl();
        const url = `${apiUrl}/superadmin/users/${id}/deactivate`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || 'Gagal menonaktifkan pengguna'
          );
        }

        setSuccessMessage('User berhasil dinonaktifkan');
        setTimeout(() => setSuccessMessage(null), 3000);
        setShowMobileMenu(null);
        await fetchUsers();
      } catch (error) {
        console.error('Deactivate error:', error);
        setError(
          error instanceof Error
            ? error.message
            : 'Gagal menonaktifkan pengguna'
        );
        setTimeout(() => setError(null), 3000);
      } finally {
        setIsProcessing(false);
      }
    },
    [getAuthToken, getApiUrl, fetchUsers]
  );

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'user':
        return 'User';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
      case 'admin':
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800';
      case 'user':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getPaginationNumbers = () => {
    const pages = [];
    const maxPages = 5;

    if (totalPages <= maxPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (!mounted) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-900">
        <div className="relative">
          <Loader2 className="h-14 w-14 animate-spin text-blue-600 dark:text-blue-400" />
          {/* Optional: Background circle */}
          <div className="absolute inset-0 -z-10 rounded-full bg-blue-50 blur-sm dark:bg-blue-900/10"></div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-lg font-medium text-slate-800 dark:text-slate-200">
            Memuat halaman
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Harap tunggu sebentar...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-blue-200 bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30">
              <AlertTriangle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h2 className="mb-2 text-center text-xl font-bold text-slate-900 dark:text-white">
            Autentikasi Diperlukan
          </h2>
          <p className="mb-4 text-center text-slate-600 dark:text-slate-300">
            {error || 'Silakan login untuk melanjutkan'}
          </p>
          <div className="flex justify-center">
            <div className="h-1 w-8 rounded-full bg-blue-200 dark:bg-blue-800"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-900 dark:text-white sm:text-3xl">
                Kelola User
              </h1>
              <p className="mt-1 text-sm text-blue-600 dark:text-slate-400">
                Kelola semua pengguna di sistem
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="rounded-lg border border-slate-200 bg-white p-2 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 sm:hidden"
              >
                <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>
              <Link href="/dashboard/user-management/create">
                <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-2 py-2 font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 hover:shadow">
                  <Plus className="h-4 w-4" />
                  <span>Tambah User</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Alerts */}
        {successMessage && (
          <div className="animate-fade-in mb-6">
            <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <p className="font-medium text-emerald-700 dark:text-emerald-300">
                {successMessage}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="animate-fade-in mb-6">
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <p className="font-medium text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Filter Panel untuk Mobile */}
        {showFilterPanel && (
          <div className="animate-slide-down mb-6 sm:hidden">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow dark:border-slate-700 dark:bg-slate-800">
              <div className="space-y-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Cari User
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-400" />
                    <input
                      type="text"
                      placeholder="Nama, email, atau telepon..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Filter Role
                  </label>
                  <select
                    value={filterRole}
                    onChange={(e) => {
                      setFilterRole(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    <option value="all">Semua Role</option>
                    <option value="superadmin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowFilterPanel(false)}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Terapkan Filter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total User
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {totalUsers}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-blue-200 bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Semua role pengguna
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Super Admin
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {
                    users.filter((u) => u.role === 'superadmin')
                      .length
                  }
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-blue-200 bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Admin tingkat tinggi
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Admin
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {users.filter((u) => u.role === 'admin').length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-900/30">
                <UserCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Admin biasa
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  User
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {users.filter((u) => u.role === 'user').length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-700">
                <User className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
            </div>
            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                User biasa
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section - Compact */}
        <div className="mb-6 rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-200 p-4 dark:border-slate-700">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari pengguna..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Filter Controls */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:block">
                  <select
                    value={filterRole}
                    onChange={(e) => {
                      setFilterRole(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    <option value="all">Semua Role</option>
                    <option value="superadmin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <div className="hidden sm:block">
                  <select
                    value={perPage}
                    onChange={(e) => {
                      setPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                  </select>
                </div>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilterPanel(!showFilterPanel)}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-2 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 sm:hidden"
                  title="Filter"
                >
                  <Filter className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </div>

            {/* Quick Filter Tags - Mobile */}
            <div className="mt-3 flex flex-wrap gap-2 sm:hidden">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Filter:
              </span>
              <button
                onClick={() => {
                  setFilterRole('all');
                  setCurrentPage(1);
                }}
                className={`rounded-full px-2 py-1 text-xs ${
                  filterRole === 'all'
                    ? 'border border-blue-200 bg-blue-100 text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'border border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => {
                  setFilterRole('superadmin');
                  setCurrentPage(1);
                }}
                className={`rounded-full px-2 py-1 text-xs ${
                  filterRole === 'superadmin'
                    ? 'border border-blue-200 bg-blue-100 text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'border border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                Super Admin
              </button>
              <button
                onClick={() => {
                  setFilterRole('admin');
                  setCurrentPage(1);
                }}
                className={`rounded-full px-2 py-1 text-xs ${
                  filterRole === 'admin'
                    ? 'border border-blue-200 bg-blue-100 text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'border border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => {
                  setFilterRole('user');
                  setCurrentPage(1);
                }}
                className={`rounded-full px-2 py-1 text-xs ${
                  filterRole === 'user'
                    ? 'border border-blue-200 bg-blue-100 text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'border border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                User
              </button>
            </div>
          </div>

          {/* Table Section */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500 dark:border-slate-700"></div>
                <p className="mt-4 font-medium text-slate-600 dark:text-slate-400">
                  Memuat data pengguna...
                </p>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="max-w-md text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                  <UserX className="h-10 w-10 text-slate-400" />
                </div>
                <p className="mb-2 font-semibold text-slate-900 dark:text-white">
                  Tidak ada pengguna ditemukan
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Coba sesuaikan pencarian atau filter Anda
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                {/* Desktop Table */}
                <table className="hidden w-full lg:table">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-700 dark:text-slate-400">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-700 dark:text-slate-400">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-700 dark:text-slate-400">
                        Divisi
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-700 dark:text-slate-400">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-700 dark:text-slate-400">
                        Tanggal Bergabung
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-slate-700 dark:text-slate-400">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-100 font-semibold text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                                {user.name}
                              </p>
                              <div className="mt-1 flex items-center gap-2">
                                <Mail className="h-3 w-3 text-slate-400" />
                                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                  {user.email}
                                </p>
                              </div>
                              {user.phone && (
                                <div className="mt-1 flex items-center gap-2">
                                  <Phone className="h-3 w-3 text-slate-400" />
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {user.phone}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block rounded-full px-3 py-1.5 text-xs font-medium ${getRoleColor(
                              user.role
                            )}`}
                          >
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                              {user.divisi || '-'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block rounded-full px-3 py-1.5 text-xs font-medium ${getStatusColor(
                              !!user.email_verified_at
                            )}`}
                          >
                            {user.email_verified_at
                              ? 'Aktif'
                              : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                              {formatDate(user.created_at)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/dashboard/user-management/${user.id}`}
                            >
                              <button
                                className="rounded-lg p-2 text-blue-600 transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                title="Detail"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </Link>
                            <Link
                              href={`/dashboard/user-management/${user.id}/edit`}
                            >
                              <button
                                className="rounded-lg p-2 text-slate-600 transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            </Link>
                            {user.email_verified_at ? (
                              <button
                                onClick={() =>
                                  handleDeactivateUser(user.id)
                                }
                                className="rounded-lg p-2 text-amber-600 transition-colors duration-200 hover:bg-amber-50 dark:hover:bg-amber-900/30"
                                title="Nonaktifkan"
                              >
                                <UserX className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleActivateUser(user.id)
                                }
                                className="rounded-lg p-2 text-emerald-600 transition-colors duration-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                                title="Aktifkan"
                              >
                                <UserCheck className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() =>
                                setShowDeleteConfirm(user.id)
                              }
                              className="rounded-lg p-2 text-red-600 transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-900/30"
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile Cards */}
                <div className="space-y-3 p-4 lg:hidden">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-200 bg-blue-100 font-semibold text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {user.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setShowMobileMenu(
                              showMobileMenu === user.id
                                ? null
                                : user.id
                            )
                          }
                          className="rounded-lg p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                          <MoreVertical className="h-5 w-5 text-slate-400" />
                        </button>
                      </div>

                      <div className="mb-4 grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Role
                          </p>
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getRoleColor(
                              user.role
                            )}`}
                          >
                            {getRoleLabel(user.role)}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Status
                          </p>
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                              !!user.email_verified_at
                            )}`}
                          >
                            {user.email_verified_at
                              ? 'Aktif'
                              : 'Pending'}
                          </span>
                        </div>
                        <div className="col-span-2 space-y-1">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-slate-400" />
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              {user.divisi || '-'}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-2 space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              {formatDate(user.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Action Menu */}
                      {showMobileMenu === user.id && (
                        <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                          <div className="grid grid-cols-2 gap-2">
                            <Link
                              href={`/dashboard/user-management/${user.id}`}
                            >
                              <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2 font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-800/30">
                                <Eye className="h-4 w-4" />
                                Lihat
                              </button>
                            </Link>
                            <Link
                              href={`/dashboard/user-management/${user.id}/edit`}
                            >
                              <button className="flex items-center justify-center gap-2 rounded-lg bg-slate-50 px-3 py-2 font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
                                <Edit className="h-4 w-4" />
                                Edit
                              </button>
                            </Link>
                            {user.email_verified_at ? (
                              <button
                                onClick={() =>
                                  handleDeactivateUser(user.id)
                                }
                                className="flex items-center justify-center gap-2 rounded-lg bg-amber-50 px-3 py-2 font-medium text-amber-600 transition-colors hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-800/30"
                              >
                                <UserX className="h-4 w-4" />
                                Nonaktifkan
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleActivateUser(user.id)
                                }
                                className="flex items-center justify-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 font-medium text-emerald-600 transition-colors hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-800/30"
                              >
                                <UserCheck className="h-4 w-4" />
                                Aktifkan
                              </button>
                            )}
                            <button
                              onClick={() =>
                                setShowDeleteConfirm(user.id)
                              }
                              className="col-span-2 flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/30"
                            >
                              <Trash2 className="h-4 w-4" />
                              Hapus User
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-slate-200 p-6 dark:border-slate-700">
                  <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Menampilkan{' '}
                      <span className="font-medium text-slate-900 dark:text-white">
                        {(currentPage - 1) * perPage + 1}
                      </span>{' '}
                      -{' '}
                      <span className="font-medium text-slate-900 dark:text-white">
                        {Math.min(currentPage * perPage, totalUsers)}
                      </span>{' '}
                      dari{' '}
                      <span className="font-medium text-slate-900 dark:text-white">
                        {totalUsers}
                      </span>{' '}
                      pengguna
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1 || isProcessing}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          Sebelumnya
                        </span>
                      </button>

                      <div className="flex items-center gap-1">
                        {getPaginationNumbers().map((pageNum, idx) =>
                          pageNum === '...' ? (
                            <span
                              key={`dots-${idx}`}
                              className="px-3 py-2 text-slate-400"
                            >
                              ...
                            </span>
                          ) : (
                            <button
                              key={pageNum}
                              onClick={() =>
                                setCurrentPage(pageNum as number)
                              }
                              disabled={isProcessing}
                              className={`rounded-lg px-4 py-2 font-medium transition-colors duration-200 ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        )}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage(
                            Math.min(totalPages, currentPage + 1)
                          )
                        }
                        disabled={
                          currentPage === totalPages || isProcessing
                        }
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        <span className="hidden sm:inline">
                          Selanjutnya
                        </span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="animate-scale-up w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-red-200 bg-red-100 dark:border-red-800 dark:bg-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Hapus User
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <p className="mb-6 text-slate-700 dark:text-slate-300">
              Apakah Anda yakin ingin menghapus pengguna ini? Semua
              data terkait akan dihapus secara permanen.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleDeleteUser(showDeleteConfirm)}
                disabled={isProcessing}
                className="flex-1 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-50"
              >
                {isProcessing ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(null);
                  setShowMobileMenu(null);
                }}
                className="flex-1 rounded-lg bg-slate-100 px-4 py-3 font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
