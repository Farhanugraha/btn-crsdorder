'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  ChevronDown,
  Check,
  X,
  Database,
  ShieldCheck,
  ShieldAlert,
  Users,
  Lock
} from 'lucide-react';

interface AuthData {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'superadmin';
  };
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  role: 'user' | 'admin' | 'superadmin';
  divisi: string;
  unit_kerja: string;
  data_access?: string[];
}

interface DataTypeOption {
  value: string;
  label: string;
  description: string;
}

export default function CreateUserPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDataTypes, setLoadingDataTypes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    null
  );

  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    role: 'user',
    divisi: '',
    unit_kerja: '',
    data_access: []
  });

  const [dataTypeOptions, setDataTypeOptions] = useState<
    DataTypeOption[]
  >([]);
  const [selectedDataTypes, setSelectedDataTypes] = useState<
    string[]
  >([]);
  const [showDataTypeDropdown, setShowDataTypeDropdown] =
    useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

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
    // Fetch data types when role is admin
    if (formData.role === 'admin' && dataTypeOptions.length === 0) {
      fetchDataTypes();
    }

    // Clear data_access when role changes from admin
    if (formData.role !== 'admin') {
      setSelectedDataTypes([]);
      setFormData((prev) => ({ ...prev, data_access: [] }));
    }
  }, [formData.role]);

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

  const fetchDataTypes = async () => {
    setLoadingDataTypes(true);
    try {
      const token = getAuthToken();
      if (!token) return;

      const apiUrl = getApiUrl();
      const response = await fetch(
        `${apiUrl}/superadmin/data-types`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setDataTypeOptions(data.data);
        } else {
          // Set default options if API fails
          setDefaultDataTypeOptions();
        }
      } else {
        setDefaultDataTypeOptions();
      }
    } catch (error) {
      console.error('Error fetching data types:', error);
      setDefaultDataTypeOptions();
    } finally {
      setLoadingDataTypes(false);
    }
  };

  const setDefaultDataTypeOptions = () => {
    const defaultOptions: DataTypeOption[] = [
      {
        value: 'crsd1',
        label: 'CRSD 1',
        description: 'Collection Resources and Asset Sales Data 1'
      },
      {
        value: 'crsd2',
        label: 'CRSD 2',
        description: 'Collection Resources and Asset Sales Data 2'
      }
    ];
    setDataTypeOptions(defaultOptions);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDataTypeToggle = (dataType: string) => {
    let newSelectedDataTypes: string[];

    // Jika memilih semua (both)
    if (dataType === 'both') {
      if (selectedDataTypes.length === 2) {
        // Jika sudah memilih keduanya, hapus semua
        newSelectedDataTypes = [];
      } else {
        // Pilih keduanya
        newSelectedDataTypes = ['crsd1', 'crsd2'];
      }
    } else {
      // Handle individual data type
      if (selectedDataTypes.includes(dataType)) {
        // Remove the data type
        newSelectedDataTypes = selectedDataTypes.filter(
          (type) => type !== dataType
        );
      } else {
        // Add the data type
        newSelectedDataTypes = [...selectedDataTypes, dataType];

        // Jika sudah memilih kedua jenis, tambahkan opsi 'both' secara virtual
        if (newSelectedDataTypes.length === 2) {
          // Tidak perlu menambahkan 'both' ke array, cukup tampilkan sebagai "All Access"
        }
      }
    }

    setSelectedDataTypes(newSelectedDataTypes);
    setFormData((prev) => ({
      ...prev,
      data_access: newSelectedDataTypes
    }));
  };

  const handleRemoveDataType = (
    dataType: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    handleDataTypeToggle(dataType);
  };

  const getSelectedDataTypesDisplay = () => {
    if (selectedDataTypes.length === 0) {
      return [];
    }

    if (selectedDataTypes.length === 2) {
      return [
        ...dataTypeOptions.filter((opt) =>
          selectedDataTypes.includes(opt.value)
        ),
        {
          value: 'both',
          label: 'All Access',
          description: 'Akses ke semua data (CRSD 1 dan 2)'
        }
      ];
    }

    return dataTypeOptions.filter((opt) =>
      selectedDataTypes.includes(opt.value)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Nama, email, dan password wajib diisi');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    // Validate data_access for admin
    if (
      formData.role === 'admin' &&
      (!formData.data_access || formData.data_access.length === 0)
    ) {
      setError('Data access wajib dipilih untuk role admin');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = getAuthToken();

      if (!token) {
        setError('Token tidak ditemukan. Silakan login kembali.');
        setLoading(false);
        return;
      }

      const apiUrl = getApiUrl();
      const url = `${apiUrl}/superadmin/users`;

      // Prepare payload
      const payload: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        phone: formData.phone || null,
        role: formData.role,
        divisi: formData.divisi || null,
        unit_kerja: formData.unit_kerja || null
      };

      // Add data_access only for admin role
      if (
        formData.role === 'admin' &&
        formData.data_access &&
        formData.data_access.length > 0
      ) {
        payload.data_access = formData.data_access;
      }

      console.log('Sending payload:', payload);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (!response.ok) {
        if (data.errors) {
          // Format Laravel validation errors
          const errorMessages = Object.values(data.errors)
            .flat()
            .join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Gagal membuat pengguna');
      }

      if (!data.success) {
        throw new Error(data.message || 'Gagal membuat pengguna');
      }

      setSuccessMessage(data.message || 'Pengguna berhasil dibuat!');

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        role: 'user',
        divisi: '',
        unit_kerja: '',
        data_access: []
      });
      setSelectedDataTypes([]);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/user-management');
      }, 2000);
    } catch (err) {
      console.error('Create user error:', err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat membuat pengguna';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin':
        return <ShieldAlert className="h-5 w-5 text-red-500" />;
      case 'admin':
        return <ShieldCheck className="h-5 w-5 text-orange-500" />;
      case 'user':
        return <Users className="h-5 w-5 text-blue-500" />;
      default:
        return <Shield className="h-5 w-5 text-slate-500" />;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'Akses penuh ke semua fitur sistem';
      case 'admin':
        return 'Akses terbatas sesuai data yang diizinkan';
      case 'user':
        return 'Akses terbatas untuk penggunaan biasa';
      default:
        return '';
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/user-management">
                <button className="rounded-lg border border-slate-200 bg-white p-2 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
                  <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-blue-900 dark:text-white">
                  Tambah Pengguna Baru
                </h1>
                <p className="mt-1 text-sm text-blue-600 dark:text-slate-400">
                  Buat akun pengguna baru untuk sistem
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Alerts */}
        {successMessage && (
          <div className="animate-fade-in mb-6">
            <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <div className="flex-1">
                <p className="font-medium text-emerald-700 dark:text-emerald-300">
                  {successMessage}
                </p>
                <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
                  Mengalihkan ke daftar pengguna...
                </p>
              </div>
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

        {/* Form */}
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <div className="space-y-6">
                {/* Informasi Dasar */}
                <div>
                  <h2 className="mb-4 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
                    <User className="mr-2 inline h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Informasi Dasar
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Nama Lengkap{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        placeholder="contoh@email.com"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        placeholder="+62 812 3456 7890"
                      />
                    </div>
                  </div>
                </div>

                {/* Keamanan */}
                <div>
                  <h2 className="mb-4 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
                    <Shield className="mr-2 inline h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Keamanan & Role
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Password{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          minLength={6}
                          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-10 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          placeholder="Minimal 6 karakter"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(!showPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                        >
                          {showPassword ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            <Lock className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Konfirmasi Password{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={
                            showConfirmPassword ? 'text' : 'password'
                          }
                          name="password_confirmation"
                          value={formData.password_confirmation}
                          onChange={handleInputChange}
                          required
                          minLength={6}
                          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-10 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          placeholder="Ulangi password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              !showConfirmPassword
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                        >
                          {showConfirmPassword ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            <Lock className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <h2 className="mb-4 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
                    <Shield className="mr-2 inline h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Pilih Role
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {['superadmin', 'admin', 'user'].map((role) => (
                      <div
                        key={role}
                        className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 ${
                          formData.role === role
                            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            role: role as any
                          }));
                        }}
                      >
                        <div className="flex items-center gap-3">
                          {getRoleIcon(role)}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold capitalize text-slate-900 dark:text-white">
                                {role === 'superadmin'
                                  ? 'Super Admin'
                                  : role === 'admin'
                                    ? 'Administrator'
                                    : 'User'}
                              </span>
                              {formData.role === role && (
                                <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              )}
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {getRoleDescription(role)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data Access - Only for Admin */}
                {formData.role === 'admin' && (
                  <div className="animate-fade-in">
                    <h2 className="mb-4 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
                      <Database className="mr-2 inline h-5 w-5 text-orange-600 dark:text-orange-400" />
                      Data Access Admin{' '}
                      <span className="text-red-500">*</span>
                    </h2>
                    <div className="space-y-4">
                      {/* Selected Data Types */}
                      {selectedDataTypes.length > 0 && (
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Terpilih ({selectedDataTypes.length})
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {getSelectedDataTypesDisplay().map(
                              (type) => (
                                <span
                                  key={type.value}
                                  className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                >
                                  {type.label}
                                  {type.value !== 'both' && (
                                    <button
                                      type="button"
                                      onClick={(e) =>
                                        handleRemoveDataType(
                                          type.value,
                                          e
                                        )
                                      }
                                      className="ml-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  )}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* Data Type Selection */}
                      <div className="relative">
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Pilih Data Access
                        </label>
                        <div
                          className={`flex cursor-pointer items-center justify-between rounded-lg border bg-white p-3 dark:bg-slate-700 ${
                            showDataTypeDropdown
                              ? 'border-blue-500 ring-2 ring-blue-500/20'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                          onClick={() =>
                            setShowDataTypeDropdown(
                              !showDataTypeDropdown
                            )
                          }
                        >
                          <div className="flex items-center gap-2">
                            {loadingDataTypes ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  Memuat data access...
                                </span>
                              </>
                            ) : (
                              <>
                                <Database className="h-4 w-4 text-slate-400" />
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  {selectedDataTypes.length === 0
                                    ? 'Pilih data yang bisa diakses...'
                                    : selectedDataTypes.length === 2
                                      ? 'All Access (CRSD 1 & 2)'
                                      : `${selectedDataTypes.length} data terpilih`}
                                </span>
                              </>
                            )}
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 text-slate-400 transition-transform ${
                              showDataTypeDropdown ? 'rotate-180' : ''
                            }`}
                          />
                        </div>

                        {showDataTypeDropdown && (
                          <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                            {/* All Access Option */}
                            <div
                              className={`flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 ${
                                selectedDataTypes.length === 2
                                  ? 'bg-blue-50 dark:bg-blue-900/20'
                                  : ''
                              }`}
                              onClick={() =>
                                handleDataTypeToggle('both')
                              }
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-slate-900 dark:text-white">
                                    All Access
                                  </span>
                                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    Semua
                                  </span>
                                </div>
                                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                                  Akses ke semua data (CRSD 1 dan 2)
                                </p>
                              </div>
                              {selectedDataTypes.length === 2 && (
                                <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              )}
                            </div>

                            {/* Individual Options */}
                            {dataTypeOptions.map((option) => (
                              <div
                                key={option.value}
                                className={`flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 ${
                                  selectedDataTypes.includes(
                                    option.value
                                  )
                                    ? 'bg-blue-50 dark:bg-blue-900/20'
                                    : ''
                                }`}
                                onClick={() =>
                                  handleDataTypeToggle(option.value)
                                }
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-slate-900 dark:text-white">
                                      {option.label}
                                    </span>
                                  </div>
                                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                                    {option.description}
                                  </p>
                                </div>
                                {selectedDataTypes.includes(
                                  option.value
                                ) && (
                                  <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Information */}
                      {selectedDataTypes.length > 0 && (
                        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/10">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <div className="text-sm">
                              <p className="font-medium text-blue-800 dark:text-blue-300">
                                Admin akan memiliki akses ke:
                              </p>
                              <ul className="mt-1 space-y-1 text-blue-700 dark:text-blue-400">
                                {selectedDataTypes.length === 2 ? (
                                  <li>• Semua data (CRSD 1 dan 2)</li>
                                ) : (
                                  selectedDataTypes.map((type) => {
                                    const option =
                                      dataTypeOptions.find(
                                        (opt) => opt.value === type
                                      );
                                    return (
                                      option && (
                                        <li key={type}>
                                          • {option.description}
                                        </li>
                                      )
                                    );
                                  })
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Organisasi */}
                <div>
                  <h2 className="mb-4 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
                    <Building className="mr-2 inline h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Informasi Organisasi
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Left Column - Divisi Section */}
                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Divisi
                        </label>
                        <select
                          name="divisi"
                          value={formData.divisi}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        >
                          <option value="">Pilih Divisi</option>
                          <option value="CRSD 1">CRSD 1</option>
                          <option value="CRSD 2">CRSD 2</option>
                          <option value="Other">Lainnya...</option>
                        </select>
                      </div>

                      {/* Custom Divisi Input - Always in same column as dropdown */}
                      {formData.divisi === 'Other' && (
                        <div className="animate-fade-in">
                          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Nama Divisi Lainnya
                          </label>
                          <input
                            type="text"
                            name="divisi_custom"
                            value={formData.divisi}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                divisi: e.target.value
                              }))
                            }
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            placeholder="Masukkan nama divisi"
                          />
                        </div>
                      )}
                    </div>

                    {/* Right Column - Unit Kerja */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Unit Kerja
                      </label>
                      <input
                        type="text"
                        name="unit_kerja"
                        value={formData.unit_kerja}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        placeholder="Contoh: Jakarta, Bandung"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions - Compact */}
            <div className="rounded-b-lg border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="order-2 sm:order-1">
                  <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                    <span className="text-red-500">*</span> Field
                    wajib diisi
                  </p>
                </div>
                <div className="order-1 flex w-full flex-col gap-3 sm:order-2 sm:w-auto sm:flex-row">
                  <Link
                    href="/dashboard/user-management"
                    className="w-full"
                  >
                    <button
                      type="button"
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Batal
                    </button>
                  </Link>
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      (formData.role === 'admin' &&
                        selectedDataTypes.length === 0)
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Simpan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              {formData.role === 'admin' &&
                selectedDataTypes.length === 0 && (
                  <p className="mt-2 text-center text-xs text-red-600">
                    * Data access wajib dipilih untuk role admin
                  </p>
                )}
            </div>
          </form>
        </div>

        {/* Info Tips */}
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="mb-1 text-sm font-medium text-blue-800 dark:text-blue-300">
                Informasi Penting
              </p>
              <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400"></span>
                  <span>Password minimal 6 karakter</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400"></span>
                  <span>Email harus unik dan belum terdaftar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400"></span>
                  <span>
                    Pengguna yang dibuat akan langsung aktif
                    (terverifikasi)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400"></span>
                  <span>
                    Admin wajib memiliki data access minimal 1
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400"></span>
                  <span>
                    Data access yang tersedia: CRSD 1, CRSD 2, atau
                    All Access (keduanya)
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Click outside to close dropdown */}
      {showDataTypeDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDataTypeDropdown(false)}
        />
      )}
    </div>
  );
}
