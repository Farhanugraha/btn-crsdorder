'use client';

import { useState } from 'react';
import { ToggleTheme } from '@/components/ToggleTheme';
import { Separator } from '@/components/ui/separator';
import { Menu, X } from 'lucide-react';
import Cart from '../Cart';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useOrder } from './hooks/useOrder';
import { useNavbar } from './hooks/useNavbar';

// Components
import { Logo } from './components/Logo';
import { DesktopNav } from './components/DesktopNav';
import { MobileNav } from './components/MobileNav';
import { UserMenu } from './components/UserMenu';
import { AuthButtons } from './components/AuthButtons';
import { NotificationsBell } from './components/NotificationsBell';
import { LoadingSkeleton } from './components/LoadingSkeleton';

// Dialogs
import { NoPaymentDialog } from './dialogs/NoPaymentDialog';
import { LogoutDialog } from './dialogs/LogoutDialog';

const Navbar = () => {
  const {
    user,
    isLoading,
    isLoggingOut,
    isAdmin,
    isSuperAdmin,
    getDashboardLink,
    logout
  } = useAuth();

  const {
    latestOrderId,
    showNoPaymentDialog,
    setShowNoPaymentDialog,
    handlePaymentClick
  } = useOrder(user, isAdmin);

  const {
    mobileMenuOpen,
    setMobileMenuOpen,
    showLogoutDialog,
    setShowLogoutDialog,
    notificationsCount,
    closeMobileMenu,
    toggleMobileMenu
  } = useNavbar();

  // Helper functions for admin links
  const getAdminOrdersLink = () =>
    isSuperAdmin ? '/dashboard/orders' : '/dashboard/orders';

  const getAdminPaymentsLink = () =>
    isSuperAdmin ? '/dashboard/payments' : '/dashboard/payments';

  const getAdminStatisticsLink = () =>
    isSuperAdmin ? '/dashboard/statistics' : '/dashboard/statistics';

  const getAdminReportsLink = () =>
    isSuperAdmin ? '/dashboard/reports' : '/dashboard/reports';

  // ✅ TAMBAHKAN FUNGSI INI - Get role badge color
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
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Logo dashboardLink={getDashboardLink()} />

            {/* Desktop Navigation */}
            <DesktopNav
              user={user}
              isAdmin={isAdmin}
              isSuperAdmin={isSuperAdmin}
              getDashboardLink={getDashboardLink}
              getAdminOrdersLink={getAdminOrdersLink}
              getAdminPaymentsLink={getAdminPaymentsLink}
              getAdminStatisticsLink={getAdminStatisticsLink}
              getAdminReportsLink={getAdminReportsLink}
              latestOrderId={latestOrderId}
              handlePaymentClick={handlePaymentClick}
            />

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              {user && (
                <NotificationsBell count={notificationsCount} />
              )}

              {/* Cart - Only for non-admin logged in users */}
              {user && !isAdmin && (
                <>
                  <Separator orientation="vertical" className="h-6" />
                  <Cart />
                </>
              )}

              {/* Theme Toggle */}
              <ToggleTheme />

              {/* User Menu / Auth Buttons */}
              {isLoading ? (
                <LoadingSkeleton />
              ) : user ? (
                <UserMenu
                  user={user}
                  isAdmin={isAdmin}
                  isSuperAdmin={isSuperAdmin}
                  getAdminReportsLink={getAdminReportsLink}
                  onLogoutClick={() => setShowLogoutDialog(true)}
                  getRoleColor={getRoleColor}
                />
              ) : (
                <AuthButtons className="hidden md:flex" />
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
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

        {/* Mobile Navigation */}
        <MobileNav
          isOpen={mobileMenuOpen}
          user={user}
          isLoading={isLoading}
          isAdmin={isAdmin}
          isSuperAdmin={isSuperAdmin}
          latestOrderId={latestOrderId}
          getDashboardLink={getDashboardLink}
          getAdminOrdersLink={getAdminOrdersLink}
          getAdminPaymentsLink={getAdminPaymentsLink}
          getAdminStatisticsLink={getAdminStatisticsLink}
          getAdminReportsLink={getAdminReportsLink}
          onLinkClick={closeMobileMenu}
          onPaymentClick={handlePaymentClick}
          onLogoutClick={() => setShowLogoutDialog(true)}
          getRoleColor={getRoleColor}
        />
      </nav>

      {/* Dialogs */}
      <NoPaymentDialog
        open={showNoPaymentDialog}
        onOpenChange={setShowNoPaymentDialog}
      />

      <LogoutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={logout}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
};

export default Navbar;
