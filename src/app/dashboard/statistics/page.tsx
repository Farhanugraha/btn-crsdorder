'use client';

import {
  useStatistics,
  LoadingState,
  ErrorState,
  StatisticsHeader,
  StatisticsFilters,
  StatisticsStatsGrid,
  StatisticsCharts,
  StatisticsStatus,
  StatisticsMetrics,
  FILTER_OPTIONS
} from '@/components/dashboard/admin/statistics';

export default function StatisticsPage() {
  const {
    // Data
    statistics,
    chartData,
    pieChartData,

    // States
    isLoading,
    isRefreshing,
    isExporting,
    error,
    filterType,
    customStartDate,
    customEndDate,
    expandedSections,

    // Computed
    formatters,
    completionRate,
    processingRate,
    cancellationRate,

    // Handlers
    setCustomStartDate,
    setCustomEndDate,
    handleFilterChange,
    handleCustomDateFilter,
    handleExportData,
    handleRefresh,
    handleToggleSection,
    handleResetError

    // Constants
  } = useStatistics();

  if (isLoading) return <LoadingState />;
  if (error || !statistics)
    return (
      <ErrorState
        error={error || 'Data tidak ditemukan'}
        onRetry={handleRefresh}
      />
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 dark:from-gray-900 dark:to-blue-950/20 md:p-6">
      <div className="mx-auto max-w-7xl">
        <StatisticsHeader
          onRefresh={handleRefresh}
          onExport={handleExportData}
          isRefreshing={isRefreshing}
          isExporting={isExporting}
        />

        <StatisticsFilters
          filterType={filterType}
          onFilterChange={handleFilterChange}
          customStartDate={customStartDate}
          customEndDate={customEndDate}
          onCustomStartDateChange={setCustomStartDate}
          onCustomEndDateChange={setCustomEndDate}
          onCustomDateFilter={handleCustomDateFilter}
          filterOptions={FILTER_OPTIONS}
          error={error}
        />

        <StatisticsStatsGrid
          statistics={statistics}
          formatters={formatters}
        />

        <StatisticsCharts
          chartData={chartData}
          pieChartData={pieChartData}
          expandedSections={expandedSections}
          onToggleSection={handleToggleSection}
          formatters={formatters}
        />

        <StatisticsStatus
          statistics={statistics}
          percentages={pieChartData.percentages}
          expandedSections={expandedSections}
          onToggleSection={handleToggleSection}
          formatters={formatters}
        />

        <StatisticsMetrics
          statistics={statistics}
          completionRate={completionRate}
          processingRate={processingRate}
          cancellationRate={cancellationRate}
          formatters={formatters}
        />
      </div>
    </div>
  );
}
