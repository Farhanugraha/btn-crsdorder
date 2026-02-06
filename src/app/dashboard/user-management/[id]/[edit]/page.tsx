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
  EyeOff,
  CheckSquare,
  Square,
  Globe
} from 'lucide-react';

interface UserDetail {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'user' | 'admin' | 'superadmin';
  divisi: string | null;
  unit_kerja: string | null;
  data_access: string | null; // JSON string for admin divisi access
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
  data_access?: string; // For admin divisi access
}

interface DivisionOption {
  code: string;
  name: string;
  description: string;
  isAllOption?: boolean;
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

  const [selectedDivisions, setSelectedDivisions] = useState<
    string[]
  >([]);
  const [showDivisionSelector, setShowDivisionSelector] =
    useState(false);

  const [passwordData, setPasswordData] = useState({
    password: '',
    password_confirmation: ''
  });

  // Divisi options - hanya CRSD1, CRSD2, dan Semua
  const divisionOptions: DivisionOption[] = [
    {
      code: 'all',
      name: 'Semua Divisi',
      description: 'Admin dapat mengakses semua divisi CRSD',
      isAllOption: true
    },
    {
      code: 'crsd1',
      name: 'CRSD 1',
      description:
        'Consumer Collection, Recovery and Asset Sales Division 1'
    },
    {
      code: 'crsd2',
      name: 'CRSD 2',
      description:
        'Consumer Collection, Recovery and Asset Sales Division 2'
    }
  ];

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

  // Helper function untuk mengubah data_access menjadi selected divisions
  const parseDataAccessToSelectedDivisions = (
    dataAccess: any // Bisa string, array, atau null
  ): string[] => {
    if (!dataAccess) return [];

    console.log(
      'Parsing data_access:',
      dataAccess,
      'Type:',
      typeof dataAccess
    );

    // Jika sudah array, langsung proses
    if (Array.isArray(dataAccess)) {
      // Filter hanya crsd1 dan crsd2
      const validCodes = dataAccess.filter(
        (code: string) => code === 'crsd1' || code === 'crsd2'
      );

      // Tambahkan 'all' jika ada crsd1 dan crsd2
      if (
        validCodes.includes('crsd1') &&
        validCodes.includes('crsd2')
      ) {
        return ['all', ...validCodes];
      }

      return validCodes;
    }

    // Jika string, coba parse sebagai JSON
    if (typeof dataAccess === 'string') {
      try {
        // Coba parse JSON
        const parsed = JSON.parse(dataAccess);

        if (Array.isArray(parsed)) {
          // Filter hanya crsd1 dan crsd2
          const validCodes = parsed.filter(
            (code: string) => code === 'crsd1' || code === 'crsd2'
          );

          // Tambahkan 'all' jika ada crsd1 dan crsd2
          if (
            validCodes.includes('crsd1') &&
            validCodes.includes('crsd2')
          ) {
            return ['all', ...validCodes];
          }

          return validCodes;
        }
      } catch (error) {
        console.error('Error parsing data_access as JSON:', error);

        // Jika bukan JSON, coba cek apakah string langsung berisi crsd1 atau crsd2
        if (
          dataAccess.includes('crsd1') ||
          dataAccess.includes('crsd2')
        ) {
          const codes = [];
          if (dataAccess.includes('crsd1')) codes.push('crsd1');
          if (dataAccess.includes('crsd2')) codes.push('crsd2');

          if (codes.includes('crsd1') && codes.includes('crsd2')) {
            return ['all', ...codes];
          }

          return codes;
        }
      }
    }

    return [];
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

  useEffect(() => {
    // Show/hide division selector based on role
    setShowDivisionSelector(formData.role === 'admin');

    // If role is not admin, clear selected divisions
    if (formData.role !== 'admin') {
      setSelectedDivisions([]);
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

      // Parse and set selected divisions from data_access
      if (userData.data_access) {
        const divisions = parseDataAccessToSelectedDivisions(
          userData.data_access
        );
        setSelectedDivisions(divisions);
        console.log(
          'Loaded divisions:',
          divisions,
          'from data_access:',
          userData.data_access
        );
      } else {
        setSelectedDivisions([]);
      }
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
    const newFormData = {
      ...formData,
      [name]: value
    };

    setFormData(newFormData);

    // Jika role berubah dari admin ke non-admin, clear selected divisions
    if (name === 'role' && value !== 'admin') {
      setSelectedDivisions([]);
    }

    // Jika role berubah ke admin dan user sudah ada data_access, load ulang divisions
    if (name === 'role' && value === 'admin' && user?.data_access) {
      const divisions = parseDataAccessToSelectedDivisions(
        user.data_access
      );
      setSelectedDivisions(divisions);
    }
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

  const handleDivisionToggle = (
    divisionCode: string,
    isAllOption: boolean = false
  ) => {
    setSelectedDivisions((prev) => {
      // Jika memilih "Semua Divisi"
      if (divisionCode === 'all') {
        if (prev.includes('all')) {
          // Jika sudah dipilih, hapus semua
          return [];
        } else {
          // Jika belum dipilih, pilih semua (crsd1 dan crsd2)
          return ['all', 'crsd1', 'crsd2'];
        }
      }

      // Jika memilih crsd1 atau crsd2
      if (prev.includes(divisionCode)) {
        // Hapus divisi yang dipilih
        const newSelection = prev.filter(
          (code) => code !== divisionCode
        );

        // Jika sudah tidak ada crsd1 dan crsd2, hapus juga 'all' jika ada
        if (
          !newSelection.includes('crsd1') &&
          !newSelection.includes('crsd2') &&
          newSelection.includes('all')
        ) {
          return newSelection.filter((code) => code !== 'all');
        }

        return newSelection;
      } else {
        // Tambahkan divisi yang dipilih
        const newSelection = [...prev, divisionCode];

        // Jika sudah memilih crsd1 dan crsd2, tambahkan juga 'all'
        if (
          (divisionCode === 'crsd1' &&
            newSelection.includes('crsd2')) ||
          (divisionCode === 'crsd2' && newSelection.includes('crsd1'))
        ) {
          if (!newSelection.includes('all')) {
            newSelection.push('all');
          }
        }

        return newSelection;
      }
    });
  };

  const handleSelectAllDivisions = () => {
    // Pilih semua (crsd1, crsd2, dan all)
    setSelectedDivisions(['all', 'crsd1', 'crsd2']);
  };

  const handleClearAllDivisions = () => {
    setSelectedDivisions([]);
  };

  const getDisplayDivisions = () => {
    if (selectedDivisions.includes('all')) {
      return ['Semua Divisi (CRSD 1 & CRSD 2)'];
    }

    return selectedDivisions.map((code) => {
      const division = divisionOptions.find((d) => d.code === code);
      return division?.name || code;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email) {
      setError('Nama dan email wajib diisi');
      return;
    }

    // Additional validation for admin role
    if (formData.role === 'admin' && selectedDivisions.length === 0) {
      setError(
        'Admin harus memiliki setidaknya satu divisi yang dapat diakses'
      );
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

      // Prepare payload - PERBAIKAN: Gunakan trim untuk semua string
      const payload: any = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role
      };

      // Tambahkan optional fields hanya jika ada nilai
      if (formData.phone && formData.phone.trim()) {
        payload.phone = formData.phone.trim();
      }

      if (formData.divisi && formData.divisi.trim()) {
        payload.divisi = formData.divisi.trim();
      }

      if (formData.unit_kerja && formData.unit_kerja.trim()) {
        payload.unit_kerja = formData.unit_kerja.trim();
      }

      // Handle data_access for admin role
      if (formData.role === 'admin') {
        // Simpan semua code yang dipilih kecuali 'all' untuk kemudahan parsing
        const accessCodes = selectedDivisions.filter(
          (code) => code !== 'all'
        );

        if (accessCodes.length > 0) {
          payload.data_access = JSON.stringify(accessCodes);
        } else {
          payload.data_access = '[]'; // Empty array JSON string
        }
      } else {
        // Untuk non-admin, kirim string kosong
        payload.data_access = '';
      }

      console.log('Payload yang dikirim:', payload);

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
      console.log('Response:', data);

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors)
            .flat()
            .join(', ');
          throw new Error(`Validasi gagal: ${errorMessages}`);
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

      // Reset selected divisions menggunakan helper function yang sama
      const divisions = parseDataAccessToSelectedDivisions(
        user.data_access
      );
      setSelectedDivisions(divisions);
    }
    setError(null);
    setSuccessMessage(null);
  };

  // Rest of the component remains the same until the return statement...

  if (!mounted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="h-8 w-8 animate-pulse text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Memuat Detail Pengguna
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Sedang mengambil data ...
            </p>
          </div>
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

                  {/* Divisi Selection for Admin */}
                  {showDivisionSelector && (
                    <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                              Akses Divisi CRSD *
                            </label>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              Pilih divisi yang dapat diakses oleh
                              admin ini
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleSelectAllDivisions}
                              className="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              Pilih Semua
                            </button>
                            <span className="text-slate-300 dark:text-slate-600">
                              |
                            </span>
                            <button
                              type="button"
                              onClick={handleClearAllDivisions}
                              className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                            >
                              Hapus Semua
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {divisionOptions.map((division) => {
                          const isSelected =
                            selectedDivisions.includes(division.code);
                          return (
                            <div
                              key={division.code}
                              className={`relative flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-all duration-200 ${
                                isSelected
                                  ? division.isAllOption
                                    ? 'border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/20'
                                    : 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 dark:hover:bg-slate-700/50'
                              }`}
                              onClick={() =>
                                handleDivisionToggle(
                                  division.code,
                                  division.isAllOption
                                )
                              }
                            >
                              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center">
                                {isSelected ? (
                                  <CheckSquare
                                    className={`h-5 w-5 ${
                                      division.isAllOption
                                        ? 'text-purple-600 dark:text-purple-400'
                                        : 'text-blue-600 dark:text-blue-400'
                                    }`}
                                  />
                                ) : (
                                  <Square className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <label
                                      htmlFor={`division-${division.code}`}
                                      className="block text-sm font-medium text-slate-900 dark:text-white"
                                    >
                                      {division.name}
                                    </label>
                                    {division.isAllOption && (
                                      <span className="inline-flex items-center gap-1 rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                                        <Globe className="h-3 w-3" />
                                        Semua
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                  {division.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Selected divisions summary */}
                      {selectedDivisions.length > 0 && (
                        <div
                          className={`mt-4 rounded-lg p-3 ${
                            selectedDivisions.includes('all')
                              ? 'bg-purple-50 dark:bg-purple-900/20'
                              : 'bg-emerald-50 dark:bg-emerald-900/20'
                          }`}
                        >
                          <div className="flex items-center">
                            <CheckCircle
                              className={`mr-2 h-4 w-4 ${
                                selectedDivisions.includes('all')
                                  ? 'text-purple-600 dark:text-purple-400'
                                  : 'text-emerald-600 dark:text-emerald-400'
                              }`}
                            />
                            <span
                              className={`text-sm font-medium ${
                                selectedDivisions.includes('all')
                                  ? 'text-purple-800 dark:text-purple-300'
                                  : 'text-emerald-800 dark:text-emerald-300'
                              }`}
                            >
                              {selectedDivisions.includes('all')
                                ? 'Admin dapat mengakses Semua Divisi CRSD (CRSD 1 & CRSD 2)'
                                : `Admin dapat mengakses: ${getDisplayDivisions().join(
                                    ', '
                                  )}`}
                            </span>
                          </div>
                        </div>
                      )}

                      {selectedDivisions.length === 0 && (
                        <div className="mt-4 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                          <div className="flex items-center">
                            <AlertTriangle className="mr-2 h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
                              Pilih setidaknya satu divisi untuk admin
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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

                  {/* Show divisi access if admin */}
                  {user.role === 'admin' && (
                    <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Akses Divisi CRSD
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            selectedDivisions.includes('all')
                              ? 'text-purple-600 dark:text-purple-400'
                              : 'text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {selectedDivisions.includes('all')
                            ? 'Semua Divisi'
                            : `${selectedDivisions.length} divisi`}
                        </span>
                      </div>
                      {selectedDivisions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {selectedDivisions.includes('all') ? (
                            <span className="rounded-full bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1 text-xs font-medium text-purple-800 dark:from-purple-900/40 dark:to-blue-900/40 dark:text-purple-300">
                              Semua Divisi CRSD
                            </span>
                          ) : (
                            selectedDivisions
                              .map((code) => {
                                const division = divisionOptions.find(
                                  (d) => d.code === code
                                );
                                if (!division) return null;

                                return (
                                  <span
                                    key={code}
                                    className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                  >
                                    {division.name}
                                  </span>
                                );
                              })
                              .filter(Boolean)
                          )}
                        </div>
                      )}
                      {user.data_access && (
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                          Data saat ini: {user.data_access}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
