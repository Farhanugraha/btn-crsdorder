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
  LogOut,
  User,
  Calendar,
  Shield,
  ArrowRight
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
  const userId = params.id as string;

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
        {/* Header Background */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white shadow-lg">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
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
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6">
          {/* Contact Information */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Email */}
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
              <p className="text-slate-900 dark:text-white">
                {user.phone || '-'}
              </p>
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
              <p className="text-slate-900 dark:text-white">
                {user.divisi || '-'}
              </p>
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
              <p className="text-slate-900 dark:text-white">
                {user.unit_kerja || '-'}
              </p>
            </div>
          </div>

          {/* Account Details */}
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

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
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
                onClick={() => router.push(`/user/${user.id}/admin`)}
                className="group bg-blue-600 hover:bg-blue-700"
              >
                Admin Panel
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
