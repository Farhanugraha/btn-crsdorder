// app/dashboard/superadmin/restaurants/page.tsx
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
  Building2,
  X,
  Grid3X3,
  List,
  ChefHat,
  MapPin,
  Eye,
  EyeOff
} from 'lucide-react';

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
  menus_count: number;
  created_at: string;
  area: Area;
}

interface FormData {
  area_id: string | number;
  name: string;
  description: string;
  address: string;
}

export default function RestaurantsPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoadingRestaurants, setIsLoadingRestaurants] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(
    null
  );

  const [formData, setFormData] = useState<FormData>({
    area_id: '',
    name: '',
    description: '',
    address: ''
  });

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
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
      setIsLoading(false);
      await Promise.all([fetchAreas(), fetchRestaurants()]);
    } catch (error) {
      console.error('Error:', error);
      window.location.href = '/auth/login';
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/areas`);
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setAreas(data.data);
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
      showMessage('error', 'Gagal memuat data area');
    }
  };

  const fetchRestaurants = async () => {
    setIsLoadingRestaurants(true);
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(`${apiUrl}/api/restaurants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success && data.data?.data) {
        setRestaurants(data.data.data);
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'Gagal memuat restoran');
    } finally {
      setIsLoadingRestaurants(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.area_id ||
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.address.trim()
    ) {
      showMessage('error', 'Semua field harus diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage?.getItem('auth_token');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `${apiUrl}/api/restaurants/${editingId}`
        : `${apiUrl}/api/restaurants`;

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          area_id: Number(formData.area_id),
          name: formData.name,
          description: formData.description,
          address: formData.address
        })
      });

      const result = await response.json();
      if (result.success) {
        showMessage(
          'success',
          editingId
            ? 'Restoran berhasil diperbarui'
            : 'Restoran berhasil ditambahkan'
        );
        resetForm();
        await fetchRestaurants();
      } else {
        showMessage('error', result.message || 'Gagal menyimpan');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (restaurant: Restaurant) => {
    setFormData({
      area_id: restaurant.area_id,
      name: restaurant.name,
      description: restaurant.description,
      address: restaurant.address
    });
    setEditingId(restaurant.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(
        `${apiUrl}/api/restaurants/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const result = await response.json();
      if (result.success) {
        showMessage('success', 'Restoran berhasil dihapus');
        await fetchRestaurants();
      } else {
        showMessage('error', 'Gagal menghapus');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'Terjadi kesalahan');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(
        `${apiUrl}/api/restaurants/${id}/toggle-status`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const result = await response.json();
      if (result.success) {
        showMessage('success', 'Status berhasil diubah');
        await fetchRestaurants();
      }
    } catch (error) {
      showMessage('error', 'Gagal mengubah status');
    }
  };

  const resetForm = () => {
    setFormData({
      area_id: '',
      name: '',
      description: '',
      address: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-600">
            Memuat restoran...
          </p>
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
                href="/dashboard/superadmin"
                className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100"
              >
                <ArrowLeft className="h-4 w-4" />
              </a>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">
                  {new Date().toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <h1 className="truncate text-lg font-bold text-slate-900">
                  Manajemen Restoran
                </h1>
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              {!showForm && restaurants.length > 0 && (
                <div className="hidden items-center gap-1 rounded-lg bg-slate-100 p-1 sm:flex">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`rounded p-2 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`rounded p-2 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              )}
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex flex-shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 sm:px-4"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    Tambah Restoran
                  </span>
                </button>
              )}
            </div>
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
                {/* Form Header */}
                <div className="sticky top-0 flex items-center justify-between rounded-t-xl border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-4 sm:px-6">
                  <h2 className="text-base font-bold text-slate-900">
                    {editingId ? 'Edit Restoran' : 'Tambah Restoran'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-slate-400 transition-colors hover:text-slate-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Form Content */}
                <div className="space-y-5 p-4 sm:p-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900">
                      Area <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.area_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          area_id: e.target.value
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Area...</option>
                      {areas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.icon} {area.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900">
                      Nama Restoran{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value
                        })
                      }
                      placeholder="Contoh: Warung Makan Santai"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900">
                      Deskripsi{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value
                        })
                      }
                      placeholder="Jelaskan restoran ini..."
                      rows={3}
                      className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900">
                      Alamat <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: e.target.value
                        })
                      }
                      placeholder="Jl. Contoh No. 123"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="sticky bottom-0 flex gap-2 rounded-b-xl border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
                  <button
                    onClick={resetForm}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.area_id}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />{' '}
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

          {/* Restaurants List */}
          <div
            className={showForm ? 'lg:col-span-3' : 'lg:col-span-1'}
          >
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              {/* Header */}
              <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-200 p-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Daftar Restoran
                    </h2>
                    <p className="text-xs text-slate-600">
                      Total: {restaurants.length} restoran
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="p-4 sm:p-6">
                  {isLoadingRestaurants ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    </div>
                  ) : restaurants.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {restaurants.map((restaurant) => (
                        <div
                          key={restaurant.id}
                          className="flex flex-col rounded-xl border border-slate-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md"
                        >
                          <div className="mb-3 text-5xl leading-none">
                            {restaurant.area?.icon || '🍽️'}
                          </div>
                          <h3 className="mb-1 line-clamp-2 text-sm font-bold text-slate-900">
                            {restaurant.name}
                          </h3>
                          <p className="mb-2 line-clamp-1 text-xs text-slate-600">
                            {restaurant.area?.name}
                          </p>
                          <p className="mb-3 line-clamp-2 flex-1 text-xs text-slate-600">
                            {restaurant.description}
                          </p>
                          <p className="mb-3 flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="h-3 w-3" />{' '}
                            {restaurant.address}
                          </p>
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1 text-xs">
                              <span className="rounded bg-slate-100 px-2 py-1 font-medium text-slate-700">
                                Menu: {restaurant.menus_count}
                              </span>
                              <span
                                className={`rounded px-2 py-1 font-medium ${
                                  restaurant.is_open
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {restaurant.is_open
                                  ? 'Buka'
                                  : 'Tutup'}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(restaurant)}
                                className="flex-1 rounded-lg p-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleToggleStatus(restaurant.id)
                                }
                                className="flex-1 rounded-lg p-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                              >
                                {restaurant.is_open ? (
                                  <EyeOff className="mx-auto h-4 w-4" />
                                ) : (
                                  <Eye className="mx-auto h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteConfirm(restaurant.id)
                                }
                                className="flex-1 rounded-lg p-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Tidak ada restoran
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Tambahkan restoran pertama Anda sekarang
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="divide-y divide-slate-200">
                  {isLoadingRestaurants ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    </div>
                  ) : restaurants.length > 0 ? (
                    restaurants.map((restaurant) => (
                      <div
                        key={restaurant.id}
                        className="flex items-start gap-4 p-4 transition-colors hover:bg-slate-50 sm:p-6"
                      >
                        <div className="flex-shrink-0 text-4xl">
                          {restaurant.area?.icon || '🍽️'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-base font-bold text-slate-900">
                            {restaurant.name}
                          </h3>
                          <p className="mb-2 truncate text-sm text-slate-500">
                            {restaurant.area?.name}
                          </p>
                          <p className="mb-3 line-clamp-2 text-sm text-slate-600">
                            {restaurant.description}
                          </p>
                          <p className="mb-3 flex items-center gap-1 text-sm text-slate-500">
                            <MapPin className="h-4 w-4" />{' '}
                            {restaurant.address}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-block rounded bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                              Menu: {restaurant.menus_count}
                            </span>
                            <span
                              className={`inline-block rounded px-3 py-1 text-xs font-medium ${
                                restaurant.is_open
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {restaurant.is_open ? 'Buka' : 'Tutup'}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-shrink-0 gap-2">
                          <button
                            onClick={() => handleEdit(restaurant)}
                            className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-100"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleToggleStatus(restaurant.id)
                            }
                            className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-100"
                          >
                            {restaurant.is_open ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm(restaurant.id)
                            }
                            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Tidak ada restoran
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Tambahkan restoran pertama Anda sekarang
                      </p>
                    </div>
                  )}
                </div>
              )}
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
                  Hapus Restoran?
                </h3>
              </div>
              <p className="text-sm text-slate-600">
                Apakah Anda yakin menghapus restoran ini? Tindakan ini
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
