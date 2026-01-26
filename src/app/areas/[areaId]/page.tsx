'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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

  useEffect(() => {
    fetchData();
  }, [areaId]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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

    // Filter by search query
    if (query.trim()) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.description.toLowerCase().includes(query.toLowerCase()) ||
          r.address.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter by status
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <p className="mb-4 text-lg text-slate-700 dark:text-slate-200">
            {error || 'Area tidak ditemukan'}
          </p>
          <Link href="/areas">
            <Button className="bg-emerald-600 hover:bg-emerald-700">Kembali ke Areas</Button>
          </Link>
        </div>
      </div>
    );
  }

 return (
  <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <Link
          href="/areas"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>

        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <span className="text-4xl">{area.icon}</span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {area.name}
            </h1>
          </div>
          {area.description && (
            <p className="max-w-2xl text-base text-slate-600 dark:text-slate-400">
              {area.description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari restoran..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-11 border-slate-200 bg-white pl-12 text-sm focus-visible:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'all' as const, label: 'Semua' },
              { id: 'open' as const, label: 'Buka' },
              { id: 'closed' as const, label: 'Tutup' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleStatusFilter(btn.id)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  filterStatus === btn.id
                    ? btn.id === 'closed' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>

    <main className="mx-auto max-w-7xl px-4 py-10">
      {filteredRestaurants.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg font-medium text-slate-900 dark:text-white">Tidak ada restoran ditemukan</p>
          <p className="text-slate-500">Coba gunakan filter atau kata kunci lain.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Daftar Restoran
            </h2>
            <span className="text-xs font-medium text-slate-500">
              {filteredRestaurants.length} Restoran
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={restaurant.is_open ? `/restaurants/${restaurant.id}` : '#'}
                onClick={(e) => !restaurant.is_open && e.preventDefault()}
                className={`group block transition-all ${!restaurant.is_open ? 'cursor-not-allowed' : 'active:scale-95'}`}
              >
                <div
                  className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition-all dark:bg-slate-900 ${
                    !restaurant.is_open 
                      ? 'border-slate-200 opacity-60 dark:border-slate-800' 
                      : 'border-slate-200 hover:border-emerald-500 hover:shadow-md dark:border-slate-800 dark:hover:border-emerald-500/50'
                  }`}
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src="/restaurant.png"
                      alt={restaurant.name}
                      fill
                      className="object-cover"
                    />
                    
                    <div className={`absolute right-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                      restaurant.is_open
                        ? 'bg-emerald-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {restaurant.is_open ? 'Buka' : 'Tutup'}
                    </div>

                    {restaurant.menus_count > 0 && (
                      <div className="absolute bottom-3 left-3 rounded bg-white/95 px-2 py-1 text-[10px] font-bold text-slate-900 dark:bg-slate-800/95 dark:text-white">
                        {restaurant.menus_count} MENU
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-4">
                      <h3 className="mb-1 text-lg font-bold text-slate-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                        {restaurant.name}
                      </h3>
                      <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                        {restaurant.description}
                      </p>
                    </div>

                    <div className="mt-auto space-y-4">
                      <div className="flex items-start gap-2 text-sm text-slate-500">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        <span className="line-clamp-1">{restaurant.address}</span>
                      </div>

                      <Button
                        className={`w-full font-semibold h-10 ${
                          restaurant.is_open
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                        }`}
                        disabled={!restaurant.is_open}
                      >
                        {restaurant.is_open ? 'Lihat Menu' : 'Tutup Sementara'}
                      </Button>
                    </div>
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