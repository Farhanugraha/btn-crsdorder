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
  Eye,
  EyeOff
} from 'lucide-react';
import { useParams } from 'next/navigation';

// ============================================
// TYPES
// ============================================

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

interface Message {
  type: 'success' | 'error';
  text: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function RestaurantDetailPage() {
  const params = useParams();
  const restaurantId = params?.id as string;
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // ============================================
  // STATE MANAGEMENT
  // ============================================

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
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'available' | 'unavailable'
  >('all');
  const [message, setMessage] = useState<Message | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(
    null
  );
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    image: '',
    is_available: true
  });

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    checkAuth();
  }, []);

  // ============================================
  // AUTH FUNCTIONS
  // ============================================

  const checkAuth = (): void => {
    const token = localStorage?.getItem('auth_token');
    const userData = localStorage?.getItem('auth_user');

    if (!token || !userData) {
      window.location.href = '/auth/login';
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'superadmin') {
        window.location.href = '/dashboard/admin';
        return;
      }

      setUser(parsedUser);
      setIsInitialized(true);
      fetchRestaurantAndMenus();
    } catch (error) {
      console.error('Error parsing user:', error);
      window.location.href = '/auth/login';
    }
  };

  // ============================================
  // FETCH FUNCTIONS
  // ============================================

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

  // ============================================
  // IMAGE UPLOAD FUNCTIONS
  // ============================================

  const uploadImageToServer = async (
    file: File
  ): Promise<string | null> => {
    try {
      // Validasi file type
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
      ];
      if (!allowedTypes.includes(file.type)) {
        showMessage(
          'error',
          'Format file harus JPG, PNG, GIF, atau WebP'
        );
        return null;
      }

      // Validasi file size
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        showMessage('error', 'Ukuran file maksimal 5MB');
        return null;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const token = localStorage?.getItem('auth_token');
      const response = await fetch(
        `${apiUrl}/api/menus/upload-image`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formDataToSend
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload gagal');
      }

      if (data.success) {
        const filename =
          data.data?.filename ||
          data.data?.file ||
          data.data?.path ||
          data.filename ||
          data.file;

        if (!filename) {
          throw new Error('Response format tidak sesuai');
        }

        return filename;
      }

      throw new Error(data.message || 'Upload gagal');
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Gagal upload gambar';
      console.error('Upload error:', error);
      showMessage('error', errorMessage);
      return null;
    }
  };

  const handleImageChange = (file: File): void => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      showMessage(
        'error',
        'Format file harus JPG, PNG, GIF, atau WebP'
      );
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showMessage(
        'error',
        `Ukuran file terlalu besar. Maksimal 5MB (Ukuran: ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB)`
      );
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      setImagePreview(preview);
      setFormData((prev: FormData) => ({ ...prev, image: '' }));
    };
    reader.onerror = () => {
      showMessage('error', 'Gagal membaca file');
    };
    reader.readAsDataURL(file);
  };

  // ============================================
  // FORM FUNCTIONS
  // ============================================

  const handleSubmit = async (): Promise<void> => {
    if (!formData.name.trim()) {
      showMessage('error', 'Nama menu harus diisi');
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      showMessage('error', 'Harga harus diisi dengan angka valid');
      return;
    }
    setIsSubmitting(true);
    try {
      let finalImageName: string | null = formData.image || null;

      if (imageFile) {
        const uploadedFileName = await uploadImageToServer(imageFile);
        if (!uploadedFileName) {
          setIsSubmitting(false);
          return;
        }
        finalImageName = uploadedFileName;
      }

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
          name: formData.name.trim(),
          price: Number(formData.price),
          image: finalImageName, 
          is_available: formData.is_available
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal menyimpan menu');
      }

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
        throw new Error(result.message || 'Gagal menyimpan menu');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Terjadi kesalahan';
      showMessage('error', errorMessage);
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
    setImagePreview(getImageSrc(menu.image));
    setImageFile(null);
    setEditingId(menu.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleAvailability = async (
    id: number,
    currentStatus: boolean
  ): Promise<void> => {
    setTogglingId(id);
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(
        `${apiUrl}/api/menus/${id}/toggle`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            is_available: !currentStatus
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal mengubah status');
      }

      if (result.success) {
        showMessage('success', 'Status menu berhasil diubah');
        await fetchMenus();
      } else {
        throw new Error(result.message || 'Gagal mengubah status');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Terjadi kesalahan';
      showMessage('error', errorMessage);
    } finally {
      setTogglingId(null);
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

      if (!response.ok) {
        throw new Error(result.message || 'Gagal menghapus menu');
      }

      if (result.success) {
        showMessage('success', 'Menu berhasil dihapus');
        await fetchMenus();
      } else {
        throw new Error(result.message || 'Gagal menghapus menu');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Terjadi kesalahan';
      showMessage('error', errorMessage);
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
    setImagePreview('');
    setImageFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

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
  const getImageSrc = (image: string | null): string => {
    if (!image) return '/foodimages.png';
    if (image.startsWith('http') || image.startsWith('data:'))
      return image;
    return `${apiUrl}/storage/uploads/${image}`;
  };

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const availableCount = menus.filter(
    (m: Menu) => m.is_available
  ).length;
  const unavailableCount = menus.filter(
    (m: Menu) => !m.is_available
  ).length;

  const filteredMenus = menus.filter((menu: Menu) => {
    if (filterStatus === 'available') return menu.is_available;
    if (filterStatus === 'unavailable') return !menu.is_available;
    return true;
  });

  // ============================================
  // RENDER - LOADING STATE
  // ============================================

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

  // ============================================
// SIMPLIFIED RENDER SECTION (RETURN)
// ============================================

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    {/* Header */}
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90">
      <div className="px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <a
              href="/dashboard/superadmin/restaurants"
              className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
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
              className="inline-flex flex-shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-800 sm:px-4"
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
      <div className="border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900 sm:px-6 lg:px-8">
        <div
          className={`flex items-center gap-3 rounded-lg border p-3 text-sm ${
            message.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-900/20'
              : 'border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/20'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
          )}
          <p
            className={`flex-1 font-medium ${
              message.type === 'success'
                ? 'text-emerald-800 dark:text-emerald-300'
                : 'text-red-800 dark:text-red-300'
            }`}
          >
            {message.text}
          </p>
          <button
            onClick={() => setMessage(null)}
            className="flex-shrink-0 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    )}

    {/* Restaurant Info */}
    <section className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white px-4 py-6 dark:border-slate-700 dark:from-blue-950/30 dark:to-slate-900 sm:px-6 lg:px-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Status Card */}
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Status
          </p>
          <div className="mt-2">
            {restaurant.is_open ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 dark:bg-emerald-900/30">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400" />
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  Buka Sekarang
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-3 py-1.5 dark:bg-slate-700">
                <div className="h-2 w-2 rounded-full bg-slate-500 dark:bg-slate-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Tutup
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Location Card */}
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Lokasi
          </p>
          <div className="mt-2 flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <p className="line-clamp-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              {restaurant.address}
            </p>
          </div>
        </div>

        {/* Total Menu Card */}
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-sm dark:from-blue-900/30 dark:to-blue-900/20">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Total Menu
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {menus.length}
            </p>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {menus.length === 1 ? 'menu' : 'menus'}
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Main Content */}
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className={`grid gap-6 ${showForm ? 'lg:grid-cols-4' : 'lg:grid-cols-1'}`}>
        {/* Form Section */}
        {showForm && (
          <div className="lg:col-span-1">
            <div className="sticky top-24 max-h-[calc(100vh-140px)] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
              <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-4 dark:border-slate-700 dark:from-blue-900/40 dark:to-blue-900/20 sm:px-6">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingId ? 'Edit Menu' : 'Menu Baru'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 p-4 sm:p-6">
                {/* Nama Menu */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                    Nama Menu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nasi Goreng"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
                  />
                </div>

                {/* Harga */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                    Harga <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Rp
                    </span>
                    <input
                      type="number"
                      placeholder="35000"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="flex-1 border-0 bg-transparent text-sm text-slate-900 focus:outline-none dark:text-white"
                    />
                  </div>
                </div>

                {/* Image Upload - IMPROVED */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                    Gambar Menu{' '}
                    <span className="text-slate-500 font-normal">(Opsional)</span>
                  </label>
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageChange(file);
                        }
                      }}
                      className="hidden"
                      id="menu-image-upload"
                    />
                    <label
                      htmlFor="menu-image-upload"
                      className="flex cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-300 bg-gradient-to-br from-blue-50 to-slate-50 px-4 py-6 transition-all hover:border-blue-400 hover:bg-blue-50 dark:border-slate-600 dark:from-slate-800 dark:to-slate-800 dark:hover:border-blue-500 dark:hover:bg-slate-700/50"
                    >
                      <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/40">
                        <svg
                          className="h-5 w-5 text-blue-600 dark:text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          Klik untuk upload gambar
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          JPG, PNG, JPEG • Maks. 5MB
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* File Info */}
                  {imageFile && (
                    <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                          <svg
                            className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 truncate">
                            {imageFile.name}
                          </p>
                          <p className="text-xs text-emerald-600 dark:text-emerald-500">
                            {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('');
                          }}
                          className="flex-shrink-0 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Checkbox */}
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
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
              </div>

              {/* Buttons */}
              <div className="sticky bottom-0 flex gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800 sm:px-6">
                <button
                  onClick={resetForm}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    !formData.name.trim() ||
                    !formData.price
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:hover:bg-blue-800"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">Simpan...</span>
                    </>
                  ) : editingId ? (
                    'Update'
                  ) : (
                    'Tambah'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Menus List */}
        <div className={showForm ? 'lg:col-span-3' : 'lg:col-span-1'}>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-4 dark:border-slate-700 dark:from-blue-900/40 dark:to-blue-900/20 sm:px-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-200 p-2 dark:bg-blue-900/50">
                    <ChefHat className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Daftar Menu
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Total: {menus.length} menu
                    </p>
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition-all sm:text-sm ${
                      filterStatus === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-300 bg-white text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    Semua ({menus.length})
                  </button>
                  <button
                    onClick={() => setFilterStatus('available')}
                    className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition-all sm:text-sm ${
                      filterStatus === 'available'
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-300 bg-white text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    Tersedia ({availableCount})
                  </button>
                  <button
                    onClick={() => setFilterStatus('unavailable')}
                    className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition-all sm:text-sm ${
                      filterStatus === 'unavailable'
                        ? 'bg-red-600 text-white'
                        : 'border border-slate-300 bg-white text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    Tidak ({unavailableCount})
                  </button>
                </div>
              </div>
            </div>

            {isLoadingMenus ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
              </div>
            ) : filteredMenus.length > 0 ? (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredMenus.map((menu) => (
                  <div
                    key={menu.id}
                    className={`group flex flex-col gap-4 p-4 transition-all hover:bg-slate-50 last:border-0 dark:hover:bg-slate-800 sm:flex-row sm:items-center sm:gap-4 sm:p-6 ${
                      !menu.is_available ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Image - Simple Render */}
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-800">
                      <img
                        src={getImageSrc(menu.image)}
                        alt={menu.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/foodimages.png';
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                        {menu.name}
                      </h3>
                      <p className="mt-1.5 text-lg font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(menu.price)}
                      </p>

                      {/* Status Badge */}
                      <div className="mt-2.5">
                        {menu.is_available ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                            Tersedia
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            Tidak Tersedia
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-shrink-0 gap-1.5 sm:gap-2">
                      <button
                        onClick={() => handleEdit(menu)}
                        className="rounded-lg p-2.5 text-blue-600 transition-colors hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/40"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleToggleAvailability(
                            menu.id,
                            menu.is_available
                          )
                        }
                        disabled={togglingId === menu.id}
                        className="rounded-lg p-2.5 text-amber-600 transition-colors hover:bg-amber-100 disabled:opacity-50 dark:text-amber-400 dark:hover:bg-amber-900/40"
                        title={
                          menu.is_available
                            ? 'Tandai tidak tersedia'
                            : 'Tandai tersedia'
                        }
                      >
                        {togglingId === menu.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : menu.is_available ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(menu.id)}
                        className="rounded-lg p-2.5 text-red-600 transition-colors hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/40"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-12">
                <ChefHat className="mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {filterStatus === 'available'
                    ? 'Tidak ada menu tersedia'
                    : filterStatus === 'unavailable'
                      ? 'Tidak ada menu tidak tersedia'
                      : 'Menu Kosong'}
                </h3>
                <p className="mt-1 text-center text-xs text-slate-600 dark:text-slate-400">
                  {menus.length === 0
                    ? 'Tambahkan menu pertama untuk memulai'
                    : 'Ubah filter untuk melihat menu lain'}
                </p>
                {menus.length === 0 && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    <Plus className="h-4 w-4" />
                    Tambah Menu Pertama
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>

    {/* Delete Modal */}
    {deleteConfirm && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="w-full max-w-sm rounded-xl bg-white shadow-xl dark:bg-slate-800">
          <div className="space-y-4 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Hapus Menu?
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Data tidak dapat dipulihkan setelah dihapus.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              >
                Batal
              </button>
              <button
                onClick={() =>
                  deleteConfirm && handleDelete(deleteConfirm)
                }
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:hover:bg-red-800"
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
