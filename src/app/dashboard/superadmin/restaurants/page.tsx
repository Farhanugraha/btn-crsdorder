'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Loader2,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Building2,
  Search,
  X,
  Grid3X3,
  List,
  MapPin,
  Eye,
  EyeOff,
  ChefHat,
  Circle,
  ChevronDown
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
  photo?: string;
  is_open: number | boolean;
  menus_count: number;
  created_at: string;
  area: Area;
}

interface FormData {
  area_id: string | number;
  name: string;
  description: string;
  address: string;
  photoFile?: File | null;           
  photoPreview?: string | null;      
  currentPhoto?: string | null;      
}

export default function RestaurantsPage() {
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('all');
  const [filterArea, setFilterArea] = useState<string | number>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    area_id: '',
    name: '',
    description: '',
    address: ''
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const getIsOpen = (value: number | boolean): boolean => Boolean(value);

  useEffect(() => {
    const checkDarkMode = () => {
      const hasDark = document.documentElement.classList.contains('dark');
      setIsDark(hasDark);
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

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
      console.error('Auth Error:', error);
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

      if (data.success && data.data?.data && Array.isArray(data.data.data)) {
        setRestaurants(data.data.data);
      } else {
        setRestaurants([]);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      showMessage('error', 'Gagal memuat restoran');
      setRestaurants([]);
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

      // Gunakan FormData untuk upload file
      const submitData = new FormData();
      submitData.append('area_id', String(formData.area_id));
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('address', formData.address);
          
      if (editingId) {
      submitData.append('_method', 'PUT'); 
     }

      if (formData.photoFile) {
        submitData.append('photo', formData.photoFile);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: submitData
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
      address: restaurant.address,
      currentPhoto: restaurant.photo || null
    });
    setEditingId(restaurant.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(`${apiUrl}/api/restaurants/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        showMessage('success', 'Restoran berhasil dihapus');
        await fetchRestaurants();
      } else {
        showMessage('error', result.message || 'Gagal menghapus');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'Terjadi kesalahan');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleToggleStatus = async (id: number) => {
    setTogglingId(id);
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(`${apiUrl}/api/restaurants/${id}/toggle-status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();

      if (result.success) {
        showMessage('success', 'Status berhasil diubah');
        await fetchRestaurants();
      } else {
        showMessage('error', result.message || 'Gagal mengubah status');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'Gagal mengubah status');
    } finally {
      setTogglingId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      area_id: '',
      name: '',
      description: '',
      address: '',
      photoFile: null,
      photoPreview: null,
      currentPhoto: null
    });
    setEditingId(null);
    setShowForm(false);
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const openCount = restaurants.filter((r) => getIsOpen(r.is_open)).length;
  const closedCount = restaurants.filter((r) => !getIsOpen(r.is_open)).length;

  const filteredRestaurants = restaurants.filter((r) => {
    const statusMatch =
      filterStatus === 'all' ||
      (filterStatus === 'open' ? getIsOpen(r.is_open) : !getIsOpen(r.is_open));

    const areaMatch = filterArea === 'all' || r.area_id === Number(filterArea);

    const searchMatch =
      searchQuery === '' ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && areaMatch && searchMatch;
  });
  if (isLoading) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          isDark
            ? 'bg-slate-950'
            : 'bg-gradient-to-br from-slate-50 via-white to-slate-50'
        }`}
      >
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
          <p
            className={`text-sm font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Memuat restoran...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md transition-colors dark:border-slate-700 dark:bg-slate-900/80">
        <div className="px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <a
                href="/dashboard/superadmin"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" />
              </a>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {new Date().toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                  Manajemen Restoran
                </h1>
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              {!showForm && restaurants.length > 0 && (
                <div className="hidden items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800 sm:flex">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`rounded p-2 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white text-blue-600 dark:bg-slate-700 dark:text-blue-400'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`rounded p-2 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-blue-600 dark:bg-slate-700 dark:text-blue-400'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              )}
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:px-4"
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
        <div className="border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900 sm:px-6 lg:px-8">
          <div
            className={`flex items-center gap-3 rounded-lg border p-3 ${
              message.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-900/30'
                : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/30'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            )}
            <p
              className={`flex-1 text-sm font-medium ${
                message.type === 'success'
                  ? 'text-emerald-800 dark:text-emerald-200'
                  : 'text-red-800 dark:text-red-200'
              }`}
            >
              {message.text}
            </p>
            <button
              onClick={() => setMessage(null)}
              className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Search Bar Section */}
      {!showForm && restaurants.length > 0 && (
        <div className="border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-900 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Cari restoran, deskripsi, atau alamat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-2 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 sm:max-w-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Ditemukan: <span className="font-bold text-slate-900 dark:text-white">{filteredRestaurants.length}</span> restoran
            </div>
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
                <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  {/* Header - dengan z-index tinggi */}
                  <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-xl border-b border-slate-200 bg-blue-50 px-4 py-4 dark:border-slate-700 dark:bg-blue-900/30 sm:px-6">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {editingId ? 'Edit Restoran' : 'Tambah Restoran'}
                    </h2>
                    <button
                      onClick={resetForm}
                      className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-5 p-4 sm:p-6">
                    {/* Photo Upload Section */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900 dark:text-white">
                        Foto Restoran{' '}
                        <span className="text-slate-500 font-normal">(Opsional)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          id="photoInput"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormData({
                                ...formData,
                                photoFile: file
                              });
                              // Tampilkan preview
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData((prev) => ({
                                  ...prev,
                                  photoPreview: reader.result as string
                                }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="photoInput"
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-6 cursor-pointer transition-colors hover:border-blue-500 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
                        >
                          <div className="text-center">
                            <svg
                              className="mx-auto mb-2 h-8 w-8 text-slate-400"
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
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                              Klik untuk upload foto
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-500">
                              JPG, PNG, GIF (Max 2MB)
                            </p>
                          </div>
                        </label>
                      </div>

                   {/* Photo Preview - BARU UPLOAD */}
                    {formData.photoPreview && (
                      <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                        <img
                          src={formData.photoPreview}
                          alt="Preview"
                          className="w-full h-40 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              photoFile: null,
                              photoPreview: null
                            });
                            const input = document.getElementById('photoInput') as HTMLInputElement;
                            if (input) input.value = '';
                          }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  {/* Photo Preview - EXISTING PHOTO (saat edit) */}
                    {editingId && !formData.photoPreview && formData.currentPhoto && (
                      <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                        <img
                          src={`${apiUrl}/storage/${formData.currentPhoto}`}
                          alt="Current"
                          className="w-full h-40 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/restaurant.png';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              currentPhoto: null,
                              photoFile: null,
                              photoPreview: null
                            });
                            const input = document.getElementById('photoInput') as HTMLInputElement;
                            if (input) input.value = '';
                          }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-white">
                      Pilih Area{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.area_id}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            area_id: e.target.value
                          })
                        }
                        className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                      >
                        <option value="">
                          -- Pilih Area Restoran --
                        </option>
                        {areas && areas.length > 0 ? (
                          areas.map((area) => (
                            <option
                              key={area.id}
                              value={area.id}
                              className="py-2"
                            >
                              {area.icon} {area.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>
                            Tidak ada area tersedia
                          </option>
                        )}
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                        <svg
                          className="h-5 w-5 text-slate-400 transition-colors dark:text-slate-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </div>
                    </div>
                    {!formData.area_id && (
                      <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2.5 dark:bg-amber-900/20">
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                        <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                          Area harus dipilih sebelum menambah restoran
                        </p>
                      </div>
                    )}
                    {formData.area_id && (
                      <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-2.5 dark:bg-blue-900/20">
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                          Area dipilih:{' '}
                          <span className="font-semibold">
                            {
                              areas.find(
                                (a) =>
                                  a.id === Number(formData.area_id)
                              )?.icon
                            }{' '}
                            {
                              areas.find(
                                (a) =>
                                  a.id === Number(formData.area_id)
                              )?.name
                            }
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-white">
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
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-white">
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
                      className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-white">
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
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>
                <div className="sticky bottom-0 flex gap-2 rounded-b-xl border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800 sm:px-6">
                  <button
                    onClick={resetForm}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.area_id}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
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

        {/* Restaurants List */}
        <div className={showForm ? 'lg:col-span-3' : 'lg:col-span-1'}>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
            {/* Header & Filter Section */}
            <div className="relative border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white px-4 py-5 dark:border-slate-700 dark:from-slate-800/50 dark:to-slate-900 sm:px-6">
              <div className="space-y-5">
                {/* Title & Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-xl bg-blue-500/20 blur-sm dark:bg-blue-500/10"></div>
                      <div className="relative rounded-xl bg-blue-600 p-2.5 shadow-lg shadow-blue-200 dark:bg-blue-600 dark:shadow-none">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                        Daftar Restoran
                      </h2>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Total: {filteredRestaurants.length} restoran
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter Toolbar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {/* Status Segmented Control */}
                  <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100/50 p-1.5 dark:border-slate-700 dark:bg-slate-800/50">
                    <button
                      onClick={() => setFilterStatus('all')}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-all sm:flex-none ${
                        filterStatus === 'all'
                          ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-700 dark:text-white dark:ring-slate-600'
                          : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                      }`}
                    >
                      <span>Semua</span>
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                          filterStatus === 'all'
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
                            : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      >
                        {restaurants.length}
                      </span>
                    </button>

                    <button
                      onClick={() => setFilterStatus('open')}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-all sm:flex-none ${
                        filterStatus === 'open'
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-none'
                          : 'text-slate-500 hover:text-emerald-600 dark:text-slate-400'
                      }`}
                    >
                      <span>Buka</span>
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                          filterStatus === 'open'
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      >
                        {openCount}
                      </span>
                    </button>

                    <button
                      onClick={() => setFilterStatus('closed')}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-all sm:flex-none ${
                        filterStatus === 'closed'
                          ? 'bg-red-500 text-white shadow-lg shadow-red-200 dark:shadow-none'
                          : 'text-slate-500 hover:text-red-600 dark:text-slate-400'
                      }`}
                    >
                      <span>Tutup</span>
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                          filterStatus === 'closed'
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      >
                        {closedCount}
                      </span>
                    </button>
                  </div>

                  {/* Area Selector */}
                  <div className="relative">
                    <select
                      value={filterArea}
                      onChange={(e) => setFilterArea(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-xs font-bold text-slate-700 shadow-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:w-48"
                    >
                      <option value="all">Semua Area</option>
                      {areas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.icon} {area.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="p-4 sm:p-6">
                {isLoadingRestaurants ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
                  </div>
                ) : filteredRestaurants.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredRestaurants.map((restaurant) => {
                      const isOpen = getIsOpen(restaurant.is_open);
                      const isToggling = togglingId === restaurant.id;
                      return (
                        <div
                          key={restaurant.id}
                          className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500/50"
                        >
                          {/* Photo Section */}
                          <div className="relative h-40 overflow-hidden bg-slate-100 dark:bg-slate-700">
                            <img
                              src={
                                restaurant.photo
                                  ? `${apiUrl}/storage/${restaurant.photo}`
                                  : '/restaurant.png'
                              }
                              alt={restaurant.name}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              onError={(e) => {
                                e.currentTarget.src = '/restaurant.png';
                              }}
                            />
                            {/* Status Badge */}
                            <div className="absolute right-3 top-3 flex justify-end">
                              <div
                                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                                  isOpen
                                    ? 'bg-emerald-500/90 text-white'
                                    : 'bg-red-500/90 text-white'
                                }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    isOpen
                                      ? 'animate-pulse bg-emerald-300'
                                      : 'bg-red-300'
                                  }`}
                                />
                                {isOpen ? 'Buka' : 'Tutup'}
                              </div>
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="flex flex-1 flex-col p-4">
                            <h3 className="mb-1 line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                              {restaurant.name}
                            </h3>
                            <p className="mb-2 text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">
                              {restaurant.area?.name}
                            </p>
                            <p className="mb-3 line-clamp-2 min-h-[32px] text-xs text-slate-500 dark:text-slate-400">
                              {restaurant.description}
                            </p>

                            <div className="mb-4 border-t border-slate-100 pt-3 dark:border-slate-700/50">
                              <p className="truncate text-[11px] italic text-slate-400">
                                {restaurant.address}
                              </p>
                            </div>

                            <Link
                              href={`/dashboard/superadmin/restaurants/${restaurant.id}`}
                              className="inline-flex w-full items-center justify-center rounded-lg bg-slate-50 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-blue-600 hover:text-white dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-blue-600"
                            >
                              Lihat Menu ({restaurant.menus_count})
                            </Link>
                          </div>

                          {/* Action Buttons Footer */}
                          <div className="mt-auto flex border-t border-slate-100 bg-slate-50/50 p-1 dark:border-slate-700 dark:bg-slate-800/50">
                            <button
                              onClick={() => handleEdit(restaurant)}
                              className="flex-1 rounded-lg py-2.5 text-[10px] font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400"
                            >
                              Edit
                            </button>
                            <div className="my-2 w-[1px] bg-slate-200 dark:bg-slate-700" />
                            <button
                              onClick={() => handleToggleStatus(restaurant.id)}
                              disabled={isToggling}
                              className={`flex-1 rounded-lg py-2.5 text-[10px] font-bold transition-all disabled:opacity-50 ${
                                isOpen
                                  ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                                  : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                              }`}
                            >
                              {isToggling ? '...' : isOpen ? 'Tutup Toko' : 'Buka Toko'}
                            </button>
                            <div className="my-2 w-[1px] bg-slate-200 dark:bg-slate-700" />
                            <button
                              onClick={() => setDeleteConfirm(restaurant.id)}
                              className="flex-1 rounded-lg py-2.5 text-[10px] font-bold text-slate-500 hover:text-red-600 dark:text-slate-400"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-20 text-center font-medium text-slate-500">
                    Restoran tidak ditemukan
                  </div>
                )}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4 p-4 sm:p-6">
                {isLoadingRestaurants ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : filteredRestaurants.length > 0 ? (
                  filteredRestaurants.map((restaurant) => {
                    const isOpen = getIsOpen(restaurant.is_open);
                    const isToggling = togglingId === restaurant.id;
                    return (
                      <div
                        key={restaurant.id}
                        className="group relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
                      >
                        {/* Photo */}
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-700">
                          <img
                            src={
                              restaurant.photo
                                ? `${apiUrl}/storage/${restaurant.photo}`
                                : '/restaurant.png'
                            }
                            alt={restaurant.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/restaurant.png';
                            }}
                          />
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-3">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                              {restaurant.name}
                            </h3>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                isOpen
                                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                  : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                              }`}
                            >
                              {isOpen ? 'Buka' : 'Tutup'}
                            </span>
                          </div>
                          <p className="mb-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {restaurant.area?.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                            <span className="italic">{restaurant.address}</span>
                            <span className="font-bold text-slate-600 dark:text-slate-300">
                              • {restaurant.menus_count} Menu
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-700 sm:border-0 sm:pt-0">
                          <Link
                            href={`/dashboard/superadmin/restaurants/${restaurant.id}`}
                            className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
                          >
                            Detail
                          </Link>
                          <div className="flex gap-1 rounded-xl bg-slate-50 p-1 dark:bg-slate-700/50">
                            <button
                              onClick={() => handleEdit(restaurant)}
                              className="rounded-lg px-3 py-2 text-xs font-bold text-slate-500 hover:bg-white hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleStatus(restaurant.id)}
                              disabled={isToggling}
                              className={`rounded-lg px-3 py-2 text-xs font-bold hover:bg-white dark:hover:bg-slate-600 ${
                                isOpen ? 'text-amber-600' : 'text-emerald-600'
                              }`}
                            >
                              {isToggling ? '...' : isOpen ? 'Tutup Toko' : 'Buka Toko'}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(restaurant.id)}
                              className="rounded-lg px-3 py-2 text-xs font-bold text-slate-500 hover:bg-white hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-600"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-20 text-center font-medium text-slate-500">
                    Restoran tidak ditemukan
                  </div>
                )}
              </div>
            )}

              {/* Delete Confirmation Modal */}
              {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="w-full max-w-sm rounded-xl bg-white shadow-xl dark:bg-slate-800">
                    <div className="space-y-4 p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          Hapus Restoran?
                        </h3>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Apakah Anda yakin menghapus restoran ini?
                        Tindakan ini tidak dapat dibatalkan.
                      </p>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/50"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() =>
                            deleteConfirm &&
                            handleDelete(deleteConfirm)
                          }
                          className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:hover:bg-red-700"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
