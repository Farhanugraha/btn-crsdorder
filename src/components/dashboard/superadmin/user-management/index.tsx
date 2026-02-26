'use client';

import { useUserManagement } from './hooks/useUserManagement';
import { LoadingScreen } from './components/LoadingScreen';
import { AuthGuard } from './components/AuthGuard';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { FilterPanel } from './components/FilterPanel';
import { StatCards } from './components/StatCard';
import { UserTable } from './components/UserTable';
import { UserMobileCards } from './components/UserMobileCards';
import { Pagination } from './components/Pagination';
import { DeleteModal } from './components/DeleteModal';
import { FilterPanelSkeleton } from './components/SkeletonCard';
import { TableSkeleton } from './components/TableSkeleton';
import { MobileSkeleton } from './components/MobileSkeleton';
import { PaginationSkeleton } from './components/SkeletonCard';
import { UserX } from 'lucide-react';

export default function UserManagement() {
  const {
    // State
    mounted,
    authChecked,
    auth,
    users,
    totalUsers,
    totalPages,
    searchTerm,
    filterRole,
    currentPage,
    perPage,
    showFilters,
    fetchState,
    processingId,
    successMsg,
    actionError,
    deleteConfirmId,
    mobileMenuId,
    superadminCount,
    adminCount,
    userCount,

    // Setters
    setSearchTerm,
    setFilterRole,
    setCurrentPage,
    setPerPage,
    setShowFilters,
    setDeleteConfirmId,
    setMobileMenuId,

    // Actions
    fetchUsers,
    handleActivate,
    handleDeactivate,
    handleDelete,
    resetFilters
  } = useUserManagement();

  // Loading state
  if (!mounted || !authChecked) {
    return <LoadingScreen />;
  }

  // Auth guard
  if (!auth) {
    return <AuthGuard />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* top accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400" />

      <Header
        onRefresh={fetchUsers}
        onToggleFilter={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
        isLoading={fetchState.loading}
      />

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        {/* Toasts */}
        {successMsg && <Toast type="success" message={successMsg} />}
        {(actionError || fetchState.error) && (
          <Toast
            type="error"
            message={actionError || fetchState.error || ''}
          />
        )}

        {/* Filter Panel - Show skeleton when loading */}
        {showFilters &&
          (fetchState.loading ? (
            <FilterPanelSkeleton />
          ) : (
            <FilterPanel
              searchTerm={searchTerm}
              filterRole={filterRole}
              perPage={perPage}
              onSearchChange={setSearchTerm}
              onRoleChange={setFilterRole}
              onPerPageChange={setPerPage}
              onReset={resetFilters}
              onClose={() => setShowFilters(false)}
            />
          ))}

        {/* Stat Cards - Always show actual data or empty state */}
        <StatCards
          totalUsers={totalUsers}
          superadminCount={superadminCount}
          adminCount={adminCount}
          userCount={userCount}
        />

        {/* Table Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-800/80">
          {fetchState.loading ? (
            // Loading skeleton
            <>
              <TableSkeleton />
              <MobileSkeleton />
              <PaginationSkeleton />
            </>
          ) : users.length === 0 ? (
            // Empty state
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700/60">
                  <UserX className="h-8 w-8 text-slate-400" />
                </div>
                <p className="font-semibold text-slate-700 dark:text-white">
                  Tidak ada pengguna
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Coba ubah filter atau kata kunci pencarian
                </p>
              </div>
            </div>
          ) : (
            // Data loaded
            <>
              {/* Desktop Table */}
              <UserTable
                users={users}
                processingId={processingId}
                onActivate={handleActivate}
                onDeactivate={handleDeactivate}
                onDeleteClick={setDeleteConfirmId}
              />

              {/* Mobile Cards */}
              <UserMobileCards
                users={users}
                processingId={processingId}
                mobileMenuId={mobileMenuId}
                onMenuToggle={setMobileMenuId}
                onActivate={handleActivate}
                onDeactivate={handleDeactivate}
                onDeleteClick={setDeleteConfirmId}
              />

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalUsers}
                perPage={perPage}
                onPageChange={setCurrentPage}
                disabled={fetchState.loading || !!processingId}
              />
            </>
          )}
        </div>
      </main>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteConfirmId !== null}
        isProcessing={processingId === deleteConfirmId}
        onConfirm={() =>
          deleteConfirmId && handleDelete(deleteConfirmId)
        }
        onCancel={() => {
          setDeleteConfirmId(null);
          setMobileMenuId(null);
        }}
      />
    </div>
  );
}
