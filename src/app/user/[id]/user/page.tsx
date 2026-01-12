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
  CheckCircle
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
            Unauthorized
          </h2>
          <p className="mb-6 text-slate-600 dark:text-slate-400">
            Anda tidak memiliki akses ke halaman ini
          </p>
          <Button
            onClick={() => router.push('/auth/login')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Kembali ke Login
          </Button>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === 'admin' || user.role === 'superadmin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/30 dark:bg-emerald-900/20">
            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm text-emerald-800 dark:text-emerald-300">
              {successMessage}
            </p>
          </div>
        )}

        {/* Header Background */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white shadow-lg">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <User className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">{user.name}</h1>
                <p className="mt-1 flex items-center gap-2 text-blue-100">
                  <Shield className="h-4 w-4" />
                  {isAdmin ? 'Administrator' : 'Regular User'}
                </p>
              </div>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="gap-2 bg-white text-blue-600 hover:bg-blue-50"
              >
                <Edit2 className="h-4 w-4" />
                Edit Profil
              </Button>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6">
          {/* Contact Information */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Email - Read Only */}
            <div className="group rounded-2xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm transition-all hover:border-blue-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/80">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Email
                </h3>
              </div>
              <p className="mb-3 text-slate-900 dark:text-white">
                {user.email}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user.email_verified_at
                  ? `✓ Terverifikasi pada ${new Date(
                      user.email_verified_at
                    ).toLocaleDateString('id-ID')}`
                  : '⚠ Belum terverifikasi'}
              </p>
            </div>

            {/* Phone */}
            <div className="group rounded-2xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm transition-all hover:border-blue-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/80">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                  <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Nomor Telepon
                </h3>
              </div>
              {isEditing ? (
                <>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="08xxxxxxxxxx"
                    disabled={isSaving}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900/50 dark:text-white"
                  />
                  {errors.phone && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.phone[0]}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-slate-900 dark:text-white">
                  {user.phone || '-'}
                </p>
              )}
            </div>

            {/* Division */}
            <div className="group rounded-2xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm transition-all hover:border-blue-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/80">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
                  <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Divisi
                </h3>
              </div>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="divisi"
                    value={formData.divisi}
                    onChange={handleInputChange}
                    placeholder="Divisi"
                    disabled={isSaving}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900/50 dark:text-white"
                  />
                  {errors.divisi && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.divisi[0]}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-slate-900 dark:text-white">
                  {user.divisi || '-'}
                </p>
              )}
            </div>

            {/* Work Unit */}
            <div className="group rounded-2xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm transition-all hover:border-blue-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/80">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900/30">
                  <Building2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Unit Kerja
                </h3>
              </div>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="unit_kerja"
                    value={formData.unit_kerja}
                    onChange={handleInputChange}
                    placeholder="Unit Kerja"
                    disabled={isSaving}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900/50 dark:text-white"
                  />
                  {errors.unit_kerja && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.unit_kerja[0]}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-slate-900 dark:text-white">
                  {user.unit_kerja || '-'}
                </p>
              )}
            </div>
          </div>

          {/* Name - Full Width */}
          {isEditing && (
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
              <label className="mb-4 block text-lg font-bold text-slate-900 dark:text-white">
                Nama <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nama lengkap"
                disabled={isSaving}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900/50 dark:text-white"
              />
              {errors.name && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.name[0]}
                </p>
              )}
            </div>
          )}

          {/* Account Details */}
          {!isEditing && (
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-8 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
                <Calendar className="h-6 w-6 text-blue-600" />
                Informasi Akun
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">
                    <span className="text-slate-600 dark:text-slate-400">
                      ID
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {user.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">
                    <span className="text-slate-600 dark:text-slate-400">
                      Role
                    </span>
                    <span className="inline-block rounded-full bg-blue-100 px-4 py-1 font-semibold capitalize text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {user.role}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">
                    <span className="text-slate-600 dark:text-slate-400">
                      Dibuat
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {new Date(user.created_at).toLocaleDateString(
                        'id-ID'
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">
                    <span className="text-slate-600 dark:text-slate-400">
                      Diperbarui
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {new Date(user.updated_at).toLocaleDateString(
                        'id-ID'
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="border-slate-300 hover:border-slate-400 dark:border-slate-600"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      Simpan Perubahan
                      <CheckCircle className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="group border-slate-300 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  Kembali ke Home
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                {isAdmin && (
                  <Button
                    onClick={() =>
                      router.push(`/user/${user.id}/admin`)
                    }
                    className="group bg-blue-600 hover:bg-blue-700"
                  >
                    Admin Panel
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
