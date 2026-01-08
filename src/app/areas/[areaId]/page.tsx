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
  const [filteredRestaurants, setFilteredRestaurants] = useState<
    Restaurant[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [areaId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/restaurants/area/${areaId}`
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
    if (!query.trim()) {
      setFilteredRestaurants(restaurants);
      return;
    }

    const filtered = restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.description.toLowerCase().includes(query.toLowerCase()) ||
        r.address.toLowerCase().includes(query.toLowerCase())
    );
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg">
            {error || 'Area tidak ditemukan'}
          </p>
          <Link href="/areas">
            <Button>Kembali ke Areas</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 bg-white px-4 py-12 dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/areas"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Area
          </Link>

          <div className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-5xl">{area.icon}</span>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                  {area.name}
                </h1>
                {area.description && (
                  <p className="mt-1 text-slate-600 dark:text-slate-300">
                    {area.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari restoran..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12"
            />
          </div>
        </div>
      </header>

      <main className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          {filteredRestaurants.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-slate-600">
                {searchQuery
                  ? 'Restoran tidak ditemukan'
                  : 'Belum ada restoran di area ini'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRestaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  href={`/restaurants/${restaurant.id}`}
                >
                  <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg active:scale-95 dark:border-slate-700 dark:bg-slate-800">
                    <div className="relative h-56 bg-slate-100 dark:bg-slate-700">
                      <Image
                        src="/restaurant.png"
                        alt={restaurant.name}
                        fill
                        className="object-cover"
                      />
                      {restaurant.is_open && (
                        <div className="absolute right-4 top-4 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                          Buka
                        </div>
                      )}
                      {restaurant.menus_count > 0 && (
                        <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold">
                          {restaurant.menus_count} Menu
                        </div>
                      )}
                    </div>
                    <div className="space-y-4 p-5">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {restaurant.name}
                      </h3>
                      <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                        {restaurant.description}
                      </p>
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <p className="line-clamp-2">
                          {restaurant.address}
                        </p>
                      </div>
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        disabled={!restaurant.is_open}
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
          )}
        </div>
      </main>
    </div>
  );
}
