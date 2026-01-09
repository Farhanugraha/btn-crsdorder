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
  AlertCircle
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

  // Check auth status on mount and listen for storage changes
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('auth_user');
        const token = localStorage.getItem('auth_token');

        // Check token expiration
        const expiresIn = localStorage.getItem('token_expires_in');
        if (expiresIn && Date.now() > Number(expiresIn)) {
          // Token expired
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

    // Check auth on mount
    checkAuth();

    // Listen for storage changes (e.g., login from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === 'auth_user' ||
        e.key === 'auth_token' ||
        e.key === null
      ) {
        checkAuth();
      }
    };

    // Also listen for custom event from login page
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

  // Fetch latest order ketika user berubah
  useEffect(() => {
    if (user) {
      fetchLatestOrder();
    }
  }, [user]);

  const fetchLatestOrder = async () => {
    try {
      setIsLoadingOrder(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        setLatestOrderId(null);
        return;
      }

      const response = await fetch(
        'http://localhost:8000/api/orders',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      if (data.success && data.data && data.data.length > 0) {
        // Ambil order dengan status pending (belum dibayar)
        const pendingOrder = data.data.find(
          (order: any) => order.status === 'pending'
        );

        if (pendingOrder) {
          setLatestOrderId(pendingOrder.id);
        } else {
          // Jika tidak ada pending, ambil order terbaru
          setLatestOrderId(data.data[0].id);
        }
      } else {
        setLatestOrderId(null);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLatestOrderId(null);
    } finally {
      setIsLoadingOrder(false);
    }
  };

  const handlePaymentClick = (e: React.MouseEvent) => {
    if (!latestOrderId) {
      e.preventDefault();
      setShowNoPaymentDialog(true);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        // Clear storage
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('token_expires_in');
        setUser(null);

        // Dispatch logout event untuk clear cart
        window.dispatchEvent(new Event('logout'));

        toast.success('Logout berhasil');
        router.push('/');
        return;
      }

      try {
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
        console.log('Logout response:', data);
      } catch (apiError) {
        console.error('Logout API error:', apiError);
        // Continue dengan logout meski API fail
      }

      // Clear storage regardless of API response
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token_expires_in');
      setUser(null);

      // Dispatch logout event untuk clear cart
      window.dispatchEvent(new Event('logout'));

      toast.success('Logout berhasil');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);

      // Force clear even if unexpected error
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token_expires_in');
      setUser(null);

      // Dispatch logout event untuk clear cart
      window.dispatchEvent(new Event('logout'));

      toast.success('Logout berhasil');
      router.push('/');
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
            href="/"
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
              href="/"
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'text-sm'
              )}
            >
              Home
            </Link>
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
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-4 md:hidden">
          <Link
            href="/"
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
                  <Link href="/">Home</Link>
                </MenubarItem>
                <MenubarItem asChild>
                  <Link href="/areas">Pesan Makanan</Link>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem asChild>
                  <Link href="/contact">Contact</Link>
                </MenubarItem>
                <MenubarItem asChild>
                  <Link href="/support">Support</Link>
                </MenubarItem>
                <MenubarItem asChild>
                  <Link href="/about">About</Link>
                </MenubarItem>
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
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/user/${user.id}/user`}
                      className="cursor-pointer"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/user/${user.id}/orders`}
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
                      Pembayaran
                      {isLoadingOrder && (
                        <span className="ml-2 inline-block animate-spin text-xs">
                          ⏳
                        </span>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  {(user.role === 'admin' ||
                    user.role === 'superadmin') && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/user/${user.id}/admin`}
                          className="cursor-pointer"
                        >
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
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
          {/* Cart - Hanya tampil jika user sudah login */}
          {user && (
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
        <AlertDialogContent className="rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <AlertDialogHeader>
            <div className="mb-4 flex justify-center">
              <AlertCircle className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
            </div>
            <AlertDialogTitle className="text-center text-2xl">
              Belum Ada Pembayaran
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-4 text-center text-base text-slate-600 dark:text-slate-400">
              Anda tidak memiliki pesanan yang menunggu pembayaran
              saat ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-6 rounded-lg border-l-4 border-l-yellow-600 bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
              💡 Silakan pesan makanan terlebih dahulu untuk melakukan
              pembayaran
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
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
    </nav>
  );
};

export default Navbar;
