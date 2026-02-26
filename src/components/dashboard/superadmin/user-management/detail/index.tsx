'use client';

import { useParams } from 'next/navigation';
import { useUserDetail } from './hooks/useUserDetail';
import { Header } from './components/Header';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { ProfileCard } from './components/ProfileCard';
import { PersonalInfo } from './components/PersonalInfo';
import { OrganizationInfo } from './components/OrganizationInfo';
import { SystemInfo } from './components/SystemInfo';
import { QuickActions } from './components/QuickActions';
import { MobileMenu } from './components/MobileMenu';
import { DeleteModal } from './components/DeleteModal';
import { AlertTriangle, User } from 'lucide-react';

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;

  const {
    mounted,
    isAuthenticated,
    state,
    handleActivateUser,
    handleDeactivateUser,
    handleDeleteUser,
    setShowDeleteConfirm,
    setShowMobileMenu,
    setError,
    formatDate,
    getRoleLabel,
    getRoleColor
  } = useUserDetail(userId);

  // Loading state saat mounted
  if (!mounted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Memuat...
          </p>
        </div>
      </div>
    );
  }

  // Auth guard - tidak terautentikasi
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-blue-200 bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30">
              <AlertTriangle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h2 className="mb-2 text-center text-xl font-bold text-slate-900 dark:text-white">
            Autentikasi Diperlukan
          </h2>
          <p className="mb-4 text-center text-slate-600 dark:text-slate-300">
            {state.error || 'Silakan login untuk melanjutkan'}
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (state.loading) {
    return <LoadingState />;
  }

  // Error state atau user tidak ditemukan
  if (state.error || !state.user) {
    return (
      <ErrorState
        error={state.error || 'Pengguna tidak ditemukan'}
        userId={userId}
      />
    );
  }

  const user = state.user;

  // Handler untuk toggle mobile menu
  const toggleMobileMenu = () => {
    setShowMobileMenu(!state.showMobileMenu);
  };

  // Handler untuk close mobile menu
  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header
        userId={user.id}
        userName={user.name}
        showMobileMenu={state.showMobileMenu}
        onMobileMenuToggle={toggleMobileMenu}
      />

      {/* Mobile Menu - dipisahkan dari Header */}
      <div className="relative md:hidden">
        <MobileMenu
          userId={user.id}
          isActive={!!user.email_verified_at}
          show={state.showMobileMenu}
          onClose={closeMobileMenu}
          onActivate={handleActivateUser}
          onDeactivate={handleDeactivateUser}
          onDeleteClick={() => {
            setShowDeleteConfirm(true);
            closeMobileMenu();
          }}
        />
      </div>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Error Alert */}
        {state.error && (
          <div className="animate-fade-in mb-6">
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
              <p className="text-sm font-medium text-red-700 dark:text-red-300">
                {state.error}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Profile & Basic Info */}
          <div className="space-y-6 lg:col-span-2">
            <ProfileCard
              user={user}
              getRoleColor={getRoleColor}
              getRoleLabel={getRoleLabel}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <PersonalInfo user={user} formatDate={formatDate} />
              <OrganizationInfo
                user={user}
                getRoleLabel={getRoleLabel}
              />
            </div>

            <SystemInfo user={user} formatDate={formatDate} />
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <QuickActions
              userId={user.id}
              isActive={!!user.email_verified_at}
              onActivate={handleActivateUser}
              onDeactivate={handleDeactivateUser}
              onDeleteClick={() => setShowDeleteConfirm(true)}
            />
          </div>
        </div>
      </main>

      {/* Delete Modal */}
      <DeleteModal
        show={state.showDeleteConfirm}
        isDeleting={state.isDeleting}
        userName={user.name}
        userEmail={user.email}
        onConfirm={handleDeleteUser}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
