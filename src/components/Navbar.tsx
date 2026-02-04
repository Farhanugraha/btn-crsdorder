'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ToggleTheme } from '@/components/ToggleTheme';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger
} from '@/components/ui/menubar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  LogOut,
  Menu,
  Loader2,
  User as UserIcon,
  AlertCircle,
  BarChart3,
  ShoppingCart,
  CreditCard,
  Users,
  FileText,
  MapPin,
  UtensilsCrossed,
  UserPlus,
  Settings,
  Hourglass,
  Home,
  Package,
  DollarSign,
  PieChart,
  Shield,
  ChefHat,
  Mail,
  Phone,
  HelpCircle,
  Info,
  Bell,
  ChevronDown,
  LayoutDashboard,
  BadgeCheck,
  X
} from 'lucide-react';
import logo from '../../public/logobtn.png';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import Cart from './Cart';

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

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [latestOrderId, setLatestOrderId] = useState<number | null>(
    null
  );
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [showNoPaymentDialog, setShowNoPaymentDialog] =
    useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check role authorization
  const isAdmin =
    user && (user.role === 'admin' || user.role === 'superadmin');
  const isSuperAdmin = user && user.role === 'superadmin';

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Helper untuk get dashboard link
  const getDashboardLink = () => {
    if (isSuperAdmin) return '/dashboard/superadmin';
    if (user?.role === 'admin') return '/dashboard/admin';
    return '/';
  };

  // Helper untuk get admin/superadmin routes
  const getAdminOrdersLink = () =>
    isSuperAdmin ? '/dashboard/orders' : '/dashboard/orders';

  const getAdminPaymentsLink = () =>
    isSuperAdmin ? '/dashboard/payments' : '/dashboard/payments';

  const getAdminStatisticsLink = () =>
    isSuperAdmin ? '/dashboard/statistics' : '/dashboard/statistics';

  const getAdminReportsLink = () =>
    isSuperAdmin ? '/dashboard/reports' : '/dashboard/reports';

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('auth_user');
        const token = localStorage.getItem('auth_token');

        const expiresIn = localStorage.getItem('token_expires_in');
        if (expiresIn && Date.now() > Number(expiresIn)) {
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('token_expires_in');
          setUser(null);
          setIsLoading(false);
          return;
        }

        if (storedUser && token) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('token_expires_in');
        setUser(null);
        setIsLoading(false);
      }
    };

    checkAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === 'auth_user' ||
        e.key === 'auth_token' ||
        e.key === null
      ) {
        checkAuth();
      }
    };

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-changed', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-changed', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    if (user && !isAdmin) {
      fetchLatestOrder();

      const interval = setInterval(() => {
        fetchLatestOrder();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    const handlePaymentSuccess = () => {
      console.log('Payment success event received');
      if (!isAdmin) {
        fetchLatestOrder();
      }
    };

    window.addEventListener('payment-success', handlePaymentSuccess);

    return () => {
      window.removeEventListener(
        'payment-success',
        handlePaymentSuccess
      );
    };
  }, [isAdmin]);

  const fetchLatestOrder = async () => {
    try {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        setLatestOrderId(null);
        return;
      }

      const response = await fetch(`${apiUrl}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success && data.data && data.data.length > 0) {
        const pendingOrder = data.data.find(
          (order: any) => order.status === 'pending'
        );

        setLatestOrderId(pendingOrder ? pendingOrder.id : null);
      } else {
        setLatestOrderId(null);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLatestOrderId(null);
    }
  };

  const handlePaymentClick = async (e: React.MouseEvent) => {
    if (!latestOrderId) {
      e.preventDefault();

      try {
        const token = localStorage.getItem('auth_token');

        if (token) {
          const response = await fetch(`${apiUrl}/api/orders`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          });

          const data = await response.json();
          if (data.success && data.data && data.data.length > 0) {
            const pendingOrder = data.data.find(
              (order: any) => order.status === 'pending'
            );

            if (pendingOrder) {
              setLatestOrderId(pendingOrder.id);
              router.push(`/checkout/${pendingOrder.id}`);
              return;
            }
          }
        }
      } catch (error) {
        console.error('Error refetching orders:', error);
      }

      setShowNoPaymentDialog(true);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('token_expires_in');
        setUser(null);

        window.dispatchEvent(new Event('logout'));

        toast.success('Logout berhasil');
        router.push('/');
        setShowLogoutDialog(false);
        return;
      }

      try {
        await fetch(`${apiUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
      } catch (apiError) {
        console.error('Logout API error:', apiError);
      }

      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token_expires_in');
      setUser(null);

      window.dispatchEvent(new Event('logout'));

      toast.success('Logout berhasil');
      router.push('/');
      setShowLogoutDialog(false);
    } catch (error) {
      console.error('Logout error:', error);

      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token_expires_in');
      setUser(null);

      window.dispatchEvent(new Event('logout'));

      toast.success('Logout berhasil');
      router.push('/');
      setShowLogoutDialog(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get role badge color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50';
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <Link
                href={getDashboardLink()}
                className="flex items-center gap-3 transition-opacity hover:opacity-90"
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-1.5">
                  <Image
                    src={logo}
                    alt="CRSD OBAMA"
                    width={40}
                    height={40}
                    placeholder="blur"
                    priority
                    className="h-full w-full object-contain"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Menu */}
            <div className="hidden items-center gap-1 md:flex">
              <Link
                href={getDashboardLink()}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary'
                )}
              >
                <Home className="h-4 w-4" />
                {isAdmin ? 'Dashboard' : 'Beranda'}
              </Link>

              {/* Admin Navigation Menu */}
              {isAdmin && (
                <>
                  <Link
                    href={getAdminOrdersLink()}
                    className={cn(
                      buttonVariants({
                        variant: 'ghost',
                        size: 'sm'
                      }),
                      'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary'
                    )}
                  >
                    <Hourglass className="h-4 w-4" />
                    Pesanan
                  </Link>
                  <Link
                    href={getAdminPaymentsLink()}
                    className={cn(
                      buttonVariants({
                        variant: 'ghost',
                        size: 'sm'
                      }),
                      'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary'
                    )}
                  >
                    <CreditCard className="h-4 w-4" />
                    Pembayaran
                  </Link>
                  <Link
                    href={getAdminStatisticsLink()}
                    className={cn(
                      buttonVariants({
                        variant: 'ghost',
                        size: 'sm'
                      }),
                      'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary'
                    )}
                  >
                    <PieChart className="h-4 w-4" />
                    Statistik
                  </Link>
                  <Link
                    href={getAdminReportsLink()}
                    className={cn(
                      buttonVariants({
                        variant: 'ghost',
                        size: 'sm'
                      }),
                      'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary'
                    )}
                  >
                    <FileText className="h-4 w-4" />
                    Laporan
                  </Link>

                  {/* Superadmin Exclusive Menu */}
                  {isSuperAdmin && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="group flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary">
                          <Shield className="h-4 w-4" />
                          Superadmin
                          <ChevronDown className="h-3 w-3 opacity-50 transition-transform group-hover:rotate-180" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="center"
                        className="w-48"
                      >
                        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                          Menu Superadmin
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            href="/dashboard/user-management"
                            className="flex cursor-pointer items-center gap-2"
                          >
                            <Users className="h-4 w-4" />
                            Manajemen User
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/dashboard/areas"
                            className="flex cursor-pointer items-center gap-2"
                          >
                            <MapPin className="h-4 w-4" />
                            Area
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/dashboard/restaurants"
                            className="flex cursor-pointer items-center gap-2"
                          >
                            <ChefHat className="h-4 w-4" />
                            Restaurant
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </>
              )}

              {/* User Navigation Menu - Tampilkan untuk SEMUA user (login atau belum) */}
              {!isAdmin && (
                <>
                  <Link
                    href="/areas"
                    className={cn(
                      buttonVariants({
                        variant: 'ghost',
                        size: 'sm'
                      }),
                      'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary'
                    )}
                  >
                    <UtensilsCrossed className="h-4 w-4" />
                    Pesan Makanan
                  </Link>

                  {/* Pesanan Saya - HANYA tampilkan jika user sudah login */}
                  {user && (
                    <Link
                      href="/order"
                      className={cn(
                        buttonVariants({
                          variant: 'ghost',
                          size: 'sm'
                        }),
                        'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary'
                      )}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Pesanan Saya
                    </Link>
                  )}

                  {/* Pembayaran - HANYA tampilkan jika user sudah login */}
                  {user && (
                    <Link
                      href={
                        latestOrderId
                          ? `/checkout/${latestOrderId}`
                          : '#'
                      }
                      onClick={handlePaymentClick}
                      className={cn(
                        buttonVariants({
                          variant: latestOrderId
                            ? 'default'
                            : 'ghost',
                          size: 'sm'
                        }),
                        'group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                        latestOrderId &&
                          'bg-emerald-600 hover:bg-emerald-700'
                      )}
                    >
                      <CreditCard className="h-4 w-4" />
                      Pembayaran
                      {latestOrderId && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                          !
                        </span>
                      )}
                    </Link>
                  )}

                  {/* Lainnya - Tampilkan untuk SEMUA user (login atau belum) */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="group flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary">
                        Lainnya
                        <ChevronDown className="h-3 w-3 opacity-50 transition-transform group-hover:rotate-180" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="center"
                      className="w-48"
                    >
                      <DropdownMenuItem asChild>
                        <Link
                          href="/contact"
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <Mail className="h-4 w-4" />
                          Contact
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/support"
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <HelpCircle className="h-4 w-4" />
                          Support
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/about"
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <Info className="h-4 w-4" />
                          About
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>

            {/* Right Side - User Actions & Theme */}
            <div className="flex items-center gap-2">
              {/* Notifications Bell - Hanya tampilkan jika user login */}
              {user && (
                <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  <Bell className="h-5 w-5" />
                  {notificationsCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      {notificationsCount > 9
                        ? '9+'
                        : notificationsCount}
                    </span>
                  )}
                </button>
              )}

              {/* Cart - Hanya untuk non-admin users yang sudah login */}
              {user && !isAdmin && (
                <>
                  <Separator orientation="vertical" className="h-6" />
                  <Cart />
                </>
              )}

              {/* Theme Toggle */}
              <ToggleTheme />

              {/* User Profile / Auth */}
              {isLoading ? (
                <div className="h-9 w-20 animate-pulse rounded-lg bg-muted" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="group hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium transition-all hover:bg-accent md:flex">
                      <div className="relative">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                          <UserIcon className="h-4 w-4 text-primary" />
                        </div>
                        {user.email_verified_at && (
                          <BadgeCheck className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-background text-emerald-500" />
                        )}
                      </div>
                      <div className="hidden max-w-[120px] truncate text-left sm:block">
                        <div className="truncate font-medium text-foreground">
                          {user.name}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                      <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform group-hover:rotate-180" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <div className="px-3 py-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                          <UserIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="truncate font-semibold text-foreground">
                            {user.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span
                              className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getRoleColor(
                                user.role
                              )}`}
                            >
                              {user.role === 'superadmin'
                                ? 'Super Admin'
                                : user.role === 'admin'
                                  ? 'Administrator'
                                  : 'User'}
                            </span>
                            {user.divisi && (
                              <span className="truncate rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                {user.divisi}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />

                    {/* Profile Link */}
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/user/${user.id}/profile`}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <UserIcon className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* Admin Links */}
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                          Menu Admin
                        </DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link
                            href={getAdminReportsLink()}
                            className="flex cursor-pointer items-center gap-2"
                          >
                            <FileText className="h-4 w-4" />
                            Laporan
                          </Link>
                        </DropdownMenuItem>

                        {/* Superadmin Exclusive */}
                        {isSuperAdmin && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                              Menu Superadmin
                            </DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link
                                href="/dashboard/user-management"
                                className="flex cursor-pointer items-center gap-2"
                              >
                                <Users className="h-4 w-4" />
                                Manajemen User
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href="/dashboard/areas"
                                className="flex cursor-pointer items-center gap-2"
                              >
                                <MapPin className="h-4 w-4" />
                                Area
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href="/dashboard/restaurants"
                                className="flex cursor-pointer items-center gap-2"
                              >
                                <ChefHat className="h-4 w-4" />
                                Restaurant
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setShowLogoutDialog(true)}
                      disabled={isLoggingOut}
                      className="flex cursor-pointer items-center gap-2 text-red-600 focus:bg-red-50 focus:text-red-600 dark:text-red-500 dark:focus:bg-red-950 dark:focus:text-red-500"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>
                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden items-center gap-2 md:flex">
                  <Link
                    href="/auth/login"
                    className={cn(
                      buttonVariants({
                        variant: 'outline',
                        size: 'sm'
                      }),
                      'h-9 text-sm'
                    )}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className={cn(
                      buttonVariants({
                        variant: 'default',
                        size: 'sm'
                      }),
                      'h-9 bg-gradient-to-r from-primary to-primary/80 text-sm hover:from-primary/90 hover:to-primary/70'
                    )}
                  >
                    Daftar
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden ${
            mobileMenuOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="border-t border-border/50 bg-background px-4 py-4">
            <div className="space-y-1">
              <Link
                href={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Home className="h-4 w-4" />
                {isAdmin ? 'Dashboard' : 'Beranda'}
              </Link>

              {isAdmin ? (
                <>
                  <Link
                    href={getAdminOrdersLink()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Hourglass className="h-4 w-4" />
                    Pesanan
                  </Link>
                  <Link
                    href={getAdminPaymentsLink()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <CreditCard className="h-4 w-4" />
                    Pembayaran
                  </Link>
                  <Link
                    href={getAdminStatisticsLink()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <PieChart className="h-4 w-4" />
                    Statistik
                  </Link>
                  <Link
                    href={getAdminReportsLink()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <FileText className="h-4 w-4" />
                    Laporan
                  </Link>

                  {isSuperAdmin && (
                    <>
                      <div className="px-3 pt-2 text-xs font-semibold text-muted-foreground">
                        Menu Superadmin
                      </div>
                      <Link
                        href="/dashboard/user-management"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <Users className="h-4 w-4" />
                        Manajemen User
                      </Link>
                      <Link
                        href="/dashboard/areas"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <MapPin className="h-4 w-4" />
                        Area
                      </Link>
                      <Link
                        href="/dashboard/restaurants"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <ChefHat className="h-4 w-4" />
                        Restaurant
                      </Link>
                    </>
                  )}
                </>
              ) : (
                // Menu untuk user biasa (baik login maupun belum)
                <>
                  <Link
                    href="/areas"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <UtensilsCrossed className="h-4 w-4" />
                    Pesan Makanan
                  </Link>

                  {/* Pesanan Saya */}
                  {user && (
                    <Link
                      href="/order"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Pesanan Saya
                    </Link>
                  )}

                  {/* Pembayaran*/}
                  {user && (
                    <Link
                      href={
                        latestOrderId
                          ? `/checkout/${latestOrderId}`
                          : '#'
                      }
                      onClick={(e) => {
                        if (!latestOrderId) {
                          handlePaymentClick(e);
                        }
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <CreditCard className="h-4 w-4" />
                      Pembayaran
                      {latestOrderId && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                          !
                        </span>
                      )}
                    </Link>
                  )}

                  <div className="px-3 pt-2 text-xs font-semibold text-muted-foreground">
                    Lainnya
                  </div>
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Mail className="h-4 w-4" />
                    Contact
                  </Link>
                  <Link
                    href="/support"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Support
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Info className="h-4 w-4" />
                    About
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Auth Buttons */}
            {!user && !isLoading && (
              <div className="mt-6 grid grid-cols-2 gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'w-full'
                  )}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    buttonVariants({ variant: 'default' }),
                    'w-full'
                  )}
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* Mobile User Info */}
            {user && (
              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                        <UserIcon className="h-5 w-5 text-primary" />
                      </div>
                      {user.email_verified_at && (
                        <BadgeCheck className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-background text-emerald-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        {user.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role === 'superadmin'
                            ? 'Super Admin'
                            : user.role === 'admin'
                              ? 'Administrator'
                              : 'User'}
                        </span>
                        {user.divisi && (
                          <span className="truncate rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            {user.divisi}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      href={`/user/${user.id}/profile`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        buttonVariants({
                          variant: 'outline',
                          size: 'sm'
                        }),
                        'w-full text-sm'
                      )}
                    >
                      Profile
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setShowLogoutDialog(true);
                      }}
                      className="w-full text-sm"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* No Payment Dialog */}
      <AlertDialog
        open={showNoPaymentDialog}
        onOpenChange={setShowNoPaymentDialog}
      >
        <AlertDialogContent className="rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:max-w-md">
          <AlertDialogHeader>
            <div className="mb-4 flex justify-center">
              <AlertCircle className="h-12 w-12 text-yellow-600 dark:text-yellow-400 sm:h-16 sm:w-16" />
            </div>
            <AlertDialogTitle className="text-center text-xl sm:text-2xl">
              Belum Ada Pembayaran
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-4 text-center text-xs text-slate-600 dark:text-slate-400 sm:text-base">
              Anda tidak memiliki pesanan yang menunggu pembayaran
              saat ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-6 rounded-lg border-l-4 border-l-yellow-600 bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-300 sm:text-sm">
              💡 Silakan pesan makanan terlebih dahulu untuk melakukan
              pembayaran
            </p>
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
            <AlertDialogCancel className="rounded-lg border-slate-300 dark:border-slate-700">
              Tutup
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowNoPaymentDialog(false);
                router.push('/areas');
              }}
              className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Pesan Sekarang
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout Confirmation Dialog */}
      <AlertDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
      >
        <AlertDialogContent className="rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-xl sm:text-2xl">
              Konfirmasi Logout
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-4 text-center text-xs text-slate-600 dark:text-slate-400 sm:text-base">
              Apakah Anda yakin ingin logout? Anda akan perlu login
              kembali untuk mengakses akun Anda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
            <AlertDialogCancel className="rounded-lg border-slate-300 dark:border-slate-700">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Navbar;
