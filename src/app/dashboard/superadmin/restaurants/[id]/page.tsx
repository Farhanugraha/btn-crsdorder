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
  DollarSign
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
  created_at: string;
}

interface FormData {
  name: string;
  price: number | string;
  image: string;
}

export default function RestaurantDetailPage() {
  const params = useParams();
  const restaurantId = params?.id as string;

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
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
    image: ''
  });

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
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
    setIsLoading(false);
    fetchRestaurantAndMenus();
  };

  const fetchRestaurantAndMenus = async () => {
    await Promise.all([fetchRestaurant(), fetchMenus()]);
  };

  const fetchRestaurant = async () => {
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(
        `${apiUrl}/api/restaurants/${restaurantId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await response.json();
      if (data.success) {
        setRestaurant(data.data);
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      showMessage('error', 'Gagal memuat restoran');
    }
  };

  const fetchMenus = async () => {
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
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
      showMessage('error', 'Gagal memuat menu');
    } finally {
      setIsLoadingMenus(false);
    }
  };

  const handleSubmit = async () => {
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
          image: formData.image
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
        fetchMenus();
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

  const handleEdit = (menu: Menu) => {
    setFormData({
      name: menu.name,
      price: menu.price,
      image: menu.image
    });
    setEditingId(menu.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(`${apiUrl}/api/menus/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        showMessage('success', 'Menu berhasil dihapus');
        fetchMenus();
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

  const resetForm = () => {
    setFormData({ name: '', price: '', image: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-600">
            Memuat detail restoran...
          </p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
          <p className="text-slate-600">Restoran tidak ditemukan</p>
          <a
            href="/dashboard/superadmin/restaurants"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Kembali ke daftar restoran
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <a
                href="/dashboard/superadmin/restaurants"
                className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100"
              >
                <ArrowLeft className="h-4 w-4" />
              </a>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">
                  {restaurant.area?.icon} {restaurant.area?.name}
                </p>
                <h1 className="truncate text-lg font-bold text-slate-900">
                  {restaurant.name}
                </h1>
              </div>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex flex-shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 sm:px-4"
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
        <div className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
          <div
            className={`flex items-center gap-3 rounded-lg border p-3 ${
              message.type === 'success'
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
            )}
            <p
              className={`flex-1 text-sm font-medium ${
                message.type === 'success'
                  ? 'text-emerald-800'
                  : 'text-red-800'
              }`}
            >
              {message.text}
            </p>
            <button
              onClick={() => setMessage(null)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Restaurant Info Section */}
      <section className="border-b border-slate-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">
                Informasi Restoran
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Deskripsi
                  </p>
                  <p className="text-sm text-slate-700">
                    {restaurant.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <p className="text-sm text-slate-700">
                    {restaurant.address}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Status
                  </p>
                  <span
                    className={`inline-block rounded-lg px-3 py-1 text-xs font-semibold ${
                      restaurant.is_open
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {restaurant.is_open ? 'Buka' : 'Tutup'}
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4">
              <h3 className="mb-4 font-semibold text-slate-900">
                Statistik Menu
              </h3>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">
                  {menus.length}
                </p>
                <p className="text-sm text-slate-600">Total Menu</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div
          className={`grid gap-6 ${
            showForm ? 'lg:grid-cols-4' : 'lg:grid-cols-1'
          }`}
        >
          {/* Form Section */}
          {showForm && (
            <div className="order-first lg:order-none lg:col-span-1">
              <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                <div className="sticky top-0 flex items-center justify-between rounded-t-xl border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-4 sm:px-6">
                  <h2 className="text-base font-bold text-slate-900">
                    {editingId ? 'Edit Menu' : 'Tambah Menu'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-slate-400 transition-colors hover:text-slate-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-5 p-4 sm:p-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900">
                      Nama Menu{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Nasi Goreng"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900">
                      Harga <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-slate-500" />
                      <input
                        type="number"
                        placeholder="35000"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: e.target.value
                          })
                        }
                        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900">
                      Nama File Gambar{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: gudeg.jpg"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          image: e.target.value
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-slate-500">
                      Format: nama_file.jpg atau .png
                    </p>
                  </div>
                </div>

                <div className="sticky bottom-0 flex gap-2 rounded-b-xl border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
                  <button
                    onClick={resetForm}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
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
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="hidden sm:inline">
                          Simpan...
                        </span>
                      </>
                    ) : editingId ? (
                      'Perbarui'
                    ) : (
                      'Tambah'
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
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-200 p-2">
                    <ChefHat className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Daftar Menu
                    </h2>
                    <p className="text-xs text-slate-600">
                      Total: {menus.length} menu
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                {isLoadingMenus ? (
                  <div className="col-span-full flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                ) : menus.length > 0 ? (
                  menus.map((menu) => (
                    <div
                      key={menu.id}
                      className="flex flex-col rounded-lg border border-slate-200 p-4 transition-all hover:border-blue-300 hover:shadow-md"
                    >
                      <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-slate-100 text-4xl">
                        🍽️
                      </div>
                      <h3 className="mb-2 line-clamp-2 text-sm font-bold text-slate-900">
                        {menu.name}
                      </h3>
                      <p className="mb-3 text-lg font-bold text-blue-600">
                        {formatCurrency(menu.price)}
                      </p>
                      <p className="mb-3 flex-1 text-xs text-slate-500">
                        File: {menu.image}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(menu)}
                          className="flex-1 rounded-lg p-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                        >
                          <Edit2 className="mx-auto h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(menu.id)}
                          className="flex-1 rounded-lg p-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                        >
                          <Trash2 className="mx-auto h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center">
                    <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Tidak ada menu
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Tambahkan menu pertama Anda sekarang
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-xl">
            <div className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Hapus Menu?
                </h3>
              </div>
              <p className="text-sm text-slate-600">
                Apakah Anda yakin menghapus menu ini? Tindakan ini
                tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  onClick={() =>
                    deleteConfirm && handleDelete(deleteConfirm)
                  }
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
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
