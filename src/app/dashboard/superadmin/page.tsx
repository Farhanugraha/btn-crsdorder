'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2, LogOut, Menu, X, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const SuperAdminDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('auth_user');

      if (!token || !userData) {
        router.push('/auth/login');
        return;
      }

      const parsedUser = JSON.parse(userData);

      // Cek apakah user adalah superadmin
      if (parsedUser.role !== 'superadmin') {
        toast.error('Anda tidak memiliki akses ke halaman ini');
        router.push('/areas');
        return;
      }

      setUser(parsedUser);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('token_expires_in');
    toast.success('Logout berhasil');
    window.dispatchEvent(new Event('auth-changed'));
    router.push('/auth/login');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`border-r border-border bg-card transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {isSidebarOpen && (
            <h2 className="text-lg font-bold text-foreground">
              SuperAdmin Panel
            </h2>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-md p-2 hover:bg-muted"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        <nav className="space-y-2 p-4">
          <NavItem
            label="Dashboard"
            href="/dashboard/superadmin"
            icon="📊"
            isOpen={isSidebarOpen}
          />
          <NavItem
            label="Pengguna"
            href="/dashboard/superadmin/users"
            icon="👥"
            isOpen={isSidebarOpen}
          />
          <NavItem
            label="Area"
            href="/dashboard/superadmin/areas"
            icon="🗺️"
            isOpen={isSidebarOpen}
          />
          <NavItem
            label="Restoran"
            href="/dashboard/superadmin/restaurants"
            icon="🍽️"
            isOpen={isSidebarOpen}
          />
          <NavItem
            label="Menu"
            href="/dashboard/superadmin/menus"
            icon="📋"
            isOpen={isSidebarOpen}
          />
          <NavItem
            label="Pesanan"
            href="/dashboard/superadmin/orders"
            icon="📦"
            isOpen={isSidebarOpen}
          />
          <NavItem
            label="Pembayaran"
            href="/dashboard/superadmin/payments"
            icon="💳"
            isOpen={isSidebarOpen}
          />
          <NavItem
            label="Laporan"
            href="/dashboard/superadmin/reports"
            icon="📄"
            isOpen={isSidebarOpen}
          />
          <NavItem
            label="Pengaturan Sistem"
            href="/dashboard/superadmin/settings"
            icon="⚙️"
            isOpen={isSidebarOpen}
          />
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full"
            size="sm"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isSidebarOpen && 'Logout'}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Bar */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">
              Dashboard SuperAdmin
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user?.name}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white">
                {user?.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <div className="rounded-lg border border-border bg-card p-8">
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              Selamat datang, {user?.name}!
            </h2>
            <p className="mb-6 text-muted-foreground">
              Ini adalah dashboard superadmin Anda. Anda memiliki
              akses penuh ke semua fitur sistem termasuk manajemen
              pengguna, area, restoran, menu, pesanan, pembayaran, dan
              laporan sistem.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <StatCard
                title="Total Pengguna"
                value="1,234"
                icon="👥"
              />
              <StatCard title="Total Restoran" value="42" icon="🍽️" />
              <StatCard
                title="Total Pesanan"
                value="5,678"
                icon="📦"
              />
              <StatCard
                title="Total Pembayaran"
                value="Rp 125M"
                icon="💰"
              />
              <StatCard title="Area Aktif" value="12" icon="🗺️" />
            </div>

            {/* System Health */}
            <div className="mt-8 rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">
                    Status Sistem
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Semua layanan berjalan normal
                  </p>
                </div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

interface NavItemProps {
  label: string;
  href: string;
  icon: string;
  isOpen: boolean;
}

const NavItem = ({ label, href, icon, isOpen }: NavItemProps) => {
  return (
    <a
      href={href}
      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <span className="text-lg">{icon}</span>
      {isOpen && <span>{label}</span>}
    </a>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
}

const StatCard = ({ title, value, icon }: StatCardProps) => {
  return (
    <div className="rounded-lg border border-border bg-muted/50 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">
            {value}
          </p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
