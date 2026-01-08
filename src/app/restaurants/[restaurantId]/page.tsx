'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Minus,
  Plus,
  ShoppingCart,
  ArrowLeft,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';

interface Area {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

interface Menu {
  id: number;
  restaurant_id: number;
  name: string;
  price: string;
  image: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  description?: string;
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
  menus?: Menu[];
}

const RestaurantMenuPage = () => {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.restaurantId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(
    null
  );
  const [menuList, setMenuList] = useState<Menu[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedQuantity, setSelectedQuantity] = useState<{
    [key: string]: number;
  }>({});
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [areaId, setAreaId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (!restaurantId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setRestaurant(null);
        setMenuList([]);
        setDialogOpen({});

        const response = await fetch(
          `http://localhost:8000/api/restaurants/${restaurantId}`
        );
        const result = await response.json();

        if (!result.success) {
          throw new Error('Gagal memuat restoran');
        }

        setRestaurant(result.data);
        setMenuList(result.data.menus || []);
        setAreaId(result.data.area_id);
      } catch (err) {
        console.error('Error:', err);
        setError(
          err instanceof Error ? err.message : 'Terjadi kesalahan'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [restaurantId]);

  const toggleDialog = (menuId: number) => {
    if (!isLoggedIn) {
      toast.error('Silakan login terlebih dahulu');
      router.push('/auth/login');
      return;
    }

    const key = String(menuId);
    setDialogOpen((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));

    if (!dialogOpen[key]) {
      setSelectedQuantity((prev) => ({ ...prev, [key]: 1 }));
      setNotes((prev) => ({ ...prev, [key]: '' }));
    }
  };

  const handleAddToCart = async (menu: Menu) => {
    const key = String(menu.id);
    const quantity = selectedQuantity[key] || 1;
    const noteText = notes[key] || '';

    try {
      setIsAddingToCart(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        toast.error('Silakan login terlebih dahulu');
        router.push('/auth/login');
        return;
      }

      const payload = {
        menu_id: menu.id,
        restaurant_id: restaurant?.id,
        quantity: quantity,
        notes: noteText
      };

      const response = await fetch(
        'http://localhost:8000/api/cart/add-item',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(`${menu.name} ditambahkan ke keranjang!`);
        toggleDialog(menu.id);
        setSelectedQuantity((prev) => ({ ...prev, [key]: 1 }));
        setNotes((prev) => ({ ...prev, [key]: '' }));
        window.dispatchEvent(new Event('cart-updated'));
      } else {
        toast.error(data.message || 'Gagal menambahkan ke keranjang');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Terjadi kesalahan saat menambahkan ke keranjang');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const getTotalPrice = (menuId: number, price: string) => {
    const key = String(menuId);
    const quantity = selectedQuantity[key] || 1;
    const numPrice = parseFloat(price);
    return (numPrice * quantity).toLocaleString('id-ID');
  };

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="aspect-square w-full animate-pulse bg-slate-200 dark:bg-slate-700" />
      <div className="space-y-4 p-4 sm:p-5">
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-6 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-10 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Header Skeleton */}
        <header className="shadow-sm/50 sticky top-0 z-30 border-b border-slate-200/50 bg-white/80 backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-800/80">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <div className="mb-4 h-10 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-3">
              <div className="h-10 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="flex gap-3">
                <div className="h-8 w-40 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="h-8 w-32 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Skeleton */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mb-8">
            <div className="mb-2 h-8 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="px-4 text-center">
          <div className="mb-4 text-5xl">⚠️</div>
          <p className="mb-6 text-lg font-medium text-slate-600 dark:text-slate-300">
            {error || 'Restoran tidak ditemukan'}
          </p>
          <Link href="/areas">
            <Button
              size="lg"
              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Areas
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="shadow-sm/50 sticky top-0 z-30 border-b border-slate-200/50 bg-white/80 backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          {areaId ? (
            <Link
              href={`/areas/${areaId}`}
              className="mb-4 inline-block"
            >
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke {restaurant?.area?.name || 'Area'}
              </Button>
            </Link>
          ) : (
            <Link href="/areas" className="mb-4 inline-block">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Areas
              </Button>
            </Link>
          )}

          <div className="space-y-3">
            {/* Restaurant Name with Area */}
            <div>
              <div className="mb-2 flex items-center gap-3">
                {restaurant.area && (
                  <span className="text-3xl">
                    {restaurant.area.icon || '📍'}
                  </span>
                )}
                <div>
                  {restaurant.area && (
                    <p className="text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                      {restaurant.area.name}
                    </p>
                  )}
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                    {restaurant.name}
                  </h1>
                </div>
              </div>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
                {restaurant.description}
              </p>
            </div>

            {/* Restaurant Info */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="line-clamp-1">
                  {restaurant.address}
                </span>
              </div>

              <div>
                {restaurant.is_open ? (
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600 dark:bg-emerald-400" />
                    Buka
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
                    <span className="h-2 w-2 rounded-full bg-red-600 dark:bg-red-400" />
                    Tutup
                  </div>
                )}
              </div>

              {restaurant.menus_count > 0 && (
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  🍽️ {restaurant.menus_count} Menu
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Menu Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {menuList.length === 0 ? (
          <div className="py-16 sm:py-24">
            <div className="mx-auto max-w-md text-center">
              <div className="mb-4 text-6xl sm:text-7xl">🍽️</div>
              <p className="text-lg font-medium text-slate-500 dark:text-slate-400 sm:text-xl">
                Belum ada menu yang tersedia
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                Menu Makanan
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {menuList.length} item tersedia
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {menuList.map((menu) => (
                <Dialog
                  key={menu.id}
                  open={dialogOpen[String(menu.id)] || false}
                  onOpenChange={() => toggleDialog(menu.id)}
                >
                  <DialogTrigger asChild>
                    <div className="group cursor-pointer">
                      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600">
                        <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                          <img
                            src={menu.image || '/foodimages.png'}
                            alt={menu.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/foodimages.png';
                            }}
                          />
                          {!menu.is_available && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                              <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white dark:bg-slate-950">
                                Tidak Tersedia
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-grow flex-col justify-between p-4 sm:p-5">
                          <div className="mb-3">
                            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 dark:text-white sm:text-base">
                              {menu.name}
                            </h3>
                          </div>

                          <div className="space-y-3">
                            <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 sm:text-lg">
                              Rp{' '}
                              {parseFloat(menu.price).toLocaleString(
                                'id-ID'
                              )}
                            </p>
                            <Button
                              size="sm"
                              disabled={
                                !menu.is_available || !isLoggedIn
                              }
                              className="h-9 w-full bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isLoggedIn) {
                                  toast.error(
                                    'Silakan login terlebih dahulu'
                                  );
                                  router.push('/auth/login');
                                  return;
                                }
                                toggleDialog(menu.id);
                              }}
                            >
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Pesan
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>

                  {isLoggedIn && (
                    <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-3xl border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:w-full">
                      <DialogHeader>
                        <DialogTitle className="text-2xl text-slate-900 dark:text-white sm:text-3xl">
                          {menu.name}
                        </DialogTitle>
                      </DialogHeader>

                      <div className="space-y-5 py-4 sm:py-6">
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-900/20">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">
                            Harga
                          </p>
                          <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                            Rp{' '}
                            {parseFloat(menu.price).toLocaleString(
                              'id-ID'
                            )}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-slate-900 dark:text-white">
                            Catatan (Opsional)
                          </label>
                          <textarea
                            value={notes[String(menu.id)] || ''}
                            onChange={(e) => {
                              const key = String(menu.id);
                              setNotes((prev) => ({
                                ...prev,
                                [key]: e.target.value
                              }));
                            }}
                            placeholder="Tambahkan catatan khusus untuk pesanan Anda..."
                            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400"
                            rows={3}
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-slate-900 dark:text-white">
                            Jumlah
                          </label>
                          <div className="flex items-center justify-between rounded-2xl bg-slate-100 p-4 dark:bg-slate-700">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={
                                (selectedQuantity[String(menu.id)] ||
                                  1) === 1
                              }
                              onClick={() => {
                                const key = String(menu.id);
                                setSelectedQuantity((prev) => ({
                                  ...prev,
                                  [key]: Math.max(
                                    1,
                                    (prev[key] || 1) - 1
                                  )
                                }));
                              }}
                              className="h-10 w-10 rounded-lg border-slate-300 text-slate-900 hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">
                              {selectedQuantity[String(menu.id)] || 1}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const key = String(menu.id);
                                setSelectedQuantity((prev) => ({
                                  ...prev,
                                  [key]: (prev[key] || 1) + 1
                                }));
                              }}
                              className="h-10 w-10 rounded-lg border-slate-300 text-slate-900 hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-100 p-5 dark:border-slate-600 dark:bg-slate-700">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">
                            Total
                          </p>
                          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                            Rp {getTotalPrice(menu.id, menu.price)}
                          </p>
                        </div>

                        <Button
                          className="h-12 w-full rounded-xl bg-emerald-600 text-base font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                          onClick={() => handleAddToCart(menu)}
                          disabled={
                            !menu.is_available || isAddingToCart
                          }
                        >
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          {isAddingToCart
                            ? 'Menambahkan...'
                            : 'Tambah ke Keranjang'}
                        </Button>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RestaurantMenuPage;
