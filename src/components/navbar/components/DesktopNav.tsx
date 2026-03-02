'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import {
  Home,
  Hourglass,
  CreditCard,
  PieChart,
  FileText,
  UtensilsCrossed,
  ShoppingCart,
  Users,
  MapPin,
  ChefHat,
  Shield,
  Mail,
  Info,
  ChevronDown
} from 'lucide-react';
import { User } from '../types';

interface DesktopNavProps {
  user: User | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  getDashboardLink: () => string;
  getAdminOrdersLink: () => string;
  getAdminPaymentsLink: () => string;
  getAdminStatisticsLink: () => string;
  getAdminReportsLink: () => string;
  latestOrderId: number | null;
  handlePaymentClick: (e: React.MouseEvent) => void;
}

export const DesktopNav = ({
  user,
  isAdmin,
  isSuperAdmin,
  getDashboardLink,
  getAdminOrdersLink,
  getAdminPaymentsLink,
  getAdminStatisticsLink,
  getAdminReportsLink,
  latestOrderId,
  handlePaymentClick
}: DesktopNavProps) => {
  return (
    <div className="hidden items-center gap-1 md:flex">
      {/* Home/Dashboard Link */}
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
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary'
            )}
          >
            <Hourglass className="h-4 w-4" />
            Pesanan
          </Link>
          <Link
            href={getAdminPaymentsLink()}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary'
            )}
          >
            <CreditCard className="h-4 w-4" />
            Pembayaran
          </Link>
          <Link
            href={getAdminStatisticsLink()}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary'
            )}
          >
            <PieChart className="h-4 w-4" />
            Statistik
          </Link>
          <Link
            href={getAdminReportsLink()}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
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
              <DropdownMenuContent align="center" className="w-48">
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
                    Manajemen Pengguna
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
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/paymentsettings"
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    Pengaturan Pembayaran
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </>
      )}

      {/* User Navigation Menu - Tampilkan untuk NON-ADMIN */}
      {!isAdmin && (
        <>
          <Link
            href="/areas"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
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
                buttonVariants({ variant: 'ghost', size: 'sm' }),
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
                latestOrderId ? `/checkout/${latestOrderId}` : '#'
              }
              onClick={handlePaymentClick}
              className={cn(
                buttonVariants({
                  variant: latestOrderId ? 'default' : 'ghost',
                  size: 'sm'
                }),
                'group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                latestOrderId && 'bg-emerald-600 hover:bg-emerald-700'
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

          {/* Lainnya Dropdown - Tampilkan untuk SEMUA user (login atau belum) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="group flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary">
                Lainnya
                <ChevronDown className="h-3 w-3 opacity-50 transition-transform group-hover:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
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
  );
};
