'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Loading from '@/components/Loading';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';

interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  is_open: number;
  created_at: string;
  updated_at: string;
}

const RestaurantListPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantList, setRestaurantList] = useState<Restaurant[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState<
    Restaurant[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        'http://localhost:8000/api/restaurants'
      );
      const result = await response.json();

      if (result.success) {
        setRestaurantList(result.data.data);
        setFilteredRestaurants(result.data.data);
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
      setFilteredRestaurants(restaurantList);
      return;
    }

    const filtered = restaurantList.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.description
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredRestaurants(filtered);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loading />
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
              onClick={fetchRestaurants}
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
            >
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header Section */}
      <header className="border-b border-slate-200 bg-white px-4 py-12 dark:border-slate-700 dark:bg-slate-800 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
              Temukan Restoran
            </h1>
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
              <div className="mb-4 text-5xl">🔍</div>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Restoran tidak ditemukan. Coba cari dengan kata kunci
                lain.
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
                        {restaurant.is_open === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                            <span className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-950">
                              Tutup
                            </span>
                          </div>
                        )}

                        {/* Open Status Badge */}
                        {restaurant.is_open === 1 && (
                          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600 dark:bg-emerald-400" />
                            Buka
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
                          disabled={restaurant.is_open === 0}
                          variant={
                            restaurant.is_open === 1
                              ? 'default'
                              : 'outline'
                          }
                          style={
                            restaurant.is_open === 1
                              ? {
                                  backgroundColor: '#16a34a'
                                }
                              : undefined
                          }
                        >
                          {restaurant.is_open === 1
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
