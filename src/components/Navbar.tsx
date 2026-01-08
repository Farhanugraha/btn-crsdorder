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
  LogOut,
  Menu,
  Loader2,
  User as UserIcon
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
                      My Orders
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
          <Separator orientation="vertical" className="h-6" />
          <Cart />
          <ToggleTheme />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
