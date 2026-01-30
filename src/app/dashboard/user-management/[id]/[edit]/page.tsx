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
  Save,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
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

interface UpdateUserData {
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin' | 'superadmin';
  divisi: string;
  unit_kerja: string;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    null
  );
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<UpdateUserData>({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    divisi: '',
    unit_kerja: ''
  });

  const [passwordData, setPasswordData] = useState({
    password: '',
    password_confirmation: ''
  });

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

      const userData = data.data;
      setUser(userData);

      // Set form data from user
      setFormData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        role: userData.role,
        divisi: userData.divisi || '',
        unit_kerja: userData.unit_kerja || ''
      });
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email) {
      setError('Nama dan email wajib diisi');
      return;
    }

    setUpdating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = getAuthToken();

      if (!token) {
        setError('Token tidak ditemukan. Silakan login kembali.');
        setUpdating(false);
        return;
      }

      const apiUrl = getApiUrl();
      const url = `${apiUrl}/superadmin/users/${userId}`;

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        role: formData.role,
        divisi: formData.divisi || null,
        unit_kerja: formData.unit_kerja || null
      };

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors)
            .flat()
            .join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Gagal memperbarui pengguna');
      }

      if (!data.success) {
        throw new Error(data.message || 'Gagal memperbarui pengguna');
      }

      setSuccessMessage('Pengguna berhasil diperbarui!');

      // Refresh user data
      await fetchUserDetail();
    } catch (err) {
      console.error('Update user error:', err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat memperbarui pengguna';
      setError(errorMsg);
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.password) {
      setError('Password tidak boleh kosong');
      return;
    }

    if (passwordData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    if (
      passwordData.password !== passwordData.password_confirmation
    ) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    setUpdating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = getAuthToken();

      if (!token) {
        setError('Token tidak ditemukan. Silakan login kembali.');
        setUpdating(false);
        return;
      }

      const apiUrl = getApiUrl();
      const url = `${apiUrl}/superadmin/users/${userId}/change-password`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: passwordData.password,
          password_confirmation: passwordData.password_confirmation
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors)
            .flat()
            .join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Gagal mengubah password');
      }

      if (!data.success) {
        throw new Error(data.message || 'Gagal mengubah password');
      }

      setSuccessMessage('Password berhasil diubah!');
      setPasswordData({
        password: '',
        password_confirmation: ''
      });
    } catch (err) {
      console.error('Change password error:', err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mengubah password';
      setError(errorMsg);
    } finally {
      setUpdating(false);
    }
  };

  const resetForm = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        divisi: user.divisi || '',
        unit_kerja: user.unit_kerja || ''
      });
    }
    setError(null);
    setSuccessMessage(null);
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
                <Link href={`/dashboard/user-management/${userId}`}>
                  <button className="rounded-lg border border-slate-200 bg-white p-2 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
                    <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </button>
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    Edit Pengguna
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Memuat data pengguna...
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
                Memuat data pengguna...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error && !user) {
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
                    Edit Pengguna
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
              <Link href={`/dashboard/user-management/${userId}`}>
                <button className="rounded-lg border border-slate-200 bg-white p-2 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
                  <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Edit Pengguna
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {user ? `Mengedit: ${user.name}` : 'Memuat data...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Alerts */}
        {error && (
          <div className="animate-fade-in mb-6">
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
              <div className="flex-1">
                <p className="font-medium text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="animate-fade-in mb-6">
            <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div className="flex-1">
                <p className="font-medium text-emerald-700 dark:text-emerald-300">
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Edit Form */}
          <div className="space-y-6 lg:col-span-2">
            {/* User Information Form */}
            <form onSubmit={handleSubmit}>
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Informasi Pengguna
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Perbarui informasi dasar pengguna
                  </p>
                </div>

                <div className="space-y-4 p-5">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Nama Lengkap *
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <User className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Email *
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        placeholder="Masukkan email"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Nomor Telepon
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Phone className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        placeholder="Masukkan nomor telepon"
                      />
                    </div>
                  </div>

                  {/* Role Field */}
                  <div>
                    <label
                      htmlFor="role"
                      className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Peran (Role) *
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Shield className="h-4 w-4 text-slate-400" />
                      </div>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="block w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        required
                      >
                        <option value="user">Pengguna</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">
                          Super Admin
                        </option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                          className="h-4 w-4 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organizational Information */}
              <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Informasi Organisasi
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Informasi divisi dan unit kerja
                  </p>
                </div>

                <div className="space-y-4 p-5">
                  {/* Divisi Field */}
                  <div>
                    <label
                      htmlFor="divisi"
                      className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Divisi
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Building className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        id="divisi"
                        name="divisi"
                        value={formData.divisi}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        placeholder="Masukkan divisi"
                      />
                    </div>
                  </div>

                  {/* Unit Kerja Field */}
                  <div>
                    <label
                      htmlFor="unit_kerja"
                      className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Unit Kerja
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Building className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        id="unit_kerja"
                        name="unit_kerja"
                        value={formData.unit_kerja}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        placeholder="Masukkan unit kerja"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={updating}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Simpan Perubahan
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={updating}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  Reset Form
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Password Change & Actions */}
          <div className="space-y-6">
            {/* Change Password Card */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-700/70 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <svg
                      className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Keamanan Akun
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Atur password baru untuk pengguna
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-6">
                {/* New Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Password Baru
                    </label>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      Minimal 6 karakter
                    </span>
                  </div>
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={passwordData.password}
                      onChange={handlePasswordChange}
                      className="block w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 group-hover:border-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                      title={
                        showPassword
                          ? 'Sembunyikan password'
                          : 'Tampilkan password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="password_confirmation"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Konfirmasi Password
                  </label>
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password_confirmation"
                      name="password_confirmation"
                      value={passwordData.password_confirmation}
                      onChange={handlePasswordChange}
                      className="block w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 group-hover:border-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    {passwordData.password &&
                      passwordData.password_confirmation && (
                        <>
                          {passwordData.password ===
                          passwordData.password_confirmation ? (
                            <CheckCircle className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 text-amber-500" />
                          )}
                          <span
                            className={`text-xs ${
                              passwordData.password ===
                              passwordData.password_confirmation
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {passwordData.password ===
                            passwordData.password_confirmation
                              ? 'Password cocok'
                              : 'Password tidak cocok'}
                          </span>
                        </>
                      )}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={
                      updating ||
                      !passwordData.password ||
                      !passwordData.password_confirmation
                    }
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Mengubah Password...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span>Perbarui Password</span>
                      </>
                    )}
                  </button>

                  {(!passwordData.password ||
                    !passwordData.password_confirmation) && (
                    <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
                      Isi kedua field password untuk mengaktifkan
                      tombol
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* User Status Info */}
            {user && (
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                  Status Pengguna
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Status Akun
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        user.email_verified_at
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                      }`}
                    >
                      {user.email_verified_at ? 'Aktif' : 'Pending'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      ID Pengguna
                    </span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {user.id}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Bergabung
                    </span>
                    <span className="text-sm text-slate-900 dark:text-white">
                      {new Date(user.created_at).toLocaleDateString(
                        'id-ID'
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
