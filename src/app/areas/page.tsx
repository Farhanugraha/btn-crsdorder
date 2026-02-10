'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Search,
  Filter,
  ChefHat,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Building2,
  Utensils,
  Navigation,
  Target,
  Home,
  Store
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Area {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  restaurants_count: number;
  featured?: boolean;
}

export default function AreasPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [areas, setAreas] = useState<Area[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<Area[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'restaurants'>(
    'restaurants'
  );
  const [refreshing, setRefreshing] = useState(false);

  // Hide footer on mount
  useEffect(() => {
    // Hide all footer elements
    const hideAllFooters = () => {
      // Select all possible footer elements
      const selectors = [
        'footer',
        '[class*="footer"]',
        '[id*="footer"]',
        '[data-footer]',
        'footer *',
        'section:has(h4, h3, h2)'
      ];

      selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
          const element = el as HTMLElement;
          const text = element.textContent?.toLowerCase() || '';
          if (
            text.includes('useful') ||
            text.includes('follow') ||
            text.includes('partner') ||
            text.includes('copyright') ||
            text.includes('privacy') ||
            text.includes('terms')
          ) {
            element.style.display = 'none';
          }
        });
      });
    };

    // Run immediately
    hideAllFooters();

    // Set up MutationObserver to catch dynamically added content
    const observer = new MutationObserver(hideAllFooters);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Cleanup
    return () => {
      observer.disconnect();
      document
        .querySelectorAll('footer, [class*="footer"]')
        .forEach((el) => {
          (el as HTMLElement).style.display = '';
        });
    };
  }, []);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchAreas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${apiUrl}/api/areas`);
      const result = await response.json();

      if (result.success) {
        // All areas with restaurants are featured
        const enhancedAreas = result.data.map((area: Area) => ({
          ...area,
          featured: area.restaurants_count > 0
        }));

        setAreas(enhancedAreas);
        setFilteredAreas(enhancedAreas);
      } else {
        setError('Gagal memuat data area');
        toast.error('Gagal memuat area');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi');
      toast.error('Tidak dapat terhubung ke server');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  useEffect(() => {
    let filtered = [...areas];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        (area) =>
          area.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          area.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'restaurants':
          return b.restaurants_count - a.restaurants_count;
        default:
          return 0;
      }
    });

    setFilteredAreas(filtered);
  }, [areas, searchQuery, sortBy]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAreas();
  };

  const getAreaIcon = (icon: string, areaName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      '🏢': (
        <Building2 className="h-12 w-12 text-slate-700 dark:text-slate-300" />
      ),
      '🎯': (
        <Target className="h-12 w-12 text-slate-700 dark:text-slate-300" />
      )
    };

    if (iconMap[icon]) {
      return iconMap[icon];
    }

    if (areaName.toLowerCase().includes('kantin')) {
      return (
        <Utensils className="h-12 w-12 text-slate-700 dark:text-slate-300" />
      );
    }
    if (areaName.toLowerCase().includes('csd')) {
      return (
        <Building2 className="h-12 w-12 text-slate-700 dark:text-slate-300" />
      );
    }
    if (areaName.toLowerCase().includes('riverside')) {
      return (
        <Navigation className="h-12 w-12 text-slate-700 dark:text-slate-300" />
      );
    }
    if (areaName.toLowerCase().includes('yanmar')) {
      return (
        <Store className="h-12 w-12 text-slate-700 dark:text-slate-300" />
      );
    }

    return (
      <Home className="h-12 w-12 text-slate-700 dark:text-slate-300" />
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  // LOADING STATE - DIUBAH
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-900">
        <div className="relative">
          {/* Spinner utama */}
          <div className="h-16 w-16 animate-spin rounded-full border-[6px] border-emerald-100 border-t-emerald-600"></div>

          {/* Spinner inner untuk efek depth */}
          <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-[3px] border-transparent border-t-emerald-400"></div>

          {/* Center dot */}
          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-600"></div>
        </div>

        {/* Loading text dengan animasi */}
        <div className="mt-6 text-center">
          <p className="animate-pulse text-lg font-semibold text-slate-700 dark:text-slate-300">
            Memuat area...
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
            Sedang mengambil data lokasi
          </p>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 px-4 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/10">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-8 text-center backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
            {error}
          </h3>
          <p className="mb-6 text-slate-600 dark:text-slate-400">
            Tidak dapat memuat daftar area. Coba lagi atau hubungi
            administrator.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={fetchAreas}
              variant="destructive"
              className="flex-1"
            >
              Coba Lagi
            </Button>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="flex-1"
            >
              Kembali
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // MAIN CONTENT
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/10">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-slate-200/70 bg-gradient-to-br from-white/90 via-white/95 to-emerald-50/40 px-4 py-6 shadow-sm backdrop-blur-xl backdrop-saturate-200 dark:border-slate-800/70 dark:from-slate-900/90 dark:via-slate-900/95 dark:to-emerald-950/30 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/')}
                className="h-10 w-10 rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md dark:bg-slate-800/80 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                  Pilih Area
                </h1>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                  Pilih area untuk melihat daftar restoran BTN
                </p>
              </div>
            </div>

            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md dark:bg-slate-800/80 dark:hover:bg-slate-800"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing ? 'animate-spin' : ''
                }`}
              />
              <span className="ml-2 hidden sm:inline">Refresh</span>
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500 dark:text-blue-400" />
              <Input
                placeholder="Cari area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 rounded-2xl border-slate-300/80 bg-white/85 pl-12 pr-4 text-base shadow-sm backdrop-blur-sm placeholder:text-slate-500 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700/80 dark:bg-slate-800/85 dark:placeholder:text-slate-400"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Urutkan:
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={
                    sortBy === 'restaurants' ? 'default' : 'outline'
                  }
                  className={cn(
                    'cursor-pointer rounded-full bg-white/80 px-3 py-1.5 text-sm shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md dark:bg-slate-800/80 dark:hover:bg-slate-800',
                    sortBy === 'restaurants' &&
                      'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/40'
                  )}
                  onClick={() => setSortBy('restaurants')}
                >
                  <ChefHat className="mr-1 h-3 w-3" />
                  Banyak Restoran
                </Badge>
                <Badge
                  variant={sortBy === 'name' ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer rounded-full bg-white/80 px-3 py-1.5 text-sm shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md dark:bg-slate-800/80 dark:hover:bg-slate-800',
                    sortBy === 'name' &&
                      'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/40'
                  )}
                  onClick={() => setSortBy('name')}
                >
                  Nama A-Z
                </Badge>
              </div>
            </div>
          </div>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
              >
                Hapus pencarian
              </Button>
            )}
          </div>

          {/* Empty State */}
          {filteredAreas.length === 0 && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-white/50 to-slate-50/50 p-8 text-center backdrop-blur-sm dark:border-slate-700 dark:from-slate-900/30 dark:to-slate-900/20"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <MapPin className="h-8 w-8 text-slate-400 dark:text-slate-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                Area tidak ditemukan
              </h3>
              <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                Coba kata kunci pencarian yang berbeda
              </p>
              <Button
                onClick={() => setSearchQuery('')}
                variant="outline"
                className="rounded-full"
              >
                Tampilkan Semua Area
              </Button>
            </motion.div>
          )}

          {/* Areas Grid */}
          {filteredAreas.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredAreas.map((area) => (
                  <motion.div
                    key={area.id}
                    variants={itemVariants}
                    layout
                    whileHover={{
                      y: -4,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href={`/areas/${area.id}`}>
                      <div
                        className={cn(
                          'group relative h-full cursor-pointer overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all duration-300',
                          'border-slate-200 hover:border-emerald-300 hover:shadow-lg',
                          'dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-600',
                          area.featured &&
                            'border-emerald-200 dark:border-emerald-700'
                        )}
                      >
                        {/* Featured Badge - For ALL areas with restaurants */}
                        {area.featured &&
                          area.restaurants_count > 0 && (
                            <div className="absolute -right-8 top-4 rotate-45 bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-1 text-xs font-bold text-white shadow-lg">
                              TERSEDIA
                            </div>
                          )}

                        {/* Icon */}
                        <div className="mb-4 flex justify-center">
                          <div
                            className={cn(
                              'flex h-16 w-16 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-md',
                              area.restaurants_count > 0
                                ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/10'
                                : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700'
                            )}
                          >
                            {getAreaIcon(area.icon, area.name)}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-4">
                          <div>
                            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                              {area.name}
                            </h3>
                            {area.description && (
                              <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                                {area.description}
                              </p>
                            )}
                          </div>

                          {/* Restaurant Count */}
                          <div className="flex items-center justify-between">
                            <div
                              className={cn(
                                'flex items-center gap-2 rounded-lg px-3 py-1.5',
                                area.restaurants_count > 0
                                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                                  : 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                              )}
                            >
                              <ChefHat className="h-3 w-3" />
                              <span className="text-sm font-medium">
                                {area.restaurants_count} Restoran
                              </span>
                            </div>

                            {/* Arrow Indicator */}
                            <div
                              className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300',
                                area.restaurants_count > 0
                                  ? 'bg-emerald-50 group-hover:bg-emerald-100 dark:bg-emerald-900/20 dark:group-hover:bg-emerald-900/30'
                                  : 'bg-slate-50 dark:bg-slate-800'
                              )}
                            >
                              <div
                                className={cn(
                                  'h-2 w-2 rotate-45 transform border-b-2 border-r-2',
                                  area.restaurants_count > 0
                                    ? 'border-emerald-600 dark:border-emerald-400'
                                    : 'border-slate-400 dark:border-slate-500'
                                )}
                              ></div>
                            </div>
                          </div>

                          {/* Status Indicator */}
                          <div
                            className={cn(
                              'rounded-lg px-3 py-2 text-center text-xs font-medium',
                              area.restaurants_count > 0
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                            )}
                          >
                            {area.restaurants_count > 0
                              ? 'Restoran tersedia'
                              : 'Belum ada restoran'}
                          </div>
                        </div>

                        {/* Hover Effect Line */}
                        <div
                          className={cn(
                            'absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full',
                            area.restaurants_count > 0
                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                              : 'bg-gradient-to-r from-slate-400 to-slate-500'
                          )}
                        ></div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
