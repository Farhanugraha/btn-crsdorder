'use client';

import {
  useAreas,
  LoadingState,
  ErrorState,
  AreasHeader,
  SearchFilter,
  AreasGrid,
  EmptyState
} from '@/components/areas';

export default function AreasPage() {
  const {
    isLoading,
    filteredAreas,
    error,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    refreshing,
    handleRefresh,
    handleBack,
    clearSearch,
    fetchAreas,
    areas
  } = useAreas();

  if (isLoading) return <LoadingState />;
  if (error)
    return (
      <ErrorState
        error={error}
        onRetry={fetchAreas}
        onBack={handleBack}
      />
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/10">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-slate-200/70 bg-gradient-to-br from-white/90 via-white/95 to-emerald-50/40 px-4 py-6 shadow-sm backdrop-blur-xl backdrop-saturate-200 dark:border-slate-800/70 dark:from-slate-900/90 dark:via-slate-900/95 dark:to-emerald-950/30 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AreasHeader
            onBack={handleBack}
            onRefresh={handleRefresh}
            isRefreshing={refreshing}
          />
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Results Info */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                Area BTN
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {filteredAreas.length === 0
                  ? 'Tidak ada area yang cocok dengan pencarian'
                  : filteredAreas.length === areas.length
                    ? `Total ${areas.length} area di BTN`
                    : `Menampilkan ${filteredAreas.length} dari ${areas.length} area`}
              </p>
            </div>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
              >
                Hapus pencarian
              </button>
            )}
          </div>

          {/* Empty State */}
          {filteredAreas.length === 0 && (
            <EmptyState onClearSearch={clearSearch} />
          )}

          {/* Areas Grid */}
          {filteredAreas.length > 0 && (
            <AreasGrid areas={filteredAreas} />
          )}
        </div>
      </main>
    </div>
  );
}
