'use client';

import {
  Search,
  X,
  Filter,
  Calendar,
  Building2,
  MapPin,
  Store,
  AlertCircle,
  Clock,
  CheckSquare
} from 'lucide-react';
import { Area, Restaurant } from '../types';
import { DATE_OPTIONS, CRSD_OPTIONS } from '../utils/constants';

interface OrdersFilterSectionProps {
  // Data
  search: string;
  statusFilter: string;
  areaFilter: string;
  restaurantFilter: string;
  dateFilter: string;
  crsdFilter: string;
  areas: Area[];
  restaurants: Restaurant[];
  userRole: string;
  userDivisi?: string;
  hasActiveFilters: boolean;
  isAdmin: boolean;
  isSuperAdmin?: boolean;
  isCrsdAdmin?: boolean;
  isCrsd1Admin?: boolean;
  isCrsd2Admin?: boolean;

  // Count functions
  getProcessingOrderCountByStatus: (status: string) => number;
  getOrderCountByArea: (areaId: number) => number;
  getOrderCountByRestaurant: (restaurantId: number) => number;

  // Handlers
  onSearchChange: (value: string) => void;
  onStatusChange: (value: any) => void;
  onAreaChange: (value: string) => void;
  onRestaurantChange: (value: string) => void;
  onDateChange: (value: any) => void;
  onCrsdChange: (value: any) => void;
  onResetFilters: () => void;
}

export const OrdersFilterSection = ({
  search,
  statusFilter,
  areaFilter,
  restaurantFilter,
  dateFilter,
  crsdFilter,
  areas,
  restaurants,
  userRole,
  userDivisi,
  hasActiveFilters,
  isAdmin,
  isSuperAdmin,
  isCrsdAdmin,
  isCrsd1Admin,
  isCrsd2Admin,
  getProcessingOrderCountByStatus,
  getOrderCountByArea,
  getOrderCountByRestaurant,
  onSearchChange,
  onStatusChange,
  onAreaChange,
  onRestaurantChange,
  onDateChange,
  onCrsdChange,
  onResetFilters
}: OrdersFilterSectionProps) => {
  const showCrsdFilter = isSuperAdmin === true;

  const getCrsdLabel = () => {
    if (isCrsd1Admin) return 'CRSD 1';
    if (isCrsd2Admin) return 'CRSD 2';
    return '';
  };

  const processingCount =
    getProcessingOrderCountByStatus('processing');

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Filter Pesanan
          </h3>
          <button
            onClick={onResetFilters}
            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Reset Filter
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
            Cari Pesanan
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Kode, nama pelanggan, restoran..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-8 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            {search && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
            Status Pesanan
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => onStatusChange('processing')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                statusFilter === 'processing'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              Menunggu
              {processingCount > 0 && (
                <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">
                  {processingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onStatusChange('completed')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                statusFilter === 'completed'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <CheckSquare className="h-3.5 w-3.5" />
              Selesai
            </button>

            <button
              onClick={() => onStatusChange('all')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              Semua
            </button>
          </div>
        </div>

        {/* Date Filter */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
            Periode Waktu
          </label>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {DATE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onDateChange(option.value)}
                className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-all ${
                  dateFilter === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-300'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                <Calendar className="h-3 w-3" />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* CRSD Filter - HANYA UNTUK SUPERADMIN */}
        {showCrsdFilter && (
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Divisi CRSD
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CRSD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onCrsdChange(option.value)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    crsdFilter === option.value
                      ? option.value === 'crsd1'
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow'
                        : option.value === 'crsd2'
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow'
                          : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow'
                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* INFO CRSD untuk Admin Biasa */}
        {!showCrsdFilter && isCrsdAdmin && (
          <div className="mb-4 rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-900/20">
            <div className="flex items-start gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                <Building2 className="h-3 w-3 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-purple-800 dark:text-purple-300">
                  Divisi {getCrsdLabel()}
                </p>
                <p className="mt-0.5 text-xs text-purple-700 dark:text-purple-400">
                  Anda hanya dapat melihat pesanan dari divisi{' '}
                  {getCrsdLabel()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Area & Restaurant Filters */}
        {(statusFilter === 'processing' ||
          statusFilter === 'all') && (
          <div className="space-y-4">
            {areas.length > 0 && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Area ({areas.length})
                  </label>
                  <button
                    onClick={() => onAreaChange('all')}
                    className={`text-xs ${
                      areaFilter === 'all'
                        ? 'font-medium text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    Semua Area
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {areas.map((area) => {
                    const count = getOrderCountByArea(area.id);
                    return (
                      <button
                        key={area.id}
                        onClick={() =>
                          onAreaChange(area.id.toString())
                        }
                        className={`group relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                          areaFilter === area.id.toString()
                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow'
                            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                        title={`${area.name} (${count} pesanan)`}
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="max-w-[100px] truncate">
                          {area.name}
                        </span>
                        {count > 0 && (
                          <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {restaurants.length > 0 && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Restoran ({restaurants.length})
                  </label>
                  <button
                    onClick={() => onRestaurantChange('all')}
                    className={`text-xs ${
                      restaurantFilter === 'all'
                        ? 'font-medium text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    Semua Restoran
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {restaurants.slice(0, 8).map((restaurant) => {
                    const count = getOrderCountByRestaurant(
                      restaurant.id
                    );
                    return (
                      <button
                        key={restaurant.id}
                        onClick={() =>
                          onRestaurantChange(restaurant.id.toString())
                        }
                        className={`group relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                          restaurantFilter ===
                          restaurant.id.toString()
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow'
                            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                        title={`${restaurant.name} (${count} pesanan)`}
                      >
                        <Store className="h-3.5 w-3.5" />
                        <span className="max-w-[100px] truncate">
                          {restaurant.name}
                        </span>
                        {count > 0 && (
                          <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                  {restaurants.length > 8 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      +{restaurants.length - 8} restoran lainnya
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Non-processing status info */}
        {statusFilter !== 'processing' && statusFilter !== 'all' && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex items-start gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <AlertCircle className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-blue-800 dark:text-blue-300">
                  Filter Khusus
                </p>
                <p className="mt-0.5 text-xs text-blue-700 dark:text-blue-400">
                  Filter area dan restoran hanya tersedia untuk
                  pesanan dengan status "Menunggu"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Filter Aktif:
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {search && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  <Search className="h-2.5 w-2.5" />"{search}"
                </span>
              )}
              {statusFilter !== 'processing' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  <Filter className="h-2.5 w-2.5" />
                  {statusFilter === 'completed'
                    ? 'Selesai'
                    : statusFilter}
                </span>
              )}
              {dateFilter !== 'today' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                  <Calendar className="h-2.5 w-2.5" />
                  {
                    DATE_OPTIONS.find((d) => d.value === dateFilter)
                      ?.label
                  }
                </span>
              )}
              {showCrsdFilter && crsdFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                  <Building2 className="h-2.5 w-2.5" />
                  {
                    CRSD_OPTIONS.find((c) => c.value === crsdFilter)
                      ?.label
                  }
                </span>
              )}
              {areaFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  <MapPin className="h-2.5 w-2.5" />
                  {
                    areas.find((a) => a.id.toString() === areaFilter)
                      ?.name
                  }
                </span>
              )}
              {restaurantFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  <Store className="h-2.5 w-2.5" />
                  {
                    restaurants.find(
                      (r) => r.id.toString() === restaurantFilter
                    )?.name
                  }
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
