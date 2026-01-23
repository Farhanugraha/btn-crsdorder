// app/dashboard/superadmin/restaurants/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Loader2,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  X,
  ChefHat,
  MapPin,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useParams } from 'next/navigation';

interface Area {
  id: number;
  name: string;
  icon: string;
}

interface Restaurant {
  id: number;
  area_id: number;
  name: string;
  description: string;
  address: string;
  is_open: boolean;
  created_at: string;
  area: Area;
}

interface Menu {
  id: number;
  restaurant_id: number;
  name: string;
  price: number;
  image: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

interface FormData {
  name: string;
  price: number | string;
  image: string;
  is_available: boolean;
}

export default function RestaurantDetailPage() {
  const params = useParams();
  const restaurantId = params?.id as string;

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(
    null
  );
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoadingMenus, setIsLoadingMenus] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(
    null
  );

  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    image: '',
    is_available: true
  });

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = (): void => {
    const token = localStorage?.getItem('auth_token');
    const userData = localStorage?.getItem('auth_user');

    if (!token || !userData) {
      window.location.href = '/auth/login';
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'superadmin') {
      window.location.href = '/dashboard/admin';
      return;
    }

    setUser(parsedUser);
    setIsInitialized(true);
    fetchRestaurantAndMenus();
  };

  const fetchRestaurantAndMenus = async (): Promise<void> => {
    await Promise.all([fetchRestaurant(), fetchMenus()]);
  };

  const fetchRestaurant = async (): Promise<void> => {
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(
        `${apiUrl}/api/restaurants/${restaurantId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await response.json();
      if (data.success && data.data) {
        setRestaurant(data.data);
      } else {
        setRestaurant(null);
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      setRestaurant(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMenus = async (): Promise<void> => {
    setIsLoadingMenus(true);
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(
        `${apiUrl}/api/menus/restaurant/${restaurantId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await response.json();
      if (data.success) {
        const menusArray = Array.isArray(data.data)
          ? data.data
          : data.data?.data || [];
        setMenus(menusArray);
      } else {
        setMenus([]);
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
      setMenus([]);
    } finally {
      setIsLoadingMenus(false);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (
      !formData.name.trim() ||
      !formData.price ||
      !formData.image.trim()
    ) {
      showMessage('error', 'Semua field harus diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage?.getItem('auth_token');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `${apiUrl}/api/menus/${editingId}`
        : `${apiUrl}/api/menus`;

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          restaurant_id: Number(restaurantId),
          name: formData.name,
          price: Number(formData.price),
          image: formData.image,
          is_available: formData.is_available
        })
      });

      const result = await response.json();
      if (result.success) {
        showMessage(
          'success',
          editingId
            ? 'Menu berhasil diperbarui'
            : 'Menu berhasil ditambahkan'
        );
        resetForm();
        await fetchMenus();
      } else {
        showMessage(
          'error',
          result.message || 'Gagal menyimpan menu'
        );
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (menu: Menu): void => {
    setFormData({
      name: menu.name,
      price: menu.price,
      image: menu.image,
      is_available: menu.is_available
    });
    setEditingId(menu.id);
    setShowForm(true);
  };

  const handleToggleAvailability = async (
    id: number,
    currentStatus: boolean
  ): Promise<void> => {
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(`${apiUrl}/api/menus/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_available: !currentStatus
        })
      });
      const result = await response.json();
      if (result.success) {
        showMessage('success', 'Status menu berhasil diubah');
        await fetchMenus();
      } else {
        showMessage('error', 'Gagal mengubah status menu');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(`${apiUrl}/api/menus/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        showMessage('success', 'Menu berhasil dihapus');
        await fetchMenus();
      } else {
        showMessage('error', 'Gagal menghapus menu');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'Terjadi kesalahan');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const resetForm = (): void => {
    setFormData({
      name: '',
      price: '',
      image: '',
      is_available: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const showMessage = (
    type: 'success' | 'error',
    text: string
  ): void => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const formatCurrency = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Memuat detail restoran...
          </p>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return null;
  }

  if (!restaurant) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-md text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
            Restoran Tidak Ditemukan
          </h1>
          <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
            Maaf, restoran yang Anda cari tidak ada atau telah dihapus
            dari sistem.
          </p>
          <a
            href="/dashboard/superadmin/restaurants"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Restoran
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80">
        <div className="px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <a
                href="/dashboard/superadmin/restaurants"
                className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <ArrowLeft className="h-4 w-4" />
              </a>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {restaurant.area?.icon} {restaurant.area?.name}
                </p>
                <h1 className="truncate text-lg font-bold text-slate-900 dark:text-white">
                  {restaurant.name}
                </h1>
              </div>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex flex-shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 sm:px-4"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Tambah Menu</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Alert Messages */}
      {message && (
        <div className="border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800 sm:px-6 lg:px-8">
          <div
            className={`flex items-center gap-3 rounded-lg border p-3 ${
              message.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-900/10'
                : 'border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
            )}
            <p
              className={`flex-1 text-sm font-medium ${
                message.type === 'success'
                  ? 'text-emerald-800 dark:text-emerald-300'
                  : 'text-red-800 dark:text-red-300'
              }`}
            >
              {message.text}
            </p>
            <button
              onClick={() => setMessage(null)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Restaurant Info Section */}
      <section className="border-b border-slate-200 bg-white px-4 py-8 dark:border-slate-700 dark:bg-slate-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
              <div>
                <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">
                  Tentang Restoran
                </h2>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {restaurant.description}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Lokasi
                    </p>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                      {restaurant.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Status Operasional
                    </p>
                    <div className="mt-1">
                      {restaurant.is_open ? (
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 dark:bg-emerald-900/30">
                          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400"></div>
                          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                            Buka
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-4 py-2 dark:bg-slate-700">
                          <div className="h-2 w-2 rounded-full bg-slate-500 dark:bg-slate-400"></div>
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Tutup
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 dark:border-blue-900/30 dark:from-blue-900/20 dark:to-blue-800/20">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Statistik
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {menus.length}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Total Menu
                  </p>
                </div>
                <div className="border-t border-blue-200 pt-4 dark:border-blue-900/30">
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    Tambah Menu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div
          className={`grid gap-6 ${
            showForm ? 'lg:grid-cols-4' : 'lg:grid-cols-1'
          }`}
        >
          {/* Form Section */}
          {showForm && (
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-4 dark:border-slate-700 dark:from-blue-900/20 dark:to-blue-800/20 sm:px-6">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {editingId ? 'Edit Menu' : 'Tambah Menu Baru'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="max-h-[calc(100vh-300px)] space-y-5 overflow-y-auto p-4 sm:p-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                      Nama Menu{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Nasi Goreng Spesial"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                      Harga (Rp){' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-700">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Rp
                      </span>
                      <input
                        type="number"
                        placeholder="25000"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: e.target.value
                          })
                        }
                        className="flex-1 border-0 bg-transparent text-sm focus:outline-none dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                      Nama File Gambar{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: nasi-goreng.jpg"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          image: e.target.value
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-400"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Format: .jpg, .png, .jpeg
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.is_available}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_available: e.target.checked
                          })
                        }
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-slate-600"
                      />
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        Menu Tersedia
                      </span>
                    </label>
                    <p className="ml-7 text-xs text-slate-500 dark:text-slate-400">
                      Centang jika menu ini tersedia untuk dipesan
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-700 sm:px-6">
                  <button
                    onClick={resetForm}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={
                      isSubmitting ||
                      !formData.name.trim() ||
                      !formData.price ||
                      !formData.image.trim()
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="hidden sm:inline">
                          Simpan...
                        </span>
                      </>
                    ) : editingId ? (
                      'Perbarui Menu'
                    ) : (
                      'Tambah Menu'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Menus List */}
          <div
            className={showForm ? 'lg:col-span-3' : 'lg:col-span-1'}
          >
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-4 dark:border-slate-700 dark:from-blue-900/20 dark:to-blue-800/20 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-200 p-2 dark:bg-blue-900/30">
                    <ChefHat className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Daftar Menu
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {menus.length === 0
                        ? 'Belum ada menu'
                        : `${menus.length} menu tersedia`}
                    </p>
                  </div>
                </div>
              </div>

              {isLoadingMenus ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Memuat menu...
                    </p>
                  </div>
                </div>
              ) : menus.length > 0 ? (
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {menus.map((menu) => (
                    <div
                      key={menu.id}
                      className="flex flex-col gap-4 p-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 sm:flex-row sm:items-center sm:gap-6 sm:p-6"
                    >
                      {/* Image */}
                      <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 text-4xl dark:from-slate-700 dark:to-slate-600">
                        🍽️
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 text-base font-bold text-slate-900 dark:text-white">
                          {menu.name}
                        </h3>
                        <p className="mb-2 text-lg font-bold text-blue-600 dark:text-blue-400">
                          {formatCurrency(menu.price)}
                        </p>
                        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-medium text-slate-600 dark:text-slate-300">
                            File:
                          </span>{' '}
                          {menu.image}
                        </p>
                        <div>
                          {menu.is_available ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400"></div>
                              Tersedia
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                              <div className="h-2 w-2 rounded-full bg-slate-500 dark:bg-slate-400"></div>
                              Tidak Tersedia
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 sm:flex-col">
                        <button
                          onClick={() => handleEdit(menu)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 p-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="hidden text-xs sm:inline">
                            Edit
                          </span>
                        </button>
                        <button
                          onClick={() =>
                            handleToggleAvailability(
                              menu.id,
                              menu.is_available
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-50 p-2.5 text-sm font-medium text-amber-600 transition-colors hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
                        >
                          {menu.is_available ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="hidden text-xs sm:inline">
                            {menu.is_available ? 'Tutup' : 'Buka'}
                          </span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(menu.id)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 p-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden text-xs sm:inline">
                            Hapus
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center px-4 py-16">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                    <ChefHat className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-slate-900 dark:text-white">
                    Menu Kosong
                  </h3>
                  <p className="mb-6 max-w-xs text-center text-sm text-slate-600 dark:text-slate-400">
                    Belum ada menu di restoran ini. Mulai tambahkan
                    menu pertama Anda sekarang.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    <Plus className="h-4 w-4" />
                    Tambah Menu Pertama
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-xl dark:bg-slate-800">
            <div className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Hapus Menu?
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Apakah Anda yakin ingin menghapus menu ini? Data yang
                dihapus tidak dapat dipulihkan.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  Batal
                </button>
                <button
                  onClick={() =>
                    deleteConfirm && handleDelete(deleteConfirm)
                  }
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
