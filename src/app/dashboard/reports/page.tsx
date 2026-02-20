'use client';

import {
  useReports,
  LoadingState,
  SuccessAlert,
  ErrorAlert,
  ReportsFilters,
  ModuleSelection,
  EmptyState,
  formatCurrency
} from '@/components/dashboard/admin/reports';
import { useScrollToTop } from '@/components/dashboard/admin/reports/hooks/useScrollToTop';
import {
  TrendingUp,
  CreditCard,
  LayoutDashboard,
  CalendarRange,
  Download,
  RefreshCw,
  FileText
} from 'lucide-react';
import { useEffect } from 'react';

export default function ReportsPage() {
  const { scrollToTop } = useScrollToTop();

  const {
    dashboardData,
    ordersDetailData,
    userData,
    selectedModule,
    showModuleSelection,
    availableModules,
    isLoading,
    isExporting,
    error,
    successMessage,
    startDate,
    endDate,
    exportFormat,
    activeFilterStartDate,
    activeFilterEndDate,
    setStartDate,
    setEndDate,
    setExportFormat,
    handleModuleSelect,
    handleChangeModule,
    handleApplyFilter,
    handleExport,
    handleRefresh,
    handleResetError,
    handleResetSuccess,
    isDateAvailable
  } = useReports();

  // Scroll to top when component mounts or when view changes
  useEffect(() => {
    scrollToTop('instant');
  }, [showModuleSelection, selectedModule, scrollToTop]);

  // Loading state
  if (isLoading && !showModuleSelection) {
    return <LoadingState />;
  }

  // Module selection untuk all admin
  if (showModuleSelection && userData.hasMultipleAccess) {
    return (
      <ModuleSelection
        availableModules={availableModules}
        selectedModule={selectedModule}
        error={error}
        isLoading={isLoading}
        onModuleSelect={handleModuleSelect}
      />
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header with wave pattern */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-8 md:px-6 lg:px-8">
        <div className="bg-grid-white/10 absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white md:text-4xl">
                Laporan{' '}
                {selectedModule === 'general'
                  ? 'Umum'
                  : selectedModule === 'crsd1'
                    ? 'CRSD 1'
                    : selectedModule === 'crsd2'
                      ? 'CRSD 2'
                      : ''}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-blue-100">
                <CalendarRange className="h-4 w-4" />
                {activeFilterStartDate && activeFilterEndDate
                  ? `${activeFilterStartDate} - ${activeFilterEndDate}`
                  : 'Pilih periode untuk melihat laporan'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Module badge */}
              {selectedModule && (
                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      selectedModule === 'general'
                        ? 'bg-purple-400'
                        : selectedModule === 'crsd1'
                          ? 'bg-blue-400'
                          : 'bg-emerald-400'
                    }`}
                  />
                  <span className="text-sm font-medium text-white">
                    {selectedModule === 'general'
                      ? 'Dashboard Umum'
                      : selectedModule === 'crsd1'
                        ? 'CRSD 1'
                        : 'CRSD 2'}
                  </span>
                </div>
              )}

              {/* Change module button - untuk all admin */}
              {userData.hasMultipleAccess && (
                <button
                  onClick={() => {
                    handleChangeModule();
                    scrollToTop('instant');
                  }}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 disabled:opacity-50"
                  title="Ganti Modul"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    Ganti Modul
                  </span>
                </button>
              )}

              {/* Refresh button */}
              <button
                onClick={() => {
                  handleRefresh();
                  scrollToTop('instant');
                }}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    isLoading ? 'animate-spin' : ''
                  }`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6 lg:px-8">
        {/* Alert messages */}
        <div className="space-y-2">
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

        {/* Filters Card */}
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
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
            onApplyFilter={() => {
              handleApplyFilter();
              scrollToTop('instant');
            }}
            onExport={handleExport}
            isDateAvailable={isDateAvailable}
          />
        </div>

        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Memuat data...
                </p>
              </div>
            </div>
          ) : ordersDetailData ? (
            <div className="space-y-6">
              {/* Orders Detail Section - Langsung ditampilkan tanpa card total pendapatan terpisah */}
              <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Ringkasan Pesanan
                  </h3>
                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isExporting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Mengexport...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Export {exportFormat.toUpperCase()}
                      </>
                    )}
                  </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:from-gray-700 dark:to-gray-600">
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Total Pesanan
                    </p>
                    <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                      {ordersDetailData.summary.total_orders}
                    </p>
                    <FileText className="mt-2 h-5 w-5 text-blue-500 opacity-50" />
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4 dark:from-gray-700 dark:to-gray-600">
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                      Total Revenue
                    </p>
                    <p className="mt-1 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(
                        ordersDetailData.summary.total_revenue
                      )}
                    </p>
                    <CreditCard className="mt-2 h-5 w-5 text-emerald-500 opacity-50" />
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-4 dark:from-gray-700 dark:to-gray-600">
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Rata-rata
                    </p>
                    <p className="mt-1 text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {formatCurrency(
                        ordersDetailData.summary.average_order_value
                      )}
                    </p>
                    <TrendingUp className="mt-2 h-5 w-5 text-purple-500 opacity-50" />
                  </div>
                </div>

                {/* Orders by Date Table */}
                <div className="mt-6">
                  <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Detail per Tanggal
                  </h4>
                  <div className="max-h-60 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">
                            Tanggal
                          </th>
                          <th className="px-4 py-2 text-right text-gray-600 dark:text-gray-300">
                            Jumlah
                          </th>
                          <th className="px-4 py-2 text-right text-gray-600 dark:text-gray-300">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {ordersDetailData.orders_by_date.map(
                          (day) => (
                            <tr
                              key={day.date}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <td className="px-4 py-2 text-gray-900 dark:text-white">
                                {new Date(
                                  day.date
                                ).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </td>
                              <td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-white">
                                {day.total_orders}
                              </td>
                              <td className="px-4 py-2 text-right font-medium text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(day.daily_total)}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              onRefresh={() => {
                handleRefresh();
                scrollToTop('instant');
              }}
              onModuleSelect={
                userData.hasMultipleAccess
                  ? () => {
                      handleChangeModule();
                      scrollToTop('instant');
                    }
                  : () => {
                      handleRefresh();
                      scrollToTop('instant');
                    }
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
