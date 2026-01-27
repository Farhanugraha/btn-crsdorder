'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin' | 'superadmin'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  // Perbaikan 1: Ambil API URL dengan fallback yang lebih baik
  const getApiUrl = useCallback(() => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // Jika sudah lengkap dengan /api, gunakan langsung
    if (envUrl && envUrl.includes('/api')) {
      return envUrl;
    }
    
    // Jika ada URL tanpa /api, tambahkan /api
    if (envUrl) {
      return `${envUrl}/api`;
    }
    
    // Default fallback
    return 'http://localhost:8000/api';
  }, []);

  // Perbaikan 2: Perbaiki cara mendapatkan token dari localStorage
  const getAuthToken = useCallback((): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      
      const token = localStorage.getItem('auth_token');
      console.log('Token dari localStorage:', token ? 'Ada' : 'Tidak ada');
      
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }, []);

  // Perbaikan 3: Perbaiki cara mengecek autentikasi
  const checkAuthentication = useCallback(() => {
    try {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('auth_user');

      console.log('=== AUTH CHECK ===');
      console.log('Token exists:', !!token);
      console.log('User exists:', !!userStr);

      if (!token || !userStr) {
        console.log('Auth failed: No token or user');
        setIsAuthenticated(false);
        setAuthData(null);
        setError('Silakan login terlebih dahulu');
        
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
        return;
      }

      const userData = JSON.parse(userStr);
      console.log('User role:', userData.role);

      if (userData.role !== 'superadmin') {
        console.log('Auth failed: Not superadmin');
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
      console.log('Auth success');
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

  // Perbaikan 4: Client side mounting
  useEffect(() => {
    setMounted(true);
    checkAuthentication();
  }, [checkAuthentication]);

  // Perbaikan 5: Perbaiki fetch users dengan better error handling
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      
      if (!token) {
        console.log('No token available for fetching users');
        setError('Token tidak ditemukan. Silakan login kembali.');
        setIsAuthenticated(false);
        setTimeout(() => router.push('/auth/login'), 2000);
        return;
      }

      const apiUrl = getApiUrl();
      
      // Build query params
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        per_page: perPage.toString(),
      });
      
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      
      if (filterRole !== 'all') {
        queryParams.append('role', filterRole);
      }

      const url = `${apiUrl}/superadmin/users?${queryParams.toString()}`;
      console.log('Fetching from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Token expired or invalid');
          setError('Token Anda telah kadaluarsa. Silakan login kembali.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setTimeout(() => router.push('/auth/login'), 2000);
          return;
        }

        if (response.status === 403) {
          console.log('Forbidden - not superadmin');
          setError('Anda tidak memiliki akses ke halaman ini.');
          setIsAuthenticated(false);
          return;
        }

        if (response.status === 404) {
          console.log('Not found - showing empty state');
          setUsers([]);
          setTotalPages(1);
          setTotalUsers(0);
          return;
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Response structure:', {
        has_data: !!result.data,
        has_data_data: !!result.data?.data,
        success: result.success,
      });

      if (!result.success) {
        throw new Error(result.message || 'Gagal mengambil data pengguna');
      }

      // Handle pagination response - sesuaikan dengan struktur Laravel
      const userData = result.data?.data || result.data || [];
      const lastPage = result.data?.last_page || result.last_page || 1;
      const total = result.data?.total || result.total || 0;

      console.log('Data mapped:', {
        users_count: Array.isArray(userData) ? userData.length : 0,
        total,
        last_page: lastPage,
      });

      setUsers(Array.isArray(userData) ? userData : []);
      setTotalPages(lastPage);
      setTotalUsers(total);
    } catch (err) {
      console.error('Fetch error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan koneksi';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, searchTerm, filterRole, getAuthToken, getApiUrl, router]);

  // Fetch users ketika mounted dan authenticated
  useEffect(() => {
    if (mounted && isAuthenticated) {
      fetchUsers();
    }
  }, [mounted, isAuthenticated, fetchUsers]);

  // Perbaikan 6: Delete user dengan better error handling
  const handleDeleteUser = useCallback(async (id: number) => {
    try {
      setIsProcessing(true);
      const token = getAuthToken();

      if (!token) {
        setError('Token tidak ditemukan');
        return;
      }

      const apiUrl = getApiUrl();
      const url = `${apiUrl}/superadmin/users/${id}`;
      console.log('Deleting user:', url);

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

      setSuccessMessage('Pengguna berhasil dihapus');
      setShowDeleteConfirm(null);
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetchUsers();
    } catch (error) {
      console.error('Delete error:', error);
      setError(error instanceof Error ? error.message : 'Gagal menghapus pengguna');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsProcessing(false);
    }
  }, [getAuthToken, getApiUrl, fetchUsers]);

  // Perbaikan 7: Activate user
  const handleActivateUser = useCallback(async (id: number) => {
    try {
      setIsProcessing(true);
      const token = getAuthToken();

      if (!token) {
        setError('Token tidak ditemukan');
        return;
      }

      const apiUrl = getApiUrl();
      const url = `${apiUrl}/superadmin/users/${id}/activate`;
      console.log('Activating user:', url);

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

      setSuccessMessage('Pengguna berhasil diaktifkan');
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetchUsers();
    } catch (error) {
      console.error('Activate error:', error);
      setError(error instanceof Error ? error.message : 'Gagal mengaktifkan pengguna');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsProcessing(false);
    }
  }, [getAuthToken, getApiUrl, fetchUsers]);

  // Perbaikan 8: Deactivate user
  const handleDeactivateUser = useCallback(async (id: number) => {
    try {
      setIsProcessing(true);
      const token = getAuthToken();

      if (!token) {
        setError('Token tidak ditemukan');
        return;
      }

      const apiUrl = getApiUrl();
      const url = `${apiUrl}/superadmin/users/${id}/deactivate`;
      console.log('Deactivating user:', url);

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

      setSuccessMessage('Pengguna berhasil dinonaktifkan');
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetchUsers();
    } catch (error) {
      console.error('Deactivate error:', error);
      setError(error instanceof Error ? error.message : 'Gagal menonaktifkan pengguna');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsProcessing(false);
    }
  }, [getAuthToken, getApiUrl, fetchUsers]);

  // Perbaikan 9: Logout
  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('token_expires_in');
      setIsAuthenticated(false);
      setAuthData(null);
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/auth/login');
    }
  }, [router]);

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
        return 'bg-blue-100 text-blue-800';
      case 'admin':
        return 'bg-blue-50 text-blue-700';
      case 'user':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-blue-600 mt-4 font-medium">Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-red-600 text-xl">!</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Autentikasi Diperlukan</h2>
          <p className="text-gray-600 text-center mb-4">{error || 'Silakan login untuk melanjutkan'}</p>
          <p className="text-sm text-gray-500 text-center">Anda akan dialihkan ke halaman login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <header className="bg-white border-b border-blue-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Manajemen Pengguna</h1>
              <p className="text-sm text-blue-600 mt-1">Kelola semua pengguna sistem</p>
            </div>
            <div className="flex items-center gap-3">
              {authData?.user && (
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">{authData.user.name}</p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
              )}
              <Link href="/superadmin/management-user/create">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                  Tambah Pengguna
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-2 border border-blue-200 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm font-medium">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-blue-100 p-6 shadow-sm">
            <p className="text-sm text-blue-600 font-medium">Total Pengguna</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">{totalUsers}</p>
          </div>
          <div className="bg-white rounded-lg border border-blue-100 p-6 shadow-sm">
            <p className="text-sm text-blue-600 font-medium">Super Admin</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">
              {users.filter(u => u.role === 'superadmin').length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-blue-100 p-6 shadow-sm">
            <p className="text-sm text-blue-600 font-medium">Admin</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-blue-100 p-6 shadow-sm">
            <p className="text-sm text-blue-600 font-medium">Pengguna</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">
              {users.filter(u => u.role === 'user').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-blue-100 shadow-sm">
          <div className="border-b border-blue-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cari Pengguna</label>
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama, email, atau telepon..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  disabled={loading || isProcessing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter Role</label>
                <select
                  value={filterRole}
                  onChange={(e) => {
                    setFilterRole(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  disabled={loading || isProcessing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="all">Semua Role</option>
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="user">Pengguna</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Per Halaman</label>
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  disabled={loading || isProcessing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value={5}>5 Item</option>
                  <option value={10}>10 Item</option>
                  <option value={15}>15 Item</option>
                  <option value={25}>25 Item</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block">
                  <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600 mt-3 font-medium">Memuat data pengguna...</p>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-blue-300">∅</span>
                </div>
                <p className="text-gray-600 font-medium mb-1">Tidak ada pengguna ditemukan</p>
                <p className="text-sm text-gray-500">Coba sesuaikan pencarian atau filter Anda</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-100 bg-blue-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Nama</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Divisi</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Dibuat</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-blue-900">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{user.divisi || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        {user.email_verified_at ? (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{formatDate(user.created_at)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/superadmin/management-user/${user.id}`}>
                            <button
                              className="px-3 py-1 text-blue-600 font-medium text-sm hover:bg-blue-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                              disabled={isProcessing}
                            >
                              Edit
                            </button>
                          </Link>
                          {user.email_verified_at ? (
                            <button
                              onClick={() => handleDeactivateUser(user.id)}
                              className="px-3 py-1 text-orange-600 font-medium text-sm hover:bg-orange-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                              disabled={isProcessing}
                            >
                              Nonaktifkan
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivateUser(user.id)}
                              className="px-3 py-1 text-green-600 font-medium text-sm hover:bg-green-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                              disabled={isProcessing}
                            >
                              Aktifkan
                            </button>
                          )}
                          <div className="relative">
                            <button
                              onClick={() => setShowDeleteConfirm(user.id)}
                              className="px-3 py-1 text-red-600 font-medium text-sm hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                              disabled={isProcessing}
                            >
                              Hapus
                            </button>
                            {showDeleteConfirm === user.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
                                <p className="text-sm text-gray-700 font-medium mb-3">Yakin ingin menghapus pengguna ini?</p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                                    disabled={isProcessing}
                                  >
                                    Hapus
                                  </button>
                                  <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    Batal
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && users.length > 0 && totalPages > 1 && (
            <div className="border-t border-blue-100 px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Halaman <span className="font-semibold text-gray-900">{currentPage}</span> dari <span className="font-semibold text-gray-900">{totalPages}</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || isProcessing}
                  className="px-4 py-2 border border-blue-200 text-blue-600 rounded-lg font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages || isProcessing}
                  className="px-4 py-2 border border-blue-200 text-blue-600 rounded-lg font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}