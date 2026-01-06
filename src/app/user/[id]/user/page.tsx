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
  LogOut
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

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch(
        'http://localhost:8000/api/auth/logout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('token_expires_in');
        toast.success('Logout berhasil');
        router.push('/');
      } else {
        toast.error(data.message || 'Logout gagal');
      }
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token_expires_in');
      toast.error('Terjadi kesalahan saat logout');
      router.push('/');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
          <h2 className="mb-2 text-xl font-bold">Unauthorized</h2>
          <p className="mb-6 text-muted-foreground">
            Anda tidak memiliki akses ke halaman ini
          </p>
          <Button
            onClick={() => router.push('/auth/login')}
            className="w-full"
          >
            Kembali ke Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6">
        {/* Profile Card */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="mt-1 text-muted-foreground">
                {user.role === 'admin' || user.role === 'superadmin'
                  ? 'Administrator'
                  : 'User'}
              </p>
            </div>
            {/* <Button
              variant="destructive"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button> */}
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Email Card */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Mail className="h-5 w-5" />
              Email
            </h3>
            <p className="text-foreground">{user.email}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {user.email_verified_at
                ? `Terverifikasi pada ${new Date(
                    user.email_verified_at
                  ).toLocaleDateString('id-ID')}`
                : 'Belum terverifikasi'}
            </p>
          </div>

          {/* Phone Card */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Phone className="h-5 w-5" />
              Nomor Telepon
            </h3>
            <p className="text-foreground">{user.phone || '-'}</p>
          </div>

          {/* Divisi Card */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Briefcase className="h-5 w-5" />
              Divisi
            </h3>
            <p className="text-foreground">{user.divisi || '-'}</p>
          </div>

          {/* Unit Kerja Card */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Building2 className="h-5 w-5" />
              Unit Kerja
            </h3>
            <p className="text-foreground">
              {user.unit_kerja || '-'}
            </p>
          </div>
        </div>

        {/* Account Info */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-bold">Informasi Akun</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID:</span>
              <span className="font-medium">{user.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role:</span>
              <span className="font-medium capitalize">
                {user.role}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Dibuat pada:
              </span>
              <span className="font-medium">
                {new Date(user.created_at).toLocaleDateString(
                  'id-ID'
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Diperbarui:
              </span>
              <span className="font-medium">
                {new Date(user.updated_at).toLocaleDateString(
                  'id-ID'
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.push('/')}>
            Kembali ke Home
          </Button>
          {(user.role === 'admin' || user.role === 'superadmin') && (
            <Button
              onClick={() => router.push(`/user/${user.id}/admin`)}
            >
              Buka Admin Panel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
