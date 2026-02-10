'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, MapPin } from 'lucide-react';

interface Area {
  id: number;
  name: string;
  icon: string;
  description: string;
}

interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  photo?: string;
  is_open: boolean;
  menus_count: number;
}

export default function RestaurantsByAreaPage() {
  const params = useParams();
  const areaId = params.areaId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [area, setArea] = useState<Area | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<
    Restaurant[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'open' | 'closed'
  >('all');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchData();
  }, [areaId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${apiUrl}/api/restaurants/area/${areaId}`
      );
      const result = await response.json();

      if (result.success) {
        setArea(result.data.area);
        setRestaurants(result.data.restaurants);
        setFilteredRestaurants(result.data.restaurants);
      } else {
        setError('Gagal memuat restoran');
      }
    } catch (err) {
      setError('Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, filterStatus);
  };

  const handleStatusFilter = (status: 'all' | 'open' | 'closed') => {
    setFilterStatus(status);
    applyFilters(searchQuery, status);
  };

  const applyFilters = (
    query: string,
    status: 'all' | 'open' | 'closed'
  ) => {
    let filtered = restaurants;

    if (query.trim()) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.description.toLowerCase().includes(query.toLowerCase()) ||
          r.address.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (status === 'open') {
      filtered = filtered.filter((r) => r.is_open);
    } else if (status === 'closed') {
      filtered = filtered.filter((r) => !r.is_open);
    }

    setFilteredRestaurants(filtered);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    );
  }

  if (error || !area) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-slate-800">
          <p className="mb-4 text-lg font-medium text-slate-700 dark:text-slate-200">
            {error || 'Area tidak ditemukan'}
          </p>
          <Link href="/areas">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Areas
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header - Fixed Compact Design */}
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/95 backdrop-blur-md backdrop-saturate-150 dark:border-slate-800/80 dark:bg-slate-900/95">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          {/* Back Button - Smaller */}
          <div className="mb-3">
            <Link
              href="/areas"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 sm:text-sm"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Kembali ke Area
            </Link>
          </div>

          {/* Area Info - Compact */}
          <div className="mb-4">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-2.5">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 sm:h-12 sm:w-12">
                      <span className="text-lg sm:text-xl">
                        {area.icon}
                      </span>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div className="min-w-0 flex-1">
                    <h1 className="line-clamp-1 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                      {area.name}
                    </h1>
                    {area.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                        {area.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Restaurant Count Badge - Smaller */}
              <div className="flex-shrink-0 pl-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 dark:bg-emerald-900/20">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 sm:text-sm">
                    {filteredRestaurants.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter Section */}
          <div className="space-y-3">
            {/* Search Bar - Compact */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 sm:left-4 sm:h-5 sm:w-5" />
              <Input
                type="text"
                placeholder="Cari restoran..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-9 w-full rounded-lg border-slate-300 bg-white pl-9 text-sm placeholder:text-slate-500 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:placeholder:text-slate-400 sm:h-10 sm:rounded-xl sm:pl-12 sm:text-base"
              />
            </div>

            {/* Status Filter - Compact */}
            <div className="flex items-center gap-2">
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all' as const, label: 'Semua' },
                  { id: 'open' as const, label: 'Buka' },
                  { id: 'closed' as const, label: 'Tutup' }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => handleStatusFilter(btn.id)}
                    className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all hover:shadow-sm sm:px-3 sm:py-2 sm:text-sm ${
                      filterStatus === btn.id
                        ? btn.id === 'closed'
                          ? 'shadow-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                          : 'shadow-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {filteredRestaurants.length === 0 ? (
          <div className="py-16 text-center sm:py-20">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-slate-100 p-5 dark:bg-slate-800/50 sm:p-6">
                <span className="text-4xl sm:text-5xl">🍽️</span>
              </div>
            </div>
            <p className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
              Tidak ada restoran ditemukan
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Coba gunakan filter atau kata kunci lain.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Section Header */}
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

            {/* Restaurant Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRestaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  href={
                    restaurant.is_open
                      ? `/restaurants/${restaurant.id}`
                      : '#'
                  }
                  onClick={(e) =>
                    !restaurant.is_open && e.preventDefault()
                  }
                >
                  <div
                    className={`group flex h-full flex-col overflow-hidden rounded-xl border transition-all duration-300 ${
                      !restaurant.is_open
                        ? 'border-slate-200 bg-white opacity-50 dark:border-slate-800 dark:bg-slate-900'
                        : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md hover:shadow-emerald-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/50 dark:hover:shadow-emerald-900/20'
                    } ${
                      !restaurant.is_open
                        ? 'cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                  >
                    {/* Image Container */}
                    <div className="relative h-40 flex-shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={
                          restaurant.photo
                            ? `${apiUrl}/storage/${restaurant.photo}`
                            : '/restaurant.png'
                        }
                        alt={restaurant.name}
                        className={`h-full w-full object-cover transition-transform duration-500 ${
                          restaurant.is_open
                            ? 'group-hover:scale-105'
                            : ''
                        }`}
                        onError={(e) => {
                          e.currentTarget.src = '/restaurant.png';
                        }}
                      />

                      {/* Status Badge */}
                      <div className="absolute right-2.5 top-2.5">
                        {restaurant.is_open ? (
                          <div className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-bold text-white shadow-md backdrop-blur-sm">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                            </span>
                            Buka
                          </div>
                        ) : (
                          <div className="rounded-full bg-red-500/90 px-2.5 py-1 text-xs font-bold text-white shadow-md backdrop-blur-sm">
                            Tutup
                          </div>
                        )}
                      </div>

                      {/* Menu Count */}
                      {restaurant.menus_count > 0 && (
                        <div className="absolute bottom-2.5 left-2.5 rounded-lg bg-white/95 px-2 py-1 text-xs font-bold text-slate-900 shadow-md backdrop-blur-sm dark:bg-slate-800/95 dark:text-white">
                          {restaurant.menus_count} Menu
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="mb-1 line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                        {restaurant.name}
                      </h3>
                      <p className="mb-3 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
                        {restaurant.description}
                      </p>

                      {/* Address */}
                      <div className="mb-3 flex flex-1 items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400 dark:text-slate-500" />
                        <span className="line-clamp-1">
                          {restaurant.address}
                        </span>
                      </div>

                      {/* Button */}
                      <Button
                        disabled={!restaurant.is_open}
                        className={`h-9 w-full rounded-lg text-xs font-semibold transition-all ${
                          restaurant.is_open
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700'
                            : 'cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                        }`}
                      >
                        {restaurant.is_open ? 'Lihat Menu' : 'Tutup'}
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
