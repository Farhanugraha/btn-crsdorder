'use client';

import {
  useDashboardOrders,
  LoadingScreen,
  ErrorAlert,
  OrdersHeader,
  OrdersFilterSection,
  OrdersStatsSection,
  OrdersTable,
  OrdersMobileCards,
  OrdersPagination,
  EmptyState
} from '@/components/dashboard/admin/orders';

export default function CompactOrdersPage() {
  const {
    // Data
    paginatedOrders,
    filteredOrders,
    areas,
    restaurants,

    // Statistics
    overviewStats,
    weeklyRevenue,

    // Data spesifik untuk OrdersStatsSection
    filteredProcessingOrders,
    filteredCompletedOrders,
    filteredTotalOrders,
    filteredTotalRevenue,

    // States
    loading,
    isRefreshing,
    error,
    setError,
    search,
    statusFilter,
    areaFilter,
    restaurantFilter,
    dateFilter,
    crsdFilter,
    page,
    pages,
    expandedOrder,
    userRole,
    userDivisi,
    userDataAccess, // TAMBAHKAN INI
    hasActiveFilters,
    dateDisplayText,
    isSuperAdmin,
    isAdmin,
    isCrsd1Admin,
    isCrsd2Admin,
    isCrsdAdmin,

    // Count functions
    getProcessingOrderCountByStatus,
    getOrderCountByArea,
    getOrderCountByRestaurant,

    // Handlers
    setSearch,
    setStatusFilter,
    setAreaFilter,
    setRestaurantFilter,
    setDateFilter,
    setCrsdFilter,
    setPage,
    setExpandedOrder,
    handleRefresh,
    handleResetFilters,
    handleExportExcel,

    // Constants
    PER_PAGE
  } = useDashboardOrders();

  // ============= LOADING STATE =============
  if (loading) {
    return <LoadingScreen />;
  }

  // ============= ERROR STATE =============
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <ErrorAlert error={error} onClose={() => setError(null)} />

          <div className="mt-8 flex flex-col items-center justify-center">
            <button
              onClick={handleRefresh}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800"
            >
              🔄 Coba Lagi
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ============= MAIN RENDER =============
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ===== HEADER SECTION ===== */}
        <OrdersHeader
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          filteredOrders={filteredOrders}
          onExport={handleExportExcel}
        />

        {/* ===== FILTER SECTION ===== */}
        <OrdersFilterSection
          search={search}
          statusFilter={statusFilter}
          areaFilter={areaFilter}
          restaurantFilter={restaurantFilter}
          dateFilter={dateFilter}
          crsdFilter={crsdFilter}
          areas={areas}
          restaurants={restaurants}
          userRole={userRole}
          userDivisi={userDivisi}
          userDataAccess={userDataAccess} // SEKARANG TERSEDIA
          hasActiveFilters={hasActiveFilters}
          isAdmin={isAdmin}
          isSuperAdmin={isSuperAdmin}
          isCrsdAdmin={isCrsdAdmin}
          isCrsd1Admin={isCrsd1Admin}
          isCrsd2Admin={isCrsd2Admin}
          getProcessingOrderCountByStatus={
            getProcessingOrderCountByStatus
          }
          getOrderCountByArea={getOrderCountByArea}
          getOrderCountByRestaurant={getOrderCountByRestaurant}
          onSearchChange={setSearch}
          onStatusChange={setStatusFilter}
          onAreaChange={setAreaFilter}
          onRestaurantChange={setRestaurantFilter}
          onDateChange={setDateFilter}
          onCrsdChange={setCrsdFilter}
          onResetFilters={handleResetFilters}
        />

        {/* ===== STATISTICS SECTION - FIXED! ===== */}
        <OrdersStatsSection
          title={dateDisplayText}
          totalOrders={overviewStats.totalOrders}
          totalRevenue={overviewStats.totalRevenue}
          weeklyRevenue={weeklyRevenue}
          statusFilter={statusFilter}
          dateFilter={dateFilter}
          filteredProcessingOrders={filteredProcessingOrders}
          filteredCompletedOrders={filteredCompletedOrders}
          filteredTotalOrders={filteredTotalOrders}
          filteredTotalRevenue={filteredTotalRevenue}
        />

        {/* ===== ERROR ALERT ===== */}
        {error && (
          <ErrorAlert error={error} onClose={() => setError(null)} />
        )}

        {/* ===== RESULTS SUMMARY ===== */}
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {filteredOrders.length}
            </span>{' '}
            pesanan ditemukan
            {statusFilter !== 'all' && (
              <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                • Status:{' '}
                {statusFilter === 'processing'
                  ? 'Menunggu Diproses'
                  : 'Selesai'}
              </span>
            )}
            {dateFilter !== 'all' && (
              <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                • {dateDisplayText}
              </span>
            )}
          </div>

          {filteredOrders.length > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {areas.length} Area • {restaurants.length} Restoran
            </div>
          )}
        </div>

        {/* ===== DESKTOP TABLE ===== */}
        <OrdersTable
          orders={paginatedOrders}
          expandedOrder={expandedOrder}
          onExpandOrder={setExpandedOrder}
        />

        {/* ===== MOBILE CARDS ===== */}
        <OrdersMobileCards
          orders={paginatedOrders}
          expandedOrder={expandedOrder}
          onExpandOrder={setExpandedOrder}
        />

        {/* ===== EMPTY STATE ===== */}
        {filteredOrders.length === 0 && !loading && (
          <EmptyState
            statusFilter={statusFilter}
            onResetFilters={handleResetFilters}
          />
        )}

        {/* ===== PAGINATION ===== */}
        {pages > 1 && filteredOrders.length > 0 && (
          <OrdersPagination
            page={page}
            pages={pages}
            totalItems={filteredOrders.length}
            perPage={PER_PAGE}
            onPageChange={setPage}
          />
        )}
      </main>
    </div>
  );
}
