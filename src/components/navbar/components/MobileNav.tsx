'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
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
  Mail,
  Info,
  User as UserIcon,
  BadgeCheck
} from 'lucide-react';
import { User } from '../types';

interface MobileNavProps {
  isOpen: boolean;
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  latestOrderId: number | null;
  getDashboardLink: () => string;
  getAdminOrdersLink: () => string;
  getAdminPaymentsLink: () => string;
  getAdminStatisticsLink: () => string;
  getAdminReportsLink: () => string;
  onLinkClick: () => void;
  onPaymentClick: (e: React.MouseEvent) => void;
  onLogoutClick: () => void;
  getRoleColor: (role: string) => string;
}

export const MobileNav = ({
  isOpen,
  user,
  isLoading,
  isAdmin,
  isSuperAdmin,
  latestOrderId,
  getDashboardLink,
  getAdminOrdersLink,
  getAdminPaymentsLink,
  getAdminStatisticsLink,
  getAdminReportsLink,
  onLinkClick,
  onPaymentClick,
  onLogoutClick,
  getRoleColor
}: MobileNavProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="border-t border-border/50 bg-background px-4 py-4">
        <div className="space-y-1">
          {/* Home/Dashboard Link */}
          <Link
            href={getDashboardLink()}
            onClick={onLinkClick}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Home className="h-4 w-4" />
            {isAdmin ? 'Dashboard' : 'Beranda'}
          </Link>

          {/* Admin Navigation */}
          {isAdmin ? (
            <>
              <Link
                href={getAdminOrdersLink()}
                onClick={onLinkClick}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Hourglass className="h-4 w-4" />
                Pesanan
              </Link>
              <Link
                href={getAdminPaymentsLink()}
                onClick={onLinkClick}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <CreditCard className="h-4 w-4" />
                Pembayaran
              </Link>
              <Link
                href={getAdminStatisticsLink()}
                onClick={onLinkClick}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <PieChart className="h-4 w-4" />
                Statistik
              </Link>
              <Link
                href={getAdminReportsLink()}
                onClick={onLinkClick}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <FileText className="h-4 w-4" />
                Laporan
              </Link>

              {/* Superadmin Menu */}
              {isSuperAdmin && (
                <>
                  <div className="px-3 pt-2 text-xs font-semibold text-muted-foreground">
                    Menu Superadmin
                  </div>
                  <Link
                    href="/dashboard/user-management"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Users className="h-4 w-4" />
                    Manajemen User
                  </Link>
                  <Link
                    href="/dashboard/areas"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <MapPin className="h-4 w-4" />
                    Area
                  </Link>
                  <Link
                    href="/dashboard/restaurants"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <ChefHat className="h-4 w-4" />
                    Restaurant
                  </Link>
                  <Link
                    href="/dashboard/paymentsettings"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <CreditCard className="h-4 w-4" />
                    Pengaturan Pembayaran
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link
                href="/areas"
                onClick={onLinkClick}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <UtensilsCrossed className="h-4 w-4" />
                Pesan Makanan
              </Link>

              {/* Pesanan Saya - HANYA jika login */}
              {user && (
                <Link
                  href="/order"
                  onClick={onLinkClick}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Pesanan Saya
                </Link>
              )}

              {/* Pembayaran - HANYA jika login */}
              {user && (
                <Link
                  href={
                    latestOrderId ? `/checkout/${latestOrderId}` : '#'
                  }
                  onClick={(e) => {
                    if (!latestOrderId) {
                      onPaymentClick(e);
                    }
                    onLinkClick();
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

              {/* Lainnya Section */}
              <div className="px-3 pt-2 text-xs font-semibold text-muted-foreground">
                Lainnya
              </div>
              <Link
                href="/contact"
                onClick={onLinkClick}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Mail className="h-4 w-4" />
                Contact
              </Link>
              <Link
                href="/about"
                onClick={onLinkClick}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Info className="h-4 w-4" />
                About
              </Link>
            </>
          )}
        </div>

        {/* Mobile Auth Buttons - Hanya untuk yang belum login */}
        {!user && !isLoading && (
          <div className="mt-6 grid grid-cols-2 gap-2">
            <Link
              href="/auth/login"
              onClick={onLinkClick}
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'w-full'
              )}
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              onClick={onLinkClick}
              className={cn(
                buttonVariants({ variant: 'default' }),
                'w-full'
              )}
            >
              Daftar
            </Link>
          </div>
        )}

        {/* Mobile User Info - Hanya untuk yang sudah login */}
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
                  onClick={onLinkClick}
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
                    onLinkClick();
                    onLogoutClick();
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
  );
};
