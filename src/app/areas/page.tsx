'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Area {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  restaurants_count: number;
}

export default function AreasPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [areas, setAreas] = useState<Area[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAreas();
  }, []);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchAreas = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/api/areas`);
      const result = await response.json();

      if (result.success) {
        setAreas(result.data);
      } else {
        setError('Gagal memuat area');
      }
    } catch (err) {
      setError('Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg text-slate-600">{error}</p>
          <Button onClick={fetchAreas}>Coba Lagi</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 bg-white px-4 py-12 dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-2 text-4xl font-bold text-slate-900 dark:text-white">
            Pilih Area
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Pilih area untuk melihat daftar restoran
          </p>
        </div>
      </header>

      <main className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => (
              <Link key={area.id} href={`/areas/${area.id}`}>
                <div className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-emerald-300 hover:shadow-xl active:scale-95 dark:border-slate-700 dark:bg-slate-800">
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
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
