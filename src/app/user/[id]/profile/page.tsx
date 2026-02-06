'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  Mail,
  Phone,
  Briefcase,
  Building2,
  User,
  Calendar,
  Shield,
  ArrowRight,
  Edit2,
  CheckCircle,
  Home,
  Package,
  BarChart3,
  Settings,
  ArrowLeft,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  phone: string;
  divisi: string;
  unit_kerja: string;
  role: string;
  created_at: string;
  updated_at: string;
}

const UserPage = () => {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const userId = params.id as string;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    divisi: '',
    unit_kerja: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('auth_user');
        const token = localStorage.getItem('auth_token');

        if (!storedUser || !token) {
          router.push('/auth/login');
          return;
        }

        const parsedUser = JSON.parse(storedUser) as User;

        // Verify user ID matches
        if (parsedUser.id !== Number(userId)) {
          toast.error('Unauthorized');
          router.push('/auth/login');
          return;
        }

        setUser(parsedUser);
        setFormData({
          name: parsedUser.name,
          phone: parsedUser.phone || '',
          divisi: parsedUser.divisi || '',
          unit_kerja: parsedUser.unit_kerja || ''
        });

        // Dispatch event to update Navbar
        window.dispatchEvent(new Event('auth-changed'));
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [userId, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: []
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        'http://localhost:8000/api/auth/profile',
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Profil berhasil diperbarui');
        toast.success('Profil berhasil diperbarui');

        // Update user state and localStorage
        const updatedUser = { ...user, ...formData } as User;
        setUser(updatedUser);
        localStorage.setItem(
          'auth_user',
          JSON.stringify(updatedUser)
        );

        window.dispatchEvent(new Event('auth-changed'));
        setIsEditing(false);

        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        if (data.errors) {
          setErrors(data.errors);
        }
        toast.error(data.message || 'Gagal memperbarui profil');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Terjadi kesalahan');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone || '',
        divisi: user.divisi || '',
        unit_kerja: user.unit_kerja || ''
      });
    }
    setIsEditing(false);
    setErrors({});
  };

  const getHomeRoute = () => {
    if (!user) return '/';

    switch (user.role) {
      case 'superadmin':
        return '/dashboard/superadmin/';
      case 'admin':
        return '/dashboard/admin/';
      default:
        return '/';
    }
  };

  if (isLoading) {
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
              Memuat Profile
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Sedang mengambil data profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
            Akses Ditolak
          </h2>
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            Anda tidak memiliki akses ke halaman ini
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === 'admin' || user.role === 'superadmin';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-6">
        {/* Success Message */}
        {successMessage && (
          <div className="animate-fade-in mb-4 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400"></div>
              <p className="text-xs font-medium text-green-700 dark:text-green-300">
                {successMessage}
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-blue-600 p-2">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    Profil Pengguna
                  </h1>
                  <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                    Kelola informasi akun Anda
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => router.push(getHomeRoute())}
                className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Kembali
              </button>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit Profil
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* User Info Card */}
          <div className="space-y-4">
            {/* Profile Card */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 text-center">
                <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h2>
                <div className="mt-1 flex items-center justify-center gap-1.5">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="text-sm capitalize text-gray-600 dark:text-gray-400">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Status Akun
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      isAdmin
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}
                  >
                    {isAdmin ? 'Administrator' : 'Pengguna'}
                  </span>
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ID Pengguna
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    #{user.id}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Bergabung
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(user.created_at).toLocaleDateString(
                      'id-ID'
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Verifikasi Email
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      user.email_verified_at
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {user.email_verified_at
                      ? '✓ Terverifikasi'
                      : 'Belum diverifikasi'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Home Button */}
            <button
              onClick={() => router.push(getHomeRoute())}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Home className="h-4 w-4" />
              Kembali ke Dashboard
            </button>
          </div>

          {/* Profile Form */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Informasi Profil
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <Calendar className="h-3.5 w-3.5" />
                Terakhir update:{' '}
                {new Date(user.updated_at).toLocaleDateString(
                  'id-ID'
                )}
              </div>
            </div>

            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nama Lengkap
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nama lengkap"
                      disabled={isSaving}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.name[0]}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 dark:border-gray-600 dark:bg-gray-700/50">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Email Field (Read Only) */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 dark:border-gray-600 dark:bg-gray-700/50">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <p className="text-sm text-gray-900 dark:text-white">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid for Phone, Division, Work Unit */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Phone */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nomor Telepon
                  </label>
                  {isEditing ? (
                    <>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="08xxxxxxxxxx"
                          disabled={isSaving}
                          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.phone[0]}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 dark:border-gray-600 dark:bg-gray-700/50">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <p className="text-sm text-gray-900 dark:text-white">
                          {user.phone || '-'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Division */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Divisi
                  </label>
                  {isEditing ? (
                    <>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <input
                          type="text"
                          name="divisi"
                          value={formData.divisi}
                          onChange={handleInputChange}
                          placeholder="Divisi"
                          disabled={isSaving}
                          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        />
                      </div>
                      {errors.divisi && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.divisi[0]}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 dark:border-gray-600 dark:bg-gray-700/50">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <p className="text-sm text-gray-900 dark:text-white">
                          {user.divisi || '-'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Work Unit */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Unit Kerja
                  </label>
                  {isEditing ? (
                    <>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <input
                          type="text"
                          name="unit_kerja"
                          value={formData.unit_kerja}
                          onChange={handleInputChange}
                          placeholder="Unit Kerja"
                          disabled={isSaving}
                          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        />
                      </div>
                      {errors.unit_kerja && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.unit_kerja[0]}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 dark:border-gray-600 dark:bg-gray-700/50">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <p className="text-sm text-gray-900 dark:text-white">
                          {user.unit_kerja || '-'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="mt-6 flex gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <X className="h-4 w-4" />
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? (
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
