'use client';

import { useParams } from 'next/navigation';
import {
  useAreaRestaurants,
  LoadingState,
  ErrorState,
  AreaHeader,
  SearchFilter,
  RestaurantGrid,
  EmptyState
} from '@/components/areas/area-detail';

export default function RestaurantsByAreaPage() {
  const params = useParams();
  const areaId = params.areaId as string;

  const {
    isLoading,
    area,
    filteredRestaurants,
    searchQuery,
    filterStatus,
    error,
    handleSearch,
    handleStatusFilter,
    handleBack,
    fetchData
  } = useAreaRestaurants(areaId);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  if (isLoading) return <LoadingState />;
  if (error || !area)
    return (
      <ErrorState
        error={error || 'Area tidak ditemukan'}
        areaName={area?.name}
      />
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <AreaHeader
        area={area}
        restaurantCount={filteredRestaurants.length}
      />

      <SearchFilter
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        onSearchChange={handleSearch}
        onStatusChange={handleStatusFilter}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {filteredRestaurants.length === 0 ? (
          <EmptyState
            searchQuery={searchQuery}
            filterStatus={filterStatus}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Daftar Restoran Tersedia
              </h2>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 dark:bg-slate-800/50 dark:text-slate-300 sm:w-auto">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                </span>
                {filteredRestaurants.length} ditampilkan
              </span>
            </div>

            <RestaurantGrid
              restaurants={filteredRestaurants}
              apiUrl={apiUrl}
            />
          </div>
        )}
      </main>
    </div>
  );
}
