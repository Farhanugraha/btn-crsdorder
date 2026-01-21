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
  MapPin,
  X,
  Grid3X3,
  List
} from 'lucide-react';

interface Area {
  id: number;
  name: string;
  description: string;
  icon: string;
  order: number;
  slug: string;
  created_at: string;
}

interface FormData {
  name: string;
  description: string;
  icon: string;
}

const EMOJI_PRESETS = [
  '🏢',
  '🍽️',
  '☕',
  '🍔',
  '🥗',
  '🍜',
  '🎂',
  '🥤'
];

export default function AreasPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    icon: '🏢'
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(
    null
  );

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
    fetchAreas();
  };

  const fetchAreas = async () => {
    setIsLoadingAreas(true);
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(`${apiUrl}/api/areas`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        const sortedAreas = data.data.sort(
          (a: Area, b: Area) => a.order - b.order
        );
        setAreas(sortedAreas);
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
      showMessage('error', 'Gagal memuat data area');
    } finally {
      setIsLoadingAreas(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      showMessage('error', 'Nama dan deskripsi harus diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage?.getItem('auth_token');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `${apiUrl}/api/areas/${editingId}`
        : `${apiUrl}/api/areas`;

      const submitData = editingId
        ? { ...formData }
        : { ...formData, order: areas.length };

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();

      if (result.success) {
        showMessage(
          'success',
          editingId
            ? 'Area berhasil diperbarui'
            : 'Area berhasil ditambahkan'
        );
        resetForm();
        fetchAreas();
      } else {
        showMessage(
          'error',
          result.message || 'Gagal menyimpan area'
        );
      }
    } catch (error) {
      console.error('Error submitting:', error);
      showMessage('error', 'Terjadi kesalahan saat menyimpan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (area: Area) => {
    setFormData({
      name: area.name,
      description: area.description,
      icon: area.icon
    });
    setEditingId(area.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(`${apiUrl}/api/areas/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (result.success) {
        showMessage('success', 'Area berhasil dihapus');
        fetchAreas();
      } else {
        showMessage('error', 'Gagal menghapus area');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      showMessage('error', 'Terjadi kesalahan saat menghapus');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', icon: '🏢' });
    setEditingId(null);
    setShowForm(false);
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-900">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const nextOrder = areas.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80">
        <div className="px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <a
                href="/dashboard/superadmin"
                className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
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
                <h1 className="truncate text-lg font-bold text-slate-900 dark:text-white">
                  Manajemen Area
                </h1>
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              {!showForm && areas.length > 0 && (
                <div className="hidden items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-700 sm:flex">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`rounded p-2 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-400'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                    title="Grid View"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`rounded p-2 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-400'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                    title="List View"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              )}
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex flex-shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 sm:px-4"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    Tambah Area
                  </span>
                </button>
              )}
            </div>
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
              <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                {/* Form Header */}
                <div className="sticky top-0 flex items-center justify-between rounded-t-xl border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-4 dark:border-slate-700 dark:from-blue-900/20 dark:to-blue-800/20 sm:px-6">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {editingId ? 'Edit Area' : 'Tambah Area'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Form Content */}
                <div className="space-y-5 p-4 sm:p-6">
                  {/* Icon Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                      Pilih Icon
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {EMOJI_PRESETS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() =>
                            setFormData({ ...formData, icon: emoji })
                          }
                          className={`flex aspect-square w-full items-center justify-center rounded-lg border-2 text-2xl font-medium transition-all ${
                            formData.icon === emoji
                              ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                              : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:hover:border-slate-500'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 dark:bg-slate-700/50">
                      <span className="text-2xl font-medium">
                        {formData.icon}
                      </span>
                      <input
                        type="text"
                        maxLength={2}
                        value={formData.icon}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            icon: e.target.value
                          })
                        }
                        placeholder="Atau paste emoji"
                        className="flex-1 bg-transparent text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none dark:text-slate-300 dark:placeholder-slate-500"
                      />
                    </div>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                      Nama Area{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Kantin Lantai 1"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-400"
                    />
                  </div>

                  {/* Description Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                      Deskripsi{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Jelaskan area ini..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value
                        })
                      }
                      rows={3}
                      className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-400"
                    />
                  </div>

                  {/* Auto Order Info */}
                  {!editingId && (
                    <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                      <p className="text-xs font-medium text-blue-800 dark:text-blue-300">
                        Area ini akan ditambahkan di urutan ke{' '}
                        <span className="font-bold">{nextOrder}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="sticky bottom-0 flex gap-2 rounded-b-xl border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-700 sm:px-6">
                  <button
                    onClick={resetForm}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={
                      isSubmitting ||
                      !formData.name.trim() ||
                      !formData.description.trim()
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
                      'Perbarui'
                    ) : (
                      'Tambah'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Areas List */}
          <div
            className={`${
              showForm ? 'lg:col-span-3' : 'lg:col-span-1'
            }`}
          >
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
              {/* Header */}
              <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-4 dark:border-slate-700 dark:from-blue-900/20 dark:to-blue-800/20 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-200 p-2 dark:bg-blue-900/30">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Daftar Area
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Total: {areas.length} area
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="p-4 sm:p-6">
                  {isLoadingAreas ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    </div>
                  ) : areas.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {areas.map((area) => (
                        <div
                          key={area.id}
                          className="flex flex-col rounded-xl border border-slate-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md dark:border-slate-700 dark:hover:border-blue-600 dark:hover:bg-slate-700/50"
                        >
                          <div className="mb-3 text-5xl leading-none">
                            {area.icon}
                          </div>
                          <h3 className="mb-1 line-clamp-2 text-sm font-bold text-slate-900 dark:text-white">
                            {area.name}
                          </h3>
                          <p className="mb-2 line-clamp-1 text-xs text-slate-600 dark:text-slate-400">
                            {area.slug}
                          </p>
                          <p className="mb-3 line-clamp-2 flex-1 text-xs text-slate-600 dark:text-slate-300">
                            {area.description}
                          </p>
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1 text-xs">
                              <span className="rounded bg-slate-100 px-2 py-1 font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                Urutan: {area.order}
                              </span>
                              <span className="rounded bg-slate-100 px-2 py-1 font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                {new Date(
                                  area.created_at
                                ).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: '2-digit'
                                })}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(area)}
                                className="flex-1 rounded-lg p-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteConfirm(area.id)
                                }
                                className="flex-1 rounded-lg p-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
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
                      <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Tidak ada area
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Tambahkan area pertama Anda sekarang
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {isLoadingAreas ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    </div>
                  ) : areas.length > 0 ? (
                    areas.map((area) => (
                      <div
                        key={area.id}
                        className="flex items-start gap-4 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 sm:p-6"
                      >
                        <div className="flex-shrink-0 text-4xl">
                          {area.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                            {area.name}
                          </h3>
                          <p className="mb-2 truncate text-sm text-slate-500 dark:text-slate-400">
                            {area.slug}
                          </p>
                          <p className="mb-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                            {area.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-block rounded bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                              Urutan: {area.order}
                            </span>
                            <span className="inline-block rounded bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                              {new Date(
                                area.created_at
                              ).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-shrink-0 gap-2">
                          <button
                            onClick={() => handleEdit(area)}
                            className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(area.id)}
                            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Tidak ada area
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Tambahkan area pertama Anda sekarang
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
          <div className="w-full max-w-sm rounded-xl bg-white shadow-xl dark:bg-slate-800">
            <div className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Hapus Area?
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Apakah Anda yakin menghapus area ini? Tindakan ini
                tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
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
