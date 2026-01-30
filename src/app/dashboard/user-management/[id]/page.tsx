'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Shield,
  Building,
  Calendar,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  AlertTriangle,
  Loader2,
  Clock,
  Hash,
  MoreVertical,
  Shield as ShieldIcon,
  Briefcase,
  MailCheck,
  MailWarning
} from 'lucide-react';

interface UserDetail {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'user' | 'admin' | 'superadmin';
  divisi: string | null;
  unit_kerja: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
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

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const getAuthToken = (): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  const getApiUrl = () => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;

    if (envUrl && envUrl.includes('/api')) {
      return envUrl;
    }

    if (envUrl) {
      return `${envUrl}/api`;
    }

    return 'http://localhost:8000/api';
  };

  useEffect(() => {
    setMounted(true);
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchUserDetail();
    }
  }, [isAuthenticated, userId]);

  const checkAuthentication = () => {
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
  };

  const fetchUserDetail = async () => {
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
      const url = `${apiUrl}/superadmin/users/${userId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Pengguna tidak ditemukan');
        }
        throw new Error(
          data.message || 'Gagal mengambil detail pengguna'
        );
      }

      if (!data.success) {
        throw new Error(
          data.message || 'Gagal mengambil detail pengguna'
        );
      }

      setUser(data.data);
    } catch (err) {
      console.error('Fetch user detail error:', err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mengambil data pengguna';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setIsDeleting(true);
      const token = getAuthToken();

      if (!token) {
        setError('Token tidak ditemukan');
        return;
      }

      const apiUrl = getApiUrl();
      const url = `${apiUrl}/superadmin/users/${userId}`;

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

      if (!data.success) {
        throw new Error(data.message || 'Gagal menghapus pengguna');
      }

      // Redirect to user list after successful deletion
      router.push('/dashboard/user-management');
      router.refresh();
    } catch (err) {
      console.error('Delete user error:', err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Gagal menghapus pengguna';
      setError(errorMsg);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleActivateUser = async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        setError('Token tidak ditemukan');
        return;
      }

      const apiUrl = getApiUrl();
      const url = `${apiUrl}/superadmin/users/${userId}/activate`;

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

      // Refresh user data
      await fetchUserDetail();
    } catch (err) {
      console.error('Activate user error:', err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Gagal mengaktifkan pengguna';
      setError(errorMsg);
    }
  };

  const handleDeactivateUser = async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        setError('Token tidak ditemukan');
        return;
      }

      const apiUrl = getApiUrl();
      const url = `${apiUrl}/superadmin/users/${userId}/deactivate`;

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

      // Refresh user data
      await fetchUserDetail();
    } catch (err) {
      console.error('Deactivate user error:', err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Gagal menonaktifkan pengguna';
      setError(errorMsg);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'user':
        return 'Pengguna';
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

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500 dark:border-slate-700"></div>
          <p className="mt-4 font-medium text-slate-600 dark:text-slate-400">
            Menyiapkan halaman...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
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
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/dashboard/user-management">
                  <button className="rounded-lg border border-slate-200 bg-white p-2 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
                    <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </button>
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    Detail Pengguna
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Memuat data...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500 dark:border-slate-700"></div>
              <p className="mt-4 font-medium text-slate-600 dark:text-slate-400">
                Memuat detail pengguna...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/dashboard/user-management">
                  <button className="rounded-lg border border-slate-200 bg-white p-2 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
                    <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </button>
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    Detail Pengguna
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div>
                <p className="font-medium text-red-700 dark:text-red-300">
                  {error || 'Pengguna tidak ditemukan'}
                </p>
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  ID Pengguna: {userId}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/dashboard/user-management">
                <button className="rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
                  Kembali ke Daftar Pengguna
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard/user-management">
                <button className="rounded-lg border border-slate-200 bg-white p-2 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
                  <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Detail Pengguna
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  ID: {user.id} • {user.name}
                </p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden items-center gap-2 md:flex">
              {user.email_verified_at ? (
                <button
                  onClick={handleDeactivateUser}
                  className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/30"
                >
                  <XCircle className="h-4 w-4" />
                  Nonaktifkan
                </button>
              ) : (
                <button
                  onClick={handleActivateUser}
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
                >
                  <CheckCircle className="h-4 w-4" />
                  Aktifkan
                </button>
              )}

              <Link
                href={`/dashboard/user-management/${user.id}/edit`}
              >
                <button className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30">
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
              </Link>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
              >
                <Trash2 className="h-4 w-4" />
                Hapus
              </button>
            </div>

            {/* Mobile Actions Button */}
            <div className="relative md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="rounded-lg border border-slate-200 bg-white p-2 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <MoreVertical className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>

              {/* Mobile Dropdown Menu */}
              {showMobileMenu && (
                <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <Link
                    href={`/dashboard/user-management/${user.id}/edit`}
                  >
                    <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50">
                      <Edit className="h-4 w-4" />
                      Edit Pengguna
                    </button>
                  </Link>

                  {user.email_verified_at ? (
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        handleDeactivateUser();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-amber-600 transition-colors hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20"
                    >
                      <XCircle className="h-4 w-4" />
                      Nonaktifkan
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        handleActivateUser();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Aktifkan
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      setShowDeleteConfirm(true);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus Pengguna
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Alerts */}
        {error && (
          <div className="animate-fade-in mb-6">
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
              <p className="text-sm font-medium text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Profile & Basic Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Profile Card */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {user.name}
                      </h2>
                      <div className="mt-1 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {getRoleLabel(user.role)}
                      </span>
                      <span
                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                          user.email_verified_at
                            ? 'border border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                            : 'border border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                        }`}
                      >
                        {user.email_verified_at ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Aktif
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            Pending
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Personal Information */}
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Informasi Pribadi
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Hash className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                        ID Pengguna
                      </p>
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                        {user.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                        Telepon
                      </p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {user.phone || '-'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {user.email_verified_at ? (
                      <MailCheck className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                    ) : (
                      <MailWarning className="h-4 w-4 flex-shrink-0 text-amber-500" />
                    )}
                    <div className="min-w-0">
                      <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                        Status Email
                      </p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {user.email_verified_at
                          ? 'Terverifikasi'
                          : 'Belum Verifikasi'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organizational Information */}
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                  <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Informasi Organisasi
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                        Divisi
                      </p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {user.divisi || '-'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                        Unit Kerja
                      </p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {user.unit_kerja || '-'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldIcon className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                        Hak Akses
                      </p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {getRoleLabel(user.role)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Information */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Informasi Sistem
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                      Tanggal Bergabung
                    </p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {formatDate(user.created_at)}
                    </p>
                  </div>
                  {user.email_verified_at && (
                    <div>
                      <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                        Tanggal Verifikasi
                      </p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {formatDate(user.email_verified_at)}
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                      Terakhir Diperbarui
                    </p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {formatDate(user.updated_at)}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                      Status Akun
                    </p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {user.email_verified_at
                        ? 'Aktif'
                        : 'Menunggu Aktivasi'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Action Buttons & Quick Info */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                Tindakan Cepat
              </h3>
              <div className="space-y-3">
                <Link
                  href={`/dashboard/user-management/${user.id}/edit`}
                >
                  <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                    <Edit className="h-4 w-4" />
                    Edit Pengguna
                  </button>
                </Link>

                {user.email_verified_at ? (
                  <button
                    onClick={handleDeactivateUser}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-700"
                  >
                    <XCircle className="h-4 w-4" />
                    Nonaktifkan Akun
                  </button>
                ) : (
                  <button
                    onClick={handleActivateUser}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Aktifkan Akun
                  </button>
                )}

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus Pengguna
                </button>
              </div>
            </div>

            {/* Back Button - Mobile only */}
            <div className="block lg:hidden">
              <Link href="/dashboard/user-management">
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Daftar
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="animate-scale-up w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 bg-red-100 dark:border-red-800 dark:bg-red-900/30">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Hapus Pengguna
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm text-slate-700 dark:text-slate-300">
              Apakah Anda yakin ingin menghapus pengguna{' '}
              <span className="font-semibold">{user.name}</span> (
              {user.email})? Semua data terkait akan dihapus secara
              permanen.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  'Ya, Hapus'
                )}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
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
