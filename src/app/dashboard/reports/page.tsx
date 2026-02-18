'use client';

import {
  useReports,
  LoadingState,
  SuccessAlert,
  ErrorAlert,
  ReportsHeader,
  ReportsFilters,
  ModuleSelection,
  EmptyState,
  formatCurrency
} from '@/components/dashboard/admin/reports';
import { TrendingUp, ShoppingCart, CreditCard } from 'lucide-react';

export default function ReportsPage() {
  const {
    // Data
    dashboardData,
    ordersDetailData,

    // User data
    userData,
    selectedModule,
    showModuleSelection,
    availableModules,

    // States
    isLoading,
    isExporting,
    error,
    successMessage,

    // Filter states
    startDate,
    endDate,
    exportFormat,
    activeFilterStartDate,
    activeFilterEndDate,

    // Setters
    setStartDate,
    setEndDate,
    setExportFormat,

    // Handlers
    handleModuleSelect,
    handleApplyFilter,
    handleExport,
    handleRefresh,
    handleCloseModuleSelection,
    handleOpenModuleSelection,
    handleResetError,
    handleResetSuccess,

    // Helpers
    isDateAvailable
  } = useReports();

  if (isLoading) return <LoadingState />;

  // Tampilkan module selection hanya untuk user dengan multiple access
  if (showModuleSelection && userData.hasMultipleAccess) {
    return (
      <ModuleSelection
        availableModules={availableModules}
        selectedModule={selectedModule}
        error={error}
        isLoading={isLoading}
        onModuleSelect={handleModuleSelect}
        onClose={handleCloseModuleSelection}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 dark:from-gray-900 dark:to-gray-800 md:p-6">
      <div className="mx-auto max-w-7xl">
        <ReportsHeader
          selectedModule={selectedModule}
          userDataAccess={userData.data_access}
          activeFilterStartDate={activeFilterStartDate}
          activeFilterEndDate={activeFilterEndDate}
          onRefresh={handleRefresh}
          onModuleSelectClick={handleOpenModuleSelection}
          isLoading={isLoading}
          hasMultipleAccess={userData.hasMultipleAccess}
        />

        <div className="mb-4 space-y-2">
          {successMessage && (
            <SuccessAlert
              message={successMessage}
              onClose={handleResetSuccess}
            />
          )}
          {error && (
            <ErrorAlert message={error} onClose={handleResetError} />
          )}
        </div>

        <ReportsFilters
          startDate={startDate}
          endDate={endDate}
          exportFormat={exportFormat}
          selectedModule={selectedModule}
          isLoading={isLoading}
          isExporting={isExporting}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onExportFormatChange={setExportFormat}
          onApplyFilter={handleApplyFilter}
          onExport={handleExport}
          isDateAvailable={isDateAvailable}
        />

        <div className="min-h-[400px]">
          {dashboardData ? (
            <div className="space-y-6">
              {/* Module info */}
              {selectedModule && (
                <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                  <span className="font-medium">Modul aktif:</span>{' '}
                  {selectedModule === 'general'
                    ? 'Dashboard Umum (Semua Divisi)'
                    : selectedModule === 'crsd1'
                      ? 'CRSD 1'
                      : 'CRSD 2'}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Total Orders Card */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Pesanan
                      </p>
                      <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                        {dashboardData.orders.total.toLocaleString(
                          'id-ID'
                        )}
                      </p>
                    </div>
                    <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                      <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <TrendingUp className="h-4 w-4" />
                    <span>Semua waktu</span>
                  </div>
                </div>

                {/* Total Revenue Card */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Pendapatan
                      </p>
                      <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(
                          dashboardData.payments.total_revenue
                        )}
                      </p>
                    </div>
                    <div className="rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900/30">
                      <CreditCard className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <TrendingUp className="h-4 w-4" />
                    <span>Semua waktu</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              onRefresh={handleRefresh}
              onModuleSelect={handleOpenModuleSelection}
            />
          )}
        </div>
      </div>
    </div>
  );
}
