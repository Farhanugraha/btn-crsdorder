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
  List,
  Save,
  XCircle
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
  '🏢', '🍽️', '☕', '🍔', '🥗', '🍜', '🎂', '🥤',
  '🎪', '🛒', '🎮', '🎯', '🎨', '🎭', '🎼', '🏖️'
];

const AreasPage = () => {
  const [user, setUser] = useState<any>(null);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

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
        const sortedAreas = data.data.sort((a: Area, b: Area) => a.order - b.order);
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

      const currentNextOrder = areas.length + 1;

      const submitData = editingId
        ? { ...formData }
        : { ...formData, order: currentNextOrder };

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
          editingId ? 'Area berhasil diperbarui' : 'Area berhasil ditambahkan'
        );
        resetForm();
        fetchAreas();
      } else {
        showMessage('error', result.message || 'Gagal menyimpan area');
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
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-900">
        <div className="relative">
          <Loader2 className="h-14 w-14 animate-spin text-blue-600 dark:text-blue-400" />
          <div className="absolute inset-0 -z-10 rounded-full bg-blue-50 dark:bg-blue-900/10 blur-sm"></div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-lg font-medium text-slate-800 dark:text-slate-200">Memuat halaman</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Harap tunggu sebentar...</p>
        </div>
      </div>
    );
  }

  const nextOrder = areas.length + 1;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/95">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a
                href="/dashboard/superadmin"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </a>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Manajemen Area
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Kelola area dan lokasi bisnis Anda
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!showForm && areas.length > 0 && (
                <div className="hidden items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-700 sm:flex">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`rounded p-2 transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-800'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`rounded p-2 transition-all ${
                      viewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-800'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Tambah Area</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Message Alert */}
        {message && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 shadow-sm ${
                message.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-900/10'
                  : 'border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10'
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
                    ? 'text-emerald-800 dark:text-emerald-300'
                    : 'text-red-800 dark:text-red-300'
                }`}
              >
                {message.text}
              </p>
              <button
                onClick={() => setMessage(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Form Section */}
          {showForm && (
            <div className="lg:w-96 lg:flex-shrink-0">
              <div className="sticky top-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4 dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-600 p-2 text-white">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {editingId ? 'Edit Area' : 'Area Baru'}
                      </h2>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Isi detail area Anda
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetForm}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6 p-6">
                  {/* Icon Selection */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Pilih Icon
                    </label>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                      {EMOJI_PRESETS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon: emoji })}
                          className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 text-2xl transition-all hover:scale-105 ${
                            formData.icon === emoji
                              ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
                              : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4">
                      <input
                        type="text"
                        maxLength={2}
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        placeholder="Masukkan emoji kustom..."
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-center text-2xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Nama Area
                      <span className="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Kantin Utama, Area Meeting, dll."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  {/* Description Input */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Deskripsi
                      <span className="ml-1 text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Jelaskan detail area, fasilitas, atau spesifikasi lainnya..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  {/* Order Info */}
                  {!editingId && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                      <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                        <span className="font-medium">Urutan:</span>
                        <span className="font-bold text-blue-900 dark:text-white">
                          #{nextOrder}
                        </span>
                        <span className="ml-auto text-xs">Otomatis</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 border-t border-slate-100 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/50">
                  <button
                    onClick={resetForm}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <XCircle className="h-4 w-4" />
                    Batal
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.name.trim() || !formData.description.trim()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {editingId ? 'Simpan' : 'Buat Area'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Areas List Section */}
          <div className="flex-1">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 text-white shadow-lg">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Daftar Area
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {areas.length} area terdaftar dalam sistem
                      </p>
                    </div>
                  </div>
                  
                  {areas.length > 0 && !showForm && (
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      <span className="text-blue-600 dark:text-blue-400">{areas.length}</span> total area
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                {isLoadingAreas ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="mb-4 h-12 w-12 animate-spin text-blue-500" />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Memuat data area...
                    </p>
                  </div>
                ) : areas.length > 0 ? (
                  <>
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {areas.map((area) => (
                          <div
                            key={area.id}
                            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-blue-900"
                          >
                            <div className="mb-4 flex items-start justify-between">
                              <div className="text-4xl transition-transform duration-300 group-hover:scale-110">
                                {area.icon}
                              </div>
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                                #{area.order}
                              </span>
                            </div>

                            <h3 className="mb-2 text-base font-bold text-slate-900 dark:text-white">
                              {area.name}
                            </h3>
                            <p className="mb-4 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                              {area.description}
                            </p>

                            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700">
                              <div className="text-xs">
                                <span className="font-medium text-slate-500 dark:text-slate-400">ID:</span>
                                <span className="ml-2 font-mono text-blue-600 dark:text-blue-400">
                                  {area.slug}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(area)}
                                  className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                  title="Edit area"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(area.id)}
                                  className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/30"
                                  title="Hapus area"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {areas.map((area) => (
                          <div
                            key={area.id}
                            className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-700/30"
                          >
                            <div className="text-3xl">{area.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                  {area.name}
                                </h3>
                                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                                  #{area.order}
                                </span>
                              </div>
                              <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-400">
                                {area.description}
                              </p>
                            </div>
                            <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                              <button
                                onClick={() => handleEdit(area)}
                                className="rounded-lg border border-slate-200 bg-white p-2 text-blue-600 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-blue-700"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(area.id)}
                                className="rounded-lg border border-slate-200 bg-white p-2 text-red-600 hover:border-red-300 hover:bg-red-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="mb-6 rounded-full bg-emerald-50 p-6 dark:bg-emerald-900/10">
                      <CheckCircle2 className="h-16 w-16 text-emerald-500" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                      Belum ada area
                    </h3>
                    <p className="mb-6 text-center text-slate-600 dark:text-slate-400">
                      Mulai dengan menambahkan area pertama Anda untuk mengelola lokasi bisnis
                    </p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/30"
                    >
                      <Plus className="h-4 w-4" />
                      Tambah Area Pertama
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-300 rounded-xl bg-white shadow-2xl dark:bg-slate-800">
            <div className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Hapus Area
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Tindakan ini tidak dapat dibatalkan
                  </p>
                </div>
              </div>

              <p className="mb-6 text-sm text-slate-700 dark:text-slate-300">
                Apakah Anda yakin ingin menghapus area ini? Semua data terkait akan dihapus secara permanen.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-red-500/25 transition-all hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:shadow-red-500/30"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreasPage;