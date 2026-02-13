'use client';

import { useRouter } from 'next/navigation';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useOrderList,
  LoadingState,
  ErrorState,
  OrderHeader,
  OrderStats,
  OrderFilter,
  MobileFilters,
  OrderTabs,
  OrderGrid,
  OrderPagination,
  EmptyState,
  ITEMS_PER_PAGE
} from '@/components/order/list';

export default function OrderListPage() {
  const router = useRouter();

  const {
    mounted,
    isLoading,
    error,
    refreshing,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    showAdvancedFilters,
    setShowAdvancedFilters,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    dateFilter,
    setDateFilter,
    priceRange,
    setPriceRange,
    selectedTab,
    setSelectedTab,
    statsPeriod,
    setStatsPeriod,
    filteredOrders,
    paginatedOrders,
    totalPages,
    handleRefresh,
    handleBack,
    handleOrderClick,
    resetFilters,
    loadOrders,
    getStatsData,
    getOrderCountByStatus
  } = useOrderList();

  if (!mounted) return null;
  if (isLoading) return <LoadingState />;

  const stats = getStatsData();
  const hasFilters = !!(
    searchQuery ||
    dateFilter !== 'all' ||
    selectedTab !== 'all' ||
    priceRange[0] > 0 ||
    priceRange[1] < 1000000
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 px-4 py-6 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <OrderHeader
          onBack={handleBack}
          onRefresh={handleRefresh}
          onOrder={() => router.push('/areas')}
          isRefreshing={refreshing}
        />

        <MobileFilters
          isOpen={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          onReset={resetFilters}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="hidden lg:col-span-1 lg:block">
            <OrderFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              showAdvancedFilters={showAdvancedFilters}
              onToggleAdvancedFilters={() =>
                setShowAdvancedFilters(!showAdvancedFilters)
              }
              onReset={resetFilters}
            />
          </div>

          <div className="lg:col-span-3">
            <OrderTabs
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              getOrderCountByStatus={getOrderCountByStatus}
            />

            {filteredOrders.length === 0 ? (
              <EmptyState
                hasFilters={hasFilters}
                onClearFilters={resetFilters}
                onOrder={() => router.push('/areas')}
              />
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                    Menampilkan{' '}
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      filteredOrders.length
                    )}{' '}
                    dari{' '}
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {filteredOrders.length}
                    </span>
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>

                <OrderGrid
                  orders={paginatedOrders}
                  onOrderClick={handleOrderClick}
                />

                {totalPages > 1 && (
                  <OrderPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredOrders.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </div>
        </div>

        <OrderStats
          stats={stats}
          statsPeriod={statsPeriod}
          onStatsPeriodChange={setStatsPeriod}
        />

        {error && (
          <ErrorState
            error={error}
            onRetry={loadOrders}
            onOrder={() => router.push('/areas')}
          />
        )}
      </div>
    </div>
  );
}
