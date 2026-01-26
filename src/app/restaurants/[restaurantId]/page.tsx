'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Minus,
  Plus,
  ShoppingCart,
  ArrowLeft,
  MapPin,
  AlertCircle
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
  photo?: string;
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
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuList, setMenuList] = useState<Menu[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<{ [key: string]: boolean }>({});
  const [selectedQuantity, setSelectedQuantity] = useState<{ [key: string]: number }>({});
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [areaId, setAreaId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const getImageUrl = (image: string | null | undefined): string => {
    if (!image) return '/foodimages.png';
    
    // Jika sudah URL lengkap
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    
    // Jika hanya filename, construct path lengkap
    return `${apiUrl}/storage/uploads/${image}`;
  };

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
          `${apiUrl}/api/restaurants/${restaurantId}`
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
  }, [restaurantId, apiUrl]);

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

      const response = await fetch(`${apiUrl}/api/cart/add-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

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

  const SkeletonCard = () => (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="aspect-square w-full animate-pulse bg-slate-200 dark:bg-slate-700" />
      <div className="space-y-3 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-9 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
        <header className="sticky top-0 z-30 border-b border-slate-200/50 bg-white/80 backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-800/80">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <div className="mb-4 h-10 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-3">
              <div className="h-10 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
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
      <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-slate-800 sm:p-12">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
            Oops! Terjadi Kesalahan
          </h2>
          <p className="mb-6 text-slate-600 dark:text-slate-400">
            {error || 'Restoran tidak ditemukan'}
          </p>
          <Link href="/areas">
            <Button
              size="lg"
              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/70">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          {/* Back Button */}
          <Link href={areaId ? `/areas/${areaId}` : "/areas"}>
            <Button
              variant="ghost"
              size="sm"
              className="group -ml-2 mb-4 gap-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Kembali
            </Button>
          </Link>

          {/* Restaurant Info */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1">
              {restaurant.area && (
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-2xl">{restaurant.area.icon || '📍'}</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    {restaurant.area.name}
                  </span>
                </div>
              )}
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                {restaurant.name}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                {restaurant.description}
              </p>

              {/* Info Badges */}
              <div className="mt-3 flex flex-wrap gap-2">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="line-clamp-1 font-medium">{restaurant.address}</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300">
                  {restaurant.menus_count} Menu
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="shrink-0">
              {restaurant.is_open ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Buka
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:ring-slate-700">
                  Tutup
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Menu Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8">
        {menuList.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 dark:bg-slate-800/50">
            <div className="mb-4 rounded-full bg-slate-100 p-6 dark:bg-slate-800">
              <span className="text-5xl">🍽️</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Belum ada menu tersedia
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Restoran ini belum memperbarui daftar menu mereka.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Menu Section Header */}
            <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                Daftar Menu
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                {menuList.length} pilihan menu spesial
              </p>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {menuList.map((menu) => (
                <Dialog
                  key={menu.id}
                  open={dialogOpen[String(menu.id)] || false}
                  onOpenChange={() => toggleDialog(menu.id)}
                >
                  <div
                    onClick={() => menu.is_available && isLoggedIn && toggleDialog(menu.id)}
                    className={`group h-full flex flex-col overflow-hidden rounded-xl border transition-all duration-300 ${
                      menu.is_available && isLoggedIn
                        ? 'cursor-pointer border-slate-200 bg-white hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900'
                        : 'cursor-default border-slate-300 bg-slate-50 opacity-60 dark:border-slate-700 dark:bg-slate-800/50'
                    }`}
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={getImageUrl(menu.image)}
                        alt={menu.name}
                        className={`h-full w-full object-cover transition-transform duration-500 ${
                          menu.is_available && isLoggedIn ? 'group-hover:scale-105' : ''
                        }`}
                        onError={(e) => {
                          e.currentTarget.src = '/foodimages.png';
                        }}
                      />
                      {!menu.is_available && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
                          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-900">
                            Tidak Tersedia
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-3">
                      <h3 className="mb-1.5 line-clamp-2 text-xs font-bold text-slate-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 sm:text-sm">
                        {menu.name}
                      </h3>

                      <div className="mt-auto space-y-2">
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                          }).format(parseFloat(menu.price))}
                        </p>
                        <button
                          disabled={!menu.is_available || !isLoggedIn}
                          className={`h-8 w-full rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                            !menu.is_available || !isLoggedIn
                              ? 'bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-400'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isLoggedIn) {
                              toast.error('Silakan login terlebih dahulu');
                              router.push('/auth/login');
                              return;
                            }
                            if (!menu.is_available) {
                              toast.error('Menu tidak tersedia');
                              return;
                            }
                            toggleDialog(menu.id);
                          }}
                        >
                          <Plus className="h-3 w-3" />
                          Tambah
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Modal Dialog */}
                  {isLoggedIn && (
                    <DialogContent className="max-w-sm gap-0 overflow-hidden rounded-3xl border-none bg-white p-0 dark:bg-slate-900">
                      {/* Image */}
                      <div className="relative h-56 bg-slate-100 dark:bg-slate-800">
                        <img
                          src={getImageUrl(menu.image)}
                          alt={menu.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/foodimages.png';
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div className="space-y-5 p-6">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                            {menu.name}
                          </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                          {/* Notes */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                              Catatan Khusus
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
                              placeholder="Contoh: Tidak pakai pedas..."
                              className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:placeholder:text-slate-500"
                              rows={2}
                            />
                          </div>

                          {/* Quantity */}
                          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/30">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              Jumlah
                            </span>
                            <div className="flex items-center gap-2.5">
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={(selectedQuantity[String(menu.id)] || 1) === 1}
                                onClick={() => {
                                  const key = String(menu.id);
                                  setSelectedQuantity((prev) => ({
                                    ...prev,
                                    [key]: Math.max(1, (prev[key] || 1) - 1)
                                  }));
                                }}
                                className="h-7 w-7 rounded-full p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-4 text-center text-sm font-bold">
                                {selectedQuantity[String(menu.id)] || 1}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const key = String(menu.id);
                                  setSelectedQuantity((prev) => ({
                                    ...prev,
                                    [key]: (prev[key] || 1) + 1
                                  }));
                                }}
                                className="h-7 w-7 rounded-full p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Price Summary */}
                          <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-500/10">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                                Total
                              </span>
                              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                Rp {getTotalPrice(menu.id, menu.price)}
                              </span>
                            </div>
                          </div>

                          {/* Add to Cart Button */}
                          <Button
                            className="h-10 w-full rounded-lg bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                            onClick={() => handleAddToCart(menu)}
                            disabled={!menu.is_available || isAddingToCart}
                          >
                            <ShoppingCart className="mr-2 h-3.5 w-3.5" />
                            {isAddingToCart ? 'Menambahkan...' : 'Tambah ke Keranjang'}
                          </Button>
                        </div>
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