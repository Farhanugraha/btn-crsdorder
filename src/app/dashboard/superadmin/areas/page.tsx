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
     <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-900">
      <div className="relative">
        <Loader2 className="h-14 w-14 animate-spin text-blue-600 dark:text-blue-400" />
        {/* Optional: Background circle */}
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* HEADER: Dibuat lebih responsif dan lebar maksimal terjaga */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80">
        <div className="mx-auto max-w-[1600px] px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <a
                href="/dashboard/superadmin"
                className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <ArrowLeft className="h-4 w-4" />
              </a>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {new Date().toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <h1 className="truncate text-lg font-bold text-blue-900 dark:text-white">
                  Manajemen Area
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!showForm && areas.length > 0 && (
                <div className="hidden items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-700 sm:flex">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`rounded p-1.5 transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-800'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`rounded p-1.5 transition-all ${
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
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95"
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

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* ALERT MESSAGES: Ditambahkan animasi slide-down */}
        {message && (
          <div className="mb-6 duration-300 animate-in fade-in slide-in-from-top-4">
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 shadow-sm ${
                message.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-900/10'
                  : 'border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
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
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* FORM SECTION: Menggunakan Flex basis agar ukurannya stabil */}
          {showForm && (
            <aside className="w-full duration-300 animate-in fade-in zoom-in-95 lg:w-[380px] lg:flex-shrink-0">
              <div className="sticky top-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900/20">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    {editingId ? 'Edit Area' : 'Tambah Area Baru'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="rounded-full p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="max-h-[calc(100vh-280px)] space-y-6 overflow-y-auto p-6">
                  {/* Icon Selection */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                      Icon Visual
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {EMOJI_PRESETS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, icon: emoji })
                          }
                          className={`flex aspect-square items-center justify-center rounded-xl border-2 text-2xl transition-all ${
                            formData.icon === emoji
                              ? 'scale-105 border-blue-500 bg-blue-50 shadow-sm dark:border-blue-400 dark:bg-blue-900/30'
                              : 'border-slate-100 bg-white hover:border-slate-200 dark:border-slate-700 dark:bg-slate-900'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-900/50">
                      <span className="text-3xl">
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
                        placeholder="Atau tempel emoji..."
                        className="w-full bg-transparent text-sm focus:outline-none dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Nama Area{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Kantin Utama"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Deskripsi{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Jelaskan detail area..."
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value
                          })
                        }
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                  </div>

                  {!editingId && (
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                      <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                        Area otomatis ditambahkan ke urutan:{' '}
                        <span className="font-bold text-blue-900 dark:text-white">
                          {nextOrder}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 bg-slate-50 p-5 dark:bg-slate-900/50">
                  <button
                    onClick={resetForm}
                    className="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
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
                    className="flex-[2] items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Proses...</span>
                      </div>
                    ) : editingId ? (
                      'Simpan Perubahan'
                    ) : (
                      'Buat Area'
                    )}
                  </button>
                </div>
              </div>
            </aside>
          )}

          {/* LIST SECTION: Fleksibel mengikuti ada tidaknya form */}
          <div className="w-full min-w-0 flex-1">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-blue-600 p-2.5 text-white shadow-lg shadow-blue-200 dark:shadow-none">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-blue-900 dark:text-white">
                      Daftar Area Terdaftar
                    </h2>
                    <p className="text-xs font-medium text-slate-500">
                      Total kapasitas: {areas.length} lokasi aktif
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {isLoadingAreas ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Loader2 className="mb-4 h-12 w-12 animate-spin text-blue-500" />
                    <p className="font-medium">
                      Sinkronisasi data...
                    </p>
                  </div>
                ) : areas.length > 0 ? (
                  <>
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {areas.map((area) => (
                          <div
                            key={area.id}
                            className="group relative flex flex-col rounded-2xl border border-slate-100 bg-white p-5 transition-all hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-blue-900"
                          >
                            <div className="mb-4 text-5xl transition-transform duration-300 group-hover:scale-110">
                              {area.icon}
                            </div>
                            <h3 className="mb-1 line-clamp-1 text-sm font-bold text-slate-900 dark:text-white">
                              {area.name}
                            </h3>
                            <code className="mb-3 block text-[10px] font-bold uppercase tracking-tight text-blue-600 dark:text-blue-400">
                              {area.slug}
                            </code>
                            <p className="mb-4 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                              {area.description}
                            </p>

                            <div className="flex items-center justify-between border-t border-slate-50 pt-4 dark:border-slate-700">
                              <span className="text-[10px] font-bold uppercase text-slate-400">
                                Urutan #{area.order}
                              </span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleEdit(area)}
                                  className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    setDeleteConfirm(area.id)
                                  }
                                  className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/30"
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
                            className="group flex items-center gap-5 rounded-2xl border border-slate-100 p-4 transition-all hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/30"
                          >
                            <div className="text-4xl transition-transform group-hover:scale-110">
                              {area.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                  {area.name}
                                </h3>
                                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-tight text-slate-500 dark:bg-slate-700">
                                  #{area.order}
                                </span>
                              </div>
                              <p className="mt-0.5 truncate text-xs text-slate-500">
                                {area.description}
                              </p>
                            </div>
                            <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                              <button
                                onClick={() => handleEdit(area)}
                                className="rounded-xl border border-slate-200 bg-white p-2 text-blue-600 shadow-sm hover:border-blue-300 dark:border-slate-600 dark:bg-slate-800"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteConfirm(area.id)
                                }
                                className="rounded-xl border border-slate-200 bg-white p-2 text-red-600 shadow-sm hover:border-red-300 dark:border-slate-600 dark:bg-slate-800"
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
                    <div className="mb-4 rounded-full bg-emerald-50 p-6 dark:bg-emerald-900/10">
                      <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Database Area Kosong
                    </h3>
                    <p className="text-sm text-slate-500">
                      Mulai kelola sistem dengan menambahkan area
                      fisik pertama Anda.
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
