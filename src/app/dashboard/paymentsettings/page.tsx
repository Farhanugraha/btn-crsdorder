'use client';

import { useState, useEffect } from 'react';
import {
  Loader2,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  X,
  Upload,
  CreditCard,
  Building2,
  QrCode,
  Save,
  Trash2,
  Eye,
  EyeOff,
  Check,
  XCircle
} from 'lucide-react';

interface PaymentSettings {
  id: number;
  qris_title: string;
  qris_image: string | null;
  qris_image_url: string | null;
  qris_active: boolean;
  bank_name: string;
  account_number: string;
  account_name: string;
  bank_active: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface FormData {
  qris_title: string;
  qris_active: boolean;
  bank_name: string;
  account_number: string;
  account_name: string;
  bank_active: boolean;
  active: boolean;
  qris_image_file?: File | null;
  qris_image_preview?: string | null;
}

export default function PaymentSettingsPage() {
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  const [settings, setSettings] = useState<PaymentSettings | null>(
    null
  );
  const [formData, setFormData] = useState<FormData>({
    qris_title: 'QRIS Pembayaran',
    qris_active: true,
    bank_name: '',
    account_number: '',
    account_name: '',
    bank_active: true,
    active: true
  });

  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    null
  );
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const checkDarkMode = () => {
      const hasDark =
        document.documentElement.classList.contains('dark');
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
      await fetchPaymentSettings();
    } catch (error) {
      console.error('Auth Error:', error);
      window.location.href = '/auth/login';
    }
  };

  const fetchPaymentSettings = async () => {
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(
        `${apiUrl}/api/superadmin/payment-settings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch payment settings');
      }

      const data = await response.json();

      if (data.success && data.data) {
        setSettings(data.data);
        setFormData({
          qris_title: data.data.qris_title || 'QRIS Pembayaran',
          qris_active: data.data.qris_active || true,
          bank_name: data.data.bank_name || '',
          account_number: data.data.account_number || '',
          account_name: data.data.account_name || '',
          bank_active: data.data.bank_active || true,
          active: data.data.active || true,
          qris_image_preview: data.data.qris_image_url
        });
        setImagePreview(data.data.qris_image_url);
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      showMessage('error', 'Gagal memuat pengaturan pembayaran');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/gif'
    ];
    if (!validTypes.includes(file.type)) {
      showMessage(
        'error',
        'Format file tidak valid. Gunakan JPG, PNG, atau GIF.'
      );
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showMessage('error', 'Ukuran file maksimal 2MB.');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setFormData((prev) => ({
        ...prev,
        qris_image_file: file,
        qris_image_preview: reader.result as string
      }));
    };
    reader.readAsDataURL(file);

    // Auto-upload
    await uploadQrisImage(file);
  };

  const uploadQrisImage = async (file: File) => {
    setIsUploading(true);
    try {
      const token = localStorage?.getItem('auth_token');
      const formData = new FormData();
      formData.append('qris_image', file);

      const response = await fetch(
        `${apiUrl}/api/superadmin/payment-settings/upload-qris`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Gambar QRIS berhasil diunggah');
        await fetchPaymentSettings(); // Refresh data
      } else {
        showMessage(
          'error',
          data.message || 'Gagal mengunggah gambar'
        );
      }
    } catch (error) {
      console.error('Error uploading QRIS image:', error);
      showMessage(
        'error',
        'Terjadi kesalahan saat mengunggah gambar'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const deleteQrisImage = async () => {
    try {
      const token = localStorage?.getItem('auth_token');
      const response = await fetch(
        `${apiUrl}/api/superadmin/payment-settings/delete-qris`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Gambar QRIS berhasil dihapus');
        setImagePreview(null);
        setFormData((prev) => ({
          ...prev,
          qris_image_preview: null,
          qris_image_file: null
        }));
        await fetchPaymentSettings(); // Refresh data
      } else {
        showMessage(
          'error',
          data.message || 'Gagal menghapus gambar'
        );
      }
    } catch (error) {
      console.error('Error deleting QRIS image:', error);
      showMessage('error', 'Terjadi kesalahan saat menghapus gambar');
    } finally {
      setDeleteConfirm(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage?.getItem('auth_token');

      const response = await fetch(
        `${apiUrl}/api/superadmin/payment-settings`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            qris_title: formData.qris_title,
            qris_active: formData.qris_active,
            bank_name: formData.bank_name,
            account_number: formData.account_number,
            account_name: formData.account_name,
            bank_active: formData.bank_active,
            active: formData.active
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        showMessage(
          'success',
          'Pengaturan pembayaran berhasil diperbarui'
        );
        await fetchPaymentSettings(); // Refresh data
      } else {
        showMessage(
          'error',
          data.message || 'Gagal menyimpan pengaturan'
        );
      }
    } catch (error) {
      console.error('Error saving payment settings:', error);
      showMessage(
        'error',
        'Terjadi kesalahan saat menyimpan pengaturan'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const showMessage = (
    type: 'success' | 'error' | 'info',
    text: string
  ) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <CreditCard className="h-8 w-8 animate-pulse text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Memuat Pengaturan Pembayaran
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Sedang mengambil data pengaturan...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md transition-colors dark:border-slate-700 dark:bg-slate-900/80">
        <div className="px-3 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              <a
                href="/dashboard/superadmin"
                className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 sm:h-9 sm:w-9"
              >
                <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </a>
              <div className="min-w-0">
                <p className="hidden text-xs font-medium text-slate-500 dark:text-slate-400 sm:block">
                  {new Date().toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <h1 className="text-sm font-bold text-blue-900 dark:text-white sm:text-lg">
                  Pengaturan Pembayaran
                </h1>
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">
                      Menyimpan...
                    </span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      Simpan Perubahan
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Alert Messages */}
      {message && (
        <div className="border-b border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900 sm:px-6 lg:px-8">
          <div
            className={`flex items-center gap-2 rounded-lg border p-2 sm:gap-3 sm:p-3 ${
              message.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-900/30'
                : message.type === 'error'
                  ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/30'
                  : 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/30'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400 sm:h-5 sm:w-5" />
            ) : message.type === 'error' ? (
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400 sm:h-5 sm:w-5" />
            ) : (
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400 sm:h-5 sm:w-5" />
            )}
            <p
              className={`flex-1 text-xs font-medium sm:text-sm ${
                message.type === 'success'
                  ? 'text-emerald-800 dark:text-emerald-200'
                  : message.type === 'error'
                    ? 'text-red-800 dark:text-red-200'
                    : 'text-blue-800 dark:text-blue-200'
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

      {/* Main Content */}
      <main className="px-4 py-6 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* QRIS Settings Card */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
              {/* Card Header */}
              <div className="relative border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white px-4 py-5 dark:border-slate-700 dark:from-slate-800/50 dark:to-slate-900 sm:px-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-xl bg-green-500/20 blur-sm dark:bg-green-500/10"></div>
                    <div className="relative rounded-xl bg-green-600 p-2.5 shadow-lg shadow-green-200 dark:bg-green-600 dark:shadow-none">
                      <QrCode className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                      QRIS Settings
                    </h2>
                    <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                      Atur metode pembayaran QRIS
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="space-y-6 p-4 sm:p-6">
                {/* Status Toggle */}
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        formData.qris_active
                          ? 'animate-pulse bg-green-500'
                          : 'bg-red-500'
                      }`}
                    ></div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Aktifkan QRIS
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formData.qris_active
                          ? 'QRIS aktif untuk pembayaran'
                          : 'QRIS dinonaktifkan'}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      name="qris_active"
                      checked={formData.qris_active}
                      onChange={handleInputChange}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-slate-700 dark:after:border-slate-600"></div>
                  </label>
                </div>

                {/* QRIS Title */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900 dark:text-white">
                    Judul QRIS
                  </label>
                  <input
                    type="text"
                    name="qris_title"
                    value={formData.qris_title}
                    onChange={handleInputChange}
                    placeholder="Contoh: QRIS BTN Food"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>

                {/* QRIS Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900 dark:text-white">
                    Gambar QR Code
                  </label>
                  <div className="space-y-4">
                    {/* Current Image Preview */}
                    {imagePreview && (
                      <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                        <div className="flex flex-col items-center gap-4 sm:flex-row">
                          <div className="flex-shrink-0">
                            <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-slate-300 dark:border-slate-600">
                              <img
                                src={imagePreview}
                                alt="QRIS Preview"
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    '/qris-placeholder.png';
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex-1 text-center sm:text-left">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              Gambar QRIS Saat Ini
                            </p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              Gambar akan ditampilkan di halaman
                              checkout
                            </p>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirm(true)}
                              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Hapus Gambar
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Upload Area */}
                    <div className="relative">
                      <input
                        type="file"
                        id="qrisImage"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                      <label
                        htmlFor="qrisImage"
                        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 transition-colors hover:border-blue-500 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 ${
                          isUploading ? 'opacity-50' : ''
                        }`}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mb-2 h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                              Mengunggah...
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="mb-2 h-8 w-8 text-slate-400" />
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                              Klik untuk upload gambar QR Code
                            </p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                              Format: JPG, PNG, GIF • Maks: 2MB
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Transfer Settings Card */}
          <div className="lg:col-span-1">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
              {/* Card Header */}
              <div className="relative border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white px-4 py-5 dark:border-slate-700 dark:from-slate-800/50 dark:to-slate-900 sm:px-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-xl bg-blue-500/20 blur-sm dark:bg-blue-500/10"></div>
                    <div className="relative rounded-xl bg-blue-600 p-2.5 shadow-lg shadow-blue-200 dark:bg-blue-600 dark:shadow-none">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                      Bank Transfer
                    </h2>
                    <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                      Atur metode transfer bank
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="space-y-6 p-4 sm:p-6">
                {/* Status Toggle */}
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        formData.bank_active
                          ? 'animate-pulse bg-green-500'
                          : 'bg-red-500'
                      }`}
                    ></div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Aktifkan Transfer Bank
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formData.bank_active
                          ? 'Transfer bank aktif'
                          : 'Transfer bank dinonaktifkan'}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      name="bank_active"
                      checked={formData.bank_active}
                      onChange={handleInputChange}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-slate-700 dark:after:border-slate-600"></div>
                  </label>
                </div>

                {/* Bank Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900 dark:text-white">
                    Nama Bank
                  </label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleInputChange}
                    placeholder="Contoh: Bank Tabungan Negara"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Account Number */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900 dark:text-white">
                    Nomor Rekening
                  </label>
                  <div className="relative">
                    <input
                      type={showAccountNumber ? 'text' : 'password'}
                      name="account_number"
                      value={formData.account_number}
                      onChange={handleInputChange}
                      placeholder="1234567890"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowAccountNumber(!showAccountNumber)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showAccountNumber ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Account Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900 dark:text-white">
                    Nama Pemilik Rekening
                  </label>
                  <input
                    type="text"
                    name="account_name"
                    value={formData.account_name}
                    onChange={handleInputChange}
                    placeholder="Contoh: CRSD BTN"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Global Settings Card */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
              {/* Card Header */}
              <div className="relative border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white px-4 py-5 dark:border-slate-700 dark:from-slate-800/50 dark:to-slate-900 sm:px-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-xl bg-purple-500/20 blur-sm dark:bg-purple-500/10"></div>
                    <div className="relative rounded-xl bg-purple-600 p-2.5 shadow-lg shadow-purple-200 dark:bg-purple-600 dark:shadow-none">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                      Pengaturan Global
                    </h2>
                    <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                      Atur sistem pembayaran keseluruhan
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        formData.active
                          ? 'animate-pulse bg-green-500'
                          : 'bg-red-500'
                      }`}
                    ></div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Sistem Pembayaran Aktif
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formData.active
                          ? 'Semua pembayaran aktif'
                          : 'Sistem pembayaran dinonaktifkan'}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-slate-700 dark:after:border-slate-600"></div>
                  </label>
                </div>
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
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Hapus Gambar QRIS?
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Apakah Anda yakin menghapus gambar QRIS ini? Tindakan
                ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/50"
                >
                  Batal
                </button>
                <button
                  onClick={deleteQrisImage}
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
  );
}
