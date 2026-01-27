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
        user: userData,
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
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Pengguna tidak ditemukan');
        }
        throw new Error(data.message || 'Gagal mengambil detail pengguna');
      }

      if (!data.success) {
        throw new Error(data.message || 'Gagal mengambil detail pengguna');
      }

      setUser(data.data);
    } catch (err) {
      console.error('Fetch user detail error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data pengguna';
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
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal menghapus pengguna');
      }

      if (!data.success) {
        throw new Error(data.message || 'Gagal menghapus pengguna');
      }

      // Redirect to user list after successful deletion
      router.push('/dashboard/superadmin/user-management');
      router.refresh();
    } catch (err) {
      console.error('Delete user error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Gagal menghapus pengguna';
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
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengaktifkan pengguna');
      }

      // Refresh user data
      await fetchUserDetail();
    } catch (err) {
      console.error('Activate user error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Gagal mengaktifkan pengguna';
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
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal menonaktifkan pengguna');
      }

      // Refresh user data
      await fetchUserDetail();
    } catch (err) {
      console.error('Deactivate user error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Gagal menonaktifkan pengguna';
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
      minute: '2-digit',
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-400 mt-4 font-medium">Menyiapkan halaman...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8 max-w-md w-full border border-slate-200 dark:border-slate-700">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center border border-blue-200 dark:border-blue-800">
              <AlertTriangle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">Autentikasi Diperlukan</h2>
          <p className="text-slate-600 dark:text-slate-300 text-center mb-4">{error || 'Silakan login untuk melanjutkan'}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/dashboard/superadmin/user-management">
                  <button className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">Detail Pengguna</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Memuat data...</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-600 dark:text-slate-400 mt-4 font-medium">Memuat detail pengguna...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/dashboard/superadmin/user-management">
                  <button className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">Detail Pengguna</h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <div>
                <p className="text-red-700 dark:text-red-300 font-medium">{error || 'Pengguna tidak ditemukan'}</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">ID Pengguna: {userId}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/dashboard/superadmin/user-management">
                <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
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
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard/superadmin/user-management">
                <button className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Detail Pengguna</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">ID: {user.id} • {user.name}</p>
              </div>
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              {user.email_verified_at ? (
                <button
                  onClick={handleDeactivateUser}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 border border-amber-200 dark:border-amber-800 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Nonaktifkan
                </button>
              ) : (
                <button
                  onClick={handleActivateUser}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Aktifkan
                </button>
              )}
              
              <Link href={`/dashboard/superadmin/user-management/${user.id}/edit`}>
                <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800 transition-colors">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              </Link>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Hapus
              </button>
            </div>

            {/* Mobile Actions Button */}
            <div className="md:hidden relative">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              
              {/* Mobile Dropdown Menu */}
              {showMobileMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50 py-1">
                  <Link href={`/dashboard/superadmin/user-management/${user.id}/edit`}>
                    <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <Edit className="w-4 h-4" />
                      Edit Pengguna
                    </button>
                  </Link>
                  
                  {user.email_verified_at ? (
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        handleDeactivateUser();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Nonaktifkan
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        handleActivateUser();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Aktifkan
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      setShowDeleteConfirm(true);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus Pengguna
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Alerts */}
        {error && (
          <div className="mb-6 animate-fade-in">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300 font-medium text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400 text-sm">{user.email}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        user.email_verified_at 
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}>
                        {user.email_verified_at ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Aktif
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Informasi Pribadi
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Hash className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">ID Pengguna</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Telepon</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{user.phone || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {user.email_verified_at ? (
                      <MailCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <MailWarning className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Status Email</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {user.email_verified_at ? 'Terverifikasi' : 'Belum Verifikasi'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organizational Information */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Informasi Organisasi
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Divisi</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{user.divisi || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Unit Kerja</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{user.unit_kerja || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Hak Akses</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{getRoleLabel(user.role)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Information */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Informasi Sistem
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Tanggal Bergabung</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(user.created_at)}</p>
                  </div>
                  {user.email_verified_at && (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Tanggal Verifikasi</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(user.email_verified_at)}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Terakhir Diperbarui</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(user.updated_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Status Akun</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {user.email_verified_at ? 'Aktif' : 'Menunggu Aktivasi'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Action Buttons & Quick Info */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Tindakan Cepat</h3>
              <div className="space-y-3">
                <Link href={`/dashboard/superadmin/user-management/${user.id}/edit`}>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                    <Edit className="w-4 h-4" />
                    Edit Pengguna
                  </button>
                </Link>
                
                {user.email_verified_at ? (
                  <button
                    onClick={handleDeactivateUser}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Nonaktifkan Akun
                  </button>
                ) : (
                  <button
                    onClick={handleActivateUser}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Aktifkan Akun
                  </button>
                )}
                
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus Pengguna
                </button>
              </div>
            </div>

            {/* Back Button - Mobile only */}
            <div className="block lg:hidden">
              <Link href="/dashboard/superadmin/user-management">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Daftar
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 transform animate-scale-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center border border-red-200 dark:border-red-800">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Hapus Pengguna</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>
            
            <p className="text-slate-700 dark:text-slate-300 mb-6 text-sm">
              Apakah Anda yakin ingin menghapus pengguna <span className="font-semibold">{user.name}</span> ({user.email})?
              Semua data terkait akan dihapus secara permanen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  'Ya, Hapus'
                )}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200 text-sm"
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