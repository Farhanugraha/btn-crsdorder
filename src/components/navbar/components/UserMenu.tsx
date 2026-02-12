'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import {
  User as UserIcon,
  BadgeCheck,
  ChevronDown,
  LogOut,
  FileText,
  Users,
  MapPin,
  ChefHat,
  CreditCard
} from 'lucide-react';
import { User } from '../types';

interface UserMenuProps {
  user: User;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  getAdminReportsLink: () => string;
  onLogoutClick: () => void;
  getRoleColor: (role: string) => string; // ✅ Tambahkan ini
}

export const UserMenu = ({
  user,
  isAdmin,
  isSuperAdmin,
  getAdminReportsLink,
  onLogoutClick,
  getRoleColor // ✅ Tambahkan ini
}: UserMenuProps) => {
  return (
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
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/paymentsettings"
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    Pengaturan Pembayaran
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogoutClick}
          className="flex cursor-pointer items-center gap-2 text-red-600 focus:bg-red-50 focus:text-red-600 dark:text-red-500 dark:focus:bg-red-950 dark:focus:text-red-500"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
