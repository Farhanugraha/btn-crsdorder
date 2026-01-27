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
  DropdownMenuSeparator
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
  Settings
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
    isSuperAdmin
      ? '/dashboard/admin/orders'
      : '/dashboard/admin/orders';

  const getAdminPaymentsLink = () =>
    isSuperAdmin
      ? '/dashboard/admin/payments'
      : '/dashboard/admin/payments';

  const getAdminStatisticsLink = () =>
    isSuperAdmin
      ? '/dashboard/admin/statistics'
      : '/dashboard/admin/statistics';

  const getAdminReportsLink = () =>
    isSuperAdmin
      ? '/dashboard/admin/reports'
      : '/dashboard/admin/reports';

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

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex flex-row items-center justify-between px-4 py-3">
        {/* Desktop Navigation */}
        <div className="hidden flex-row items-center gap-8 md:flex">
          <Link
            href={getDashboardLink()}
            className="transition-opacity hover:opacity-80"
          >
            <Image
              src={logo}
              alt="Logo"
              width={45}
              height={45}
              placeholder="blur"
              priority
            />
          </Link>
          <div className="flex flex-row items-center gap-1">
            <Link
              href={getDashboardLink()}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'text-sm'
              )}
            >
              {isAdmin
                ? isSuperAdmin
                  ? 'Dashboard'
                  : 'Dashboard'
                : 'Home'}
            </Link>

            {/* Admin Navigation Menu */}
            {isAdmin && (
              <>
                <Link
                  href={getAdminOrdersLink()}
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'text-sm'
                  )}
                >
                  Pesanan
                </Link>
                <Link
                  href={getAdminPaymentsLink()}
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'text-sm'
                  )}
                >
                  Pembayaran
                </Link>
                <Link
                  href={getAdminStatisticsLink()}
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'text-sm'
                  )}
                >
                  Statistik
                </Link>

                <Link
                  href={getAdminReportsLink()}
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'text-sm'
                  )}
                >
                  Laporan
                </Link>

                {/* Superadmin Exclusive Menu */}
                {isSuperAdmin && (
                  <>
                    <Link
                      href="/dashboard/superadmin/user-management"
                      className={cn(
                        buttonVariants({ variant: 'ghost' }),
                        'text-sm'
                      )}
                    >
                      Manajemen User
                    </Link>
                    <Link
                      href="/dashboard/superadmin/areas"
                      className={cn(
                        buttonVariants({ variant: 'ghost' }),
                        'text-sm'
                      )}
                    >
                      Area
                    </Link>
                    <Link
                      href="/dashboard/superadmin/restaurants"
                      className={cn(
                        buttonVariants({ variant: 'ghost' }),
                        'text-sm'
                      )}
                    >
                      Restaurant
                    </Link>
                  </>
                )}
              </>
            )}

            {/* Pesan Makanan - Hanya untuk non-admin */}
            {!isAdmin && (
              <>
                <Link
                  href="/areas"
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'text-sm'
                  )}
                >
                  Pesan Makanan
                </Link>
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'text-sm'
                  )}
                >
                  Contact
                </Link>
                <Link
                  href="/support"
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'text-sm'
                  )}
                >
                  Support
                </Link>
                <Link
                  href="/about"
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'text-sm'
                  )}
                >
                  About
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-4 md:hidden">
          <Link
            href={getDashboardLink()}
            className="transition-opacity hover:opacity-80"
          >
            <Image
              src={logo}
              alt="Logo"
              width={40}
              height={40}
              placeholder="blur"
              priority
            />
          </Link>
          <Menubar className="border-0">
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <Menu className="h-5 w-5" />
              </MenubarTrigger>
              <MenubarContent align="start">
                <MenubarItem asChild>
                  <Link href={getDashboardLink()}>
                    {isAdmin
                      ? isSuperAdmin
                        ? 'Superadmin'
                        : 'Dashboard'
                      : 'Home'}
                  </Link>
                </MenubarItem>

                {/* Admin Menu Items */}
                {isAdmin && (
                  <>
                    <MenubarSeparator />
                    <MenubarItem asChild>
                      <Link href={getAdminOrdersLink()}>Pesanan</Link>
                    </MenubarItem>
                    <MenubarItem asChild>
                      <Link href={getAdminPaymentsLink()}>
                        Pembayaran
                      </Link>
                    </MenubarItem>
                    <MenubarItem asChild>
                      <Link href={getAdminStatisticsLink()}>
                        Statistik
                      </Link>
                    </MenubarItem>
                    <MenubarItem asChild>
                      <Link href={getAdminReportsLink()}>
                        Laporan
                      </Link>
                    </MenubarItem>

                    {/* Superadmin Exclusive Menu */}
                    {isSuperAdmin && (
                      <>
                        <MenubarSeparator />
                        <MenubarItem asChild>
                          <Link href="/dashboard/superadmin/user-management">
                            Manajemen User
                          </Link>
                        </MenubarItem>
                        <MenubarItem asChild>
                          <Link href="/dashboard/superadmin/areas">
                            Area
                          </Link>
                        </MenubarItem>
                        <MenubarItem asChild>
                          <Link href="/dashboard/superadmin/restaurants">
                            Restaurant
                          </Link>
                        </MenubarItem>
                      </>
                    )}
                  </>
                )}

                {/* User Menu Items */}
                {!isAdmin && (
                  <>
                    <MenubarSeparator />
                    <MenubarItem asChild>
                      <Link href="/areas">Pesan Makanan</Link>
                    </MenubarItem>
                    <MenubarItem asChild>
                      <Link href="/contact">Contact</Link>
                    </MenubarItem>
                    <MenubarItem asChild>
                      <Link href="/support">Support</Link>
                    </MenubarItem>
                    <MenubarItem asChild>
                      <Link href="/about">About</Link>
                    </MenubarItem>
                  </>
                )}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>

        {/* Right Side - Authentication & Actions */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <UserIcon className="h-4 w-4" />
                    <span className="hidden max-w-[120px] truncate sm:inline">
                      {user.name}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                      Role:{' '}
                      <span className="uppercase">{user.role}</span>
                    </p>
                  </div>
                  <DropdownMenuSeparator />

                  {/* Profile - Untuk Semua */}
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/user/${user.id}/user`}
                      className="cursor-pointer"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  {/* Admin Menu Items */}
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href={getAdminReportsLink()}
                          className="cursor-pointer"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Laporan
                        </Link>
                      </DropdownMenuItem>

                      {/* Superadmin Exclusive */}
                      {isSuperAdmin && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link
                              href="/dashboard/superadmin/user-management"
                              className="cursor-pointer"
                            >
                              <UserPlus className="mr-2 h-4 w-4" />
                              Manajemen User
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/dashboard/superadmin/areas"
                              className="cursor-pointer"
                            >
                              <MapPin className="mr-2 h-4 w-4" />
                              Area
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/dashboard/superadmin/restaurants"
                              className="cursor-pointer"
                            >
                              <UtensilsCrossed className="mr-2 h-4 w-4" />
                              Restaurant
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                    </>
                  )}

                  {/* User Menu Items */}
                  {!isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/order"
                          className="cursor-pointer"
                        >
                          Pesanan
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={
                            latestOrderId
                              ? `/checkout/${latestOrderId}`
                              : '#'
                          }
                          className="cursor-pointer"
                          onClick={handlePaymentClick}
                        >
                          <div className="flex items-center gap-2">
                            Pembayaran
                            {isLoadingOrder && (
                              <span className="inline-block animate-spin text-xs">
                                ⏳
                              </span>
                            )}
                            {latestOrderId && (
                              <div className="relative inline-flex h-5 w-5 items-center justify-center">
                                <span className="absolute h-5 w-5 animate-ping rounded-full bg-emerald-600"></span>
                                <span className="relative h-3 w-3 rounded-full bg-emerald-600"></span>
                              </div>
                            )}
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowLogoutDialog(true)}
                    disabled={isLoggingOut}
                    className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 dark:text-red-500 dark:focus:bg-red-950 dark:focus:text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'text-sm'
                )}
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                className={cn(
                  buttonVariants({ variant: 'default' }),
                  'h-9 text-sm'
                )}
              >
                Register
              </Link>
            </>
          )}

          {/* Cart - Hanya untuk non-admin users */}
          {user && !isAdmin && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <Cart />
            </>
          )}

          <ToggleTheme />
        </div>
      </div>

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
    </nav>
  );
};

export default Navbar;
