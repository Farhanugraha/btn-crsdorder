'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, ArrowLeft } from 'lucide-react';

interface Area {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  restaurants_count: number;
}

interface Restaurant {
  id: number;
  area_id: number;
  name: string;
  description: string;
  address: string;
  is_open: boolean;
  menus_count: number;
  area?: Area;
}

const RestaurantListPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState<
    Restaurant[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/api/areas`);
      const result = await response.json();

      if (result.success) {
        setAreas(result.data);
        setError(null);
      } else {
        setError('Gagal memuat area');
      }
    } catch (err) {
      console.error('Error fetching areas:', err);
      setError('Terjadi kesalahan saat memuat area');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRestaurantsByArea = async (areaId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${apiUrl}/api/restaurants/area/${areaId}`
      );
      const result = await response.json();

      if (result.success) {
        setRestaurants(result.data.restaurants);
        setFilteredRestaurants(result.data.restaurants);
        setSelectedArea(result.data.area);
        setError(null);
      } else {
        setError('Gagal memuat restoran');
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError('Terjadi kesalahan saat memuat restoran');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredRestaurants(restaurants);
      return;
    }

    const filtered = restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.description
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredRestaurants(filtered);
  };

  const handleBackToAreas = () => {
    setSelectedArea(null);
    setRestaurants([]);
    setFilteredRestaurants([]);
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600 dark:border-slate-700 dark:border-t-emerald-500"></div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Memuat...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="flex items-center justify-center px-4 py-16">
          <div className="text-center">
            <div className="mb-4 text-5xl">⚠️</div>
            <p className="mb-6 text-lg font-medium text-slate-600 dark:text-slate-300">
              {error}
            </p>
            <Button
              onClick={fetchAreas}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 1: Show Areas
  if (!selectedArea) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white px-4 py-12 dark:border-slate-700 dark:bg-slate-800 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <h1 className="mb-2 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
              Pilih Area
            </h1>
            <p className="text-slate-600 dark:text-slate-300 sm:text-lg">
              Pilih area untuk melihat daftar restoran
            </p>
          </div>
        </header>

        {/* Areas Grid */}
        <main className="px-4 py-12 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            {areas.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mb-4 text-5xl">📍</div>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  Belum ada area tersedia
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {areas.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => fetchRestaurantsByArea(area.id)}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-emerald-300 hover:shadow-xl active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600"
                  >
                    <div className="mb-4 text-center text-6xl transition-transform group-hover:scale-110">
                      {area.icon || '📍'}
                    </div>
                    <h3 className="mb-2 text-center text-2xl font-bold text-slate-900 dark:text-white">
                      {area.name}
                    </h3>
                    {area.description && (
                      <p className="mb-4 text-center text-sm text-slate-600 dark:text-slate-400">
                        {area.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <span>{area.restaurants_count}</span>
                      <span>Restoran</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // STEP 2: Show Restaurants in Selected Area
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header Section */}
      <header className="border-b border-slate-200 bg-white px-4 py-12 dark:border-slate-700 dark:bg-slate-800 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {/* Back Button */}
          <button
            onClick={handleBackToAreas}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Area
          </button>

          <div className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-5xl">
                {selectedArea.icon || '📍'}
              </span>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
                  {selectedArea.name}
                </h1>
                {selectedArea.description && (
                  <p className="mt-1 text-slate-600 dark:text-slate-300">
                    {selectedArea.description}
                  </p>
                )}
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 sm:text-lg">
              Pilih restoran favorit Anda dan nikmati hidangan lezat
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <Input
              type="text"
              placeholder="Cari restoran, makanan, atau alamat..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="rounded-xl border-slate-200 bg-white py-3 pl-12 text-base text-slate-900 shadow-sm placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400"
            />
          </div>
        </div>
      </header>

      {/* Restaurant Grid */}
      <main className="px-4 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {filteredRestaurants.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-4 text-5xl">
                {searchQuery ? '🔍' : '🍽️'}
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                {searchQuery
                  ? 'Restoran tidak ditemukan. Coba cari dengan kata kunci lain.'
                  : 'Belum ada restoran di area ini.'}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Menampilkan{' '}
                  <span className="font-bold text-slate-900 dark:text-white">
                    {filteredRestaurants.length}
                  </span>{' '}
                  restoran
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRestaurants.map((restaurant) => (
                  <Link
                    key={restaurant.id}
                    href={`/menu/${restaurant.id}`}
                  >
                    <div className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600">
                      {/* Restaurant Image */}
                      <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                        <div className="flex h-full items-center justify-center text-6xl text-slate-300 dark:text-slate-600">
                          🍽️
                        </div>

                        {/* Status Badge */}
                        {!restaurant.is_open && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                            <span className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-950">
                              Tutup
                            </span>
                          </div>
                        )}

                        {/* Open Status Badge */}
                        {restaurant.is_open && (
                          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600 dark:bg-emerald-400" />
                            Buka
                          </div>
                        )}

                        {/* Menu Count Badge */}
                        {restaurant.menus_count > 0 && (
                          <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur-sm dark:bg-slate-800/90 dark:text-slate-300">
                            {restaurant.menus_count} Menu
                          </div>
                        )}
                      </div>

                      {/* Restaurant Info */}
                      <div className="space-y-4 p-5 sm:p-6">
                        <div>
                          <h3 className="line-clamp-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                            {restaurant.name}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                            {restaurant.description}
                          </p>
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-3">
                          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400 dark:text-slate-500" />
                          <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                            {restaurant.address}
                          </p>
                        </div>

                        {/* CTA Button */}
                        <Button
                          className="h-10 w-full rounded-lg font-semibold text-white transition-all"
                          disabled={!restaurant.is_open}
                          variant={
                            restaurant.is_open ? 'default' : 'outline'
                          }
                          style={
                            restaurant.is_open
                              ? { backgroundColor: '#16a34a' }
                              : undefined
                          }
                        >
                          {restaurant.is_open
                            ? 'Lihat Menu'
                            : 'Sedang Tutup'}
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default RestaurantListPage;
