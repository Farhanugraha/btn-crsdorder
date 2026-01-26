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
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('all');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchData();
  }, [areaId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/api/restaurants/area/${areaId}`);
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

  const applyFilters = (query: string, status: 'all' | 'open' | 'closed') => {
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
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/areas"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>

          {/* Area Info */}
          <div className="mb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="mb-3 flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 text-3xl drop-shadow-sm sm:text-4xl">{area.icon}</span>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                      {area.name}
                    </h1>
                  </div>
                </div>
                {area.description && (
                  <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                    {area.description}
                  </p>
                )}
              </div>
              
              {/* Restaurant Count Badge */}
              <div className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 dark:bg-emerald-900/30">
                <div className="flex items-center justify-center">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  </span>
                </div>
                <span className="whitespace-nowrap text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  {filteredRestaurants.length} Restoran
                </span>
              </div>
            </div>
          </div>

          {/* Search & Filter Section */}
          <div className="space-y-3 sm:space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari restoran..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-11 w-full border-slate-200 bg-white pl-12 text-sm focus-visible:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:focus-visible:ring-emerald-500/50"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:gap-3 sm:overflow-visible sm:pb-0">
              {[
                { id: 'all' as const, label: 'Semua' },
                { id: 'open' as const, label: 'Buka' },
                { id: 'closed' as const, label: 'Tutup' }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => handleStatusFilter(btn.id)}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4 ${
                    filterStatus === btn.id
                      ? btn.id === 'closed'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8">
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
                  href={restaurant.is_open ? `/restaurants/${restaurant.id}` : '#'}
                  onClick={(e) => !restaurant.is_open && e.preventDefault()}
                >
                  <div
                    className={`group h-full overflow-hidden rounded-xl border transition-all duration-300 flex flex-col ${
                      !restaurant.is_open
                        ? 'border-slate-200 bg-white opacity-50 dark:border-slate-800 dark:bg-slate-900'
                        : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md hover:shadow-emerald-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/50 dark:hover:shadow-emerald-900/20'
                    } ${!restaurant.is_open ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {/* Image Container */}
                    <div className="relative h-40 overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                      <img
                        src={
                          restaurant.photo
                            ? `${apiUrl}/storage/${restaurant.photo}`
                            : '/restaurant.png'
                        }
                        alt={restaurant.name}
                        className={`h-full w-full object-cover transition-transform duration-500 ${
                          restaurant.is_open ? 'group-hover:scale-105' : ''
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
                      <div className="mb-3 flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400 flex-1">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400 dark:text-slate-500" />
                        <span className="line-clamp-1">{restaurant.address}</span>
                      </div>

                      {/* Button */}
                      <Button
                        disabled={!restaurant.is_open}
                        className={`w-full h-9 text-xs font-semibold rounded-lg transition-all ${
                          restaurant.is_open
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500'
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