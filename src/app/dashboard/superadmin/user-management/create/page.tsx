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
  CheckCircle
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
}

export default function CreateUserPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    role: 'user',
    divisi: '',
    unit_kerja: ''
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        phone: formData.phone || null,
        role: formData.role,
        divisi: formData.divisi || null,
        unit_kerja: formData.unit_kerja || null
      };

      console.log('Sending payload:', payload);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
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
        unit_kerja: ''
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/superadmin/user-management');
      }, 2000);

    } catch (err) {
      console.error('Create user error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat pengguna';
      setError(errorMsg);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/superadmin/user-management">
                <button className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-blue-900 dark:text-white">
                  Tambah Pengguna Baru
                </h1>
                <p className="text-sm mt-1 text-blue-600 dark:text-slate-400">Buat akun pengguna baru untuk sistem</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {successMessage && (
          <div className="mb-6 animate-fade-in">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div className="flex-1">
                <p className="text-emerald-700 dark:text-emerald-300 font-medium">{successMessage}</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">Mengalihkan ke daftar pengguna...</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 animate-fade-in">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <div className="space-y-6">
                {/* Informasi Dasar */}
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                    <User className="w-5 h-5 inline mr-2 text-blue-600 dark:text-blue-400" />
                    Informasi Dasar
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="contoh@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+62 812 3456 7890"
                      />
                    </div>
                  </div>
                </div>

                {/* Keamanan */}
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                    <Shield className="w-5 h-5 inline mr-2 text-blue-600 dark:text-blue-400" />
                    Keamanan & Role
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Minimal 6 karakter"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Konfirmasi Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ulangi password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Role <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="user">Pengguna</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                    </div>
                  </div>
                </div>

                   {/* Organisasi */}
<div>
  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
    <Building className="w-5 h-5 inline mr-2 text-blue-600 dark:text-blue-400" />
    Informasi Organisasi
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Left Column - Divisi Section */}
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Divisi
        </label>
        <select
          name="divisi"
          value={formData.divisi}
          onChange={handleInputChange}
          className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Nama Divisi Lainnya
          </label>
          <input
            type="text"
            name="divisi_custom"
            value={formData.divisi}
            onChange={(e) => setFormData(prev => ({ ...prev, divisi: e.target.value }))}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan nama divisi"
          />
        </div>
      )}
    </div>
    
    {/* Right Column - Unit Kerja */}
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Unit Kerja
      </label>
      <input
        type="text"
        name="unit_kerja"
        value={formData.unit_kerja}
        onChange={handleInputChange}
        className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Contoh: Jakarta, Bandung"
      />
    </div>
  </div>
</div>
              </div>
            </div>

                    {/* Form Actions - Compact */}
            <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-b-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="order-2 sm:order-1">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    <span className="text-red-500">*</span> Field wajib diisi
                </p>
                </div>
                <div className="order-1 sm:order-2 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link href="/superadmin/user-management" className="w-full">
                    <button
                    type="button"
                    className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
                    >
                    Batal
                    </button>
                </Link>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                    {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Menyimpan...</span>
                    </>
                    ) : (
                    <>
                        <Save className="w-4 h-4" />
                        <span>Simpan</span>
                    </>
                    )}
                </button>
                </div>
            </div>
            </div>
                    </form>
                    </div>

        {/* Info Tips */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Informasi Penting</p>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>Password minimal 6 karakter</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>Email harus unik dan belum terdaftar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>Pengguna yang dibuat akan langsung aktif (terverifikasi)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}