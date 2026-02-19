'use client';

import {
  usePayments,
  LoadingState,
  ErrorAlert,
  PaymentsHeader,
  PaymentsStats,
  PaymentsFilters,
  MobileFilters,
  PaymentsTable,
  PaymentsMobileCards,
  PaymentsPagination,
  PaymentsResultsInfo,
  EmptyState
} from '@/components/dashboard/admin/payments';

export default function PaymentsPage() {
  const {
    // Data
    paginatedPayments,
    filteredPayments,
    stats,

    // Loading states
    loading,
    isRefreshing,
    error,
    setError,

    // Filter states
    search,
    datePreset,
    dateRange,

    // UI states
    page,
    totalPages,
    showMobileFilters,
    setShowMobileFilters,
    hasActiveFilters,
    dateDisplayText,

    // Handlers
    handleSearchChange,
    handleDatePresetChange,
    handleDateRangeChange,
    handleTodayFilter,
    handleResetFilters,
    handleRefresh,
    handlePageChange,

    // Constants
    PER_PAGE
  } = usePayments();

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="mx-auto px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
        <PaymentsHeader
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onToggleMobileFilters={() => setShowMobileFilters(true)}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
        />

        <div className="mb-8 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <PaymentsFilters
            search={search}
            onSearchChange={handleSearchChange}
            datePreset={datePreset}
            onDatePresetChange={handleDatePresetChange}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            onTodayFilter={handleTodayFilter}
          />
          <PaymentsStats
            stats={stats}
            dateDisplayText={dateDisplayText}
          />

          {error && (
            <ErrorAlert
              error={error}
              onClose={() => setError(null)}
            />
          )}

          <PaymentsResultsInfo
            totalItems={filteredPayments.length}
            hasActiveFilters={hasActiveFilters}
            page={page}
            totalPages={totalPages}
          />

          {paginatedPayments.length > 0 ? (
            <>
              <PaymentsTable payments={paginatedPayments} />
              <PaymentsMobileCards payments={paginatedPayments} />
              <PaymentsPagination
                page={page}
                totalPages={totalPages}
                totalItems={filteredPayments.length}
                perPage={PER_PAGE}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <EmptyState
              hasActiveFilters={hasActiveFilters}
              onResetFilters={handleResetFilters}
            />
          )}
        </div>

        <MobileFilters
          isOpen={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          datePreset={datePreset}
          onDatePresetChange={handleDatePresetChange}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          onTodayFilter={handleTodayFilter}
          onReset={handleResetFilters}
        />
      </main>
    </div>
  );
}
