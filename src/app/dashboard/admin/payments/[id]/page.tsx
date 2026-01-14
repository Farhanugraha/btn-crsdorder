'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Mail,
  Phone,
  RefreshCw,
  Check,
  X,
  Save,
  XCircle,
  FileText,
  ShoppingCart,
  MapPin,
  Store
} from 'lucide-react';

interface PaymentItem {
  id: number;
  order_id: number;
  menu_id: number;
  quantity: number;
  price: string;
  notes: string;
  menu: {
    id: number;
    name: string;
    price: string;
    image: string;
  };
}

interface OrderData {
  id: number;
  order_code: string;
  user_id: number;
  restaurant_id: number;
  total_price: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  items: PaymentItem[];
  restaurant?: {
    id: number;
    name: string;
  };
  area?: {
    id: number;
    name: string;
  };
}

interface Payment {
  id: number;
  order_id: number;
  payment_method: string;
  payment_status: string;
  transaction_id: string;
  proof_image: string;
  notes: string | null;
  paid_at: string;
  created_at: string;
  updated_at: string;
  order: OrderData;
}

const API_BASE_URL = 'http://localhost:8000/api';

interface PageParams {
  id: string;
}

export default function PaymentDetailPage({
  params
}: {
  params: PageParams;
}) {
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isLoadingPayment, setIsLoadingPayment] = useState(true);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('auth_user');

        if (!token || !userData) {
          router.push('/auth/login');
          return;
        }

        const parsedUser = JSON.parse(userData);
        if (
          parsedUser.role !== 'admin' &&
          parsedUser.role !== 'superadmin'
        ) {
          router.push('/areas');
          return;
        }

        setIsAuthChecking(false);
        fetchPayment();
      } catch (err) {
        console.error('Auth check error:', err);
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  const fetchPayment = async () => {
    setIsLoadingPayment(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Token tidak ditemukan');
        setIsLoadingPayment(false);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/payments/${params.id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError('Pembayaran tidak ditemukan');
        } else if (response.status === 401) {
          router.push('/auth/login');
          return;
        } else {
          setError(`Error: ${response.status}`);
        }
        setIsLoadingPayment(false);
        return;
      }

      const data = await response.json();

      if (data.success && data.data) {
        const paymentData = data.data;

        if (
          !paymentData.id ||
          !paymentData.order ||
          !paymentData.order.user
        ) {
          setError('Data pembayaran tidak valid');
          setIsLoadingPayment(false);
          return;
        }

        setPayment(paymentData);
        setEditStatus(paymentData.payment_status);
      } else {
        setError(data.message || 'Gagal memuat data pembayaran');
      }
    } catch (err) {
      console.error('Fetch payment error:', err);
      setError('Gagal memuat data pembayaran');
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!payment) {
      setError('Data pembayaran tidak ditemukan');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Token tidak ditemukan');
        setIsSaving(false);
        return;
      }

      const endpoint =
        editStatus === 'completed'
          ? `${API_BASE_URL}/admin/payments/${payment.id}/confirm`
          : `${API_BASE_URL}/admin/payments/${payment.id}/reject`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }
        setError(`Error: ${response.status}`);
        setIsSaving(false);
        return;
      }

      const data = await response.json();

      if (data.success && data.data) {
        setPayment(data.data);
        setEditStatus(data.data.payment_status);
        setIsEditing(false);
      } else {
        setError(data.message || 'Gagal update status');
      }
    } catch (err) {
      console.error('Update status error:', err);
      setError('Gagal update status pembayaran');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPayment();
    setIsRefreshing(false);
  };

  if (isAuthChecking || isLoadingPayment) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Memuat detail pembayaran...
          </p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500 dark:text-red-400" />
          <p className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Pembayaran Tidak Ditemukan
          </p>
          {error && (
            <p className="mb-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const order = payment.order;

  const formatCurrency = (value: string | number): string => {
    return parseInt(String(value)).toLocaleString('id-ID');
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('id-ID', {
      dateStyle: 'long',
      timeStyle: 'short'
    });
  };

  const getPaymentMethodLabel = (method: string): string => {
    const methods: Record<string, string> = {
      qris: 'QRIS',
      bank_transfer: 'Transfer Bank',
      credit_card: 'Kartu Kredit',
      e_wallet: 'E-Wallet'
    };
    return methods[method] || method;
  };

  const getPaymentStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'pending':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPaymentStatusLabel = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'Terverifikasi';
      case 'pending':
        return 'Menunggu Verifikasi';
      case 'rejected':
        return 'Ditolak';
      default:
        return status;
    }
  };

  const getOrderStatusLabel = (status: string): string => {
    switch (status) {
      case 'processing':
        return 'Sedang Diproses';
      case 'completed':
        return 'Selesai';
      case 'paid':
        return 'Dibayar';
      default:
        return status;
    }
  };

  const getOrderStatusColor = (status: string): string => {
    switch (status) {
      case 'processing':
      case 'paid':
        return 'text-blue-600 dark:text-blue-400';
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => router.back()}
                className="flex shrink-0 items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                title="Kembali"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                  Detail Transaksi
                </p>
                <h1 className="truncate text-base font-bold text-gray-900 dark:text-white sm:text-lg">
                  #{payment.transaction_id}
                </h1>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex shrink-0 items-center justify-center rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
              title="Refresh"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-4 lg:col-span-2">
            {/* Status Card */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-200 bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 dark:border-gray-700 dark:from-slate-800 dark:to-slate-900">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Status Pembayaran
                </h2>
              </div>

              <div className="p-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-4 dark:from-gray-700 dark:to-gray-800">
                      <p className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                        Pilih aksi untuk pembayaran ini:
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <button
                          onClick={() => setEditStatus('completed')}
                          className={`rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                            editStatus === 'completed'
                              ? 'bg-green-600 text-white shadow-md dark:bg-green-700'
                              : 'border-2 border-green-200 bg-white text-green-700 hover:bg-green-50 dark:border-green-700 dark:bg-gray-900 dark:text-green-400 dark:hover:bg-green-900/20'
                          }`}
                        >
                          <Check className="mb-1 inline h-4 w-4" />
                          <span className="ml-2">Konfirmasi</span>
                        </button>
                        <button
                          onClick={() => setEditStatus('rejected')}
                          className={`rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                            editStatus === 'rejected'
                              ? 'bg-red-600 text-white shadow-md dark:bg-red-700'
                              : 'border-2 border-red-200 bg-white text-red-700 hover:bg-red-50 dark:border-red-700 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-900/20'
                          }`}
                        >
                          <X className="mb-1 inline h-4 w-4" />
                          <span className="ml-2">Tolak</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateStatus}
                        disabled={isSaving}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-600"
                      >
                        <Save className="h-4 w-4" />
                        {isSaving ? 'Menyimpan...' : 'Simpan'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditStatus(payment.payment_status);
                        }}
                        className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4 dark:from-blue-900/30 dark:to-blue-800/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Status Saat Ini
                        </span>
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${getPaymentStatusColor(
                            payment.payment_status
                          )}`}
                        >
                          {getPaymentStatusIcon(
                            payment.payment_status
                          )}
                          {getPaymentStatusLabel(
                            payment.payment_status
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Metode Pembayaran
                        </p>
                        <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {getPaymentMethodLabel(
                            payment.payment_method
                          )}
                        </p>
                      </div>
                      {payment.paid_at && (
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Waktu Pembayaran
                          </p>
                          <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {formatDate(payment.paid_at)}
                          </p>
                        </div>
                      )}
                    </div>

                    {!isEditing &&
                      payment.payment_status !== 'completed' && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                        >
                          Verifikasi Pembayaran
                        </button>
                      )}
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            {order.items && order.items.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="border-b border-gray-200 bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 dark:border-gray-700 dark:from-slate-800 dark:to-slate-900">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                    <ShoppingCart className="h-5 w-5" />
                    Item Pesanan
                  </h2>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {order.items.map((item, idx) => {
                    const itemTotal =
                      parseInt(item.price) * item.quantity;
                    const unitPrice = parseInt(item.price);
                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                          {idx + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-gray-900 dark:text-gray-100">
                            {item.menu?.name || 'Item'}
                          </p>
                          <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                            <p>
                              Harga Satuan:{' '}
                              <span className="font-medium text-gray-900 dark:text-gray-200">
                                Rp {formatCurrency(unitPrice)}
                              </span>
                            </p>
                            <p>
                              Jumlah:{' '}
                              <span className="font-semibold text-gray-900 dark:text-gray-200">
                                {item.quantity} x
                              </span>
                            </p>
                            {item.notes && (
                              <p className="text-gray-500 dark:text-gray-400">
                                Catatan:{' '}
                                <span className="italic">
                                  {item.notes}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="mb-1 text-xs text-gray-600 dark:text-gray-400">
                            Subtotal
                          </p>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            Rp {formatCurrency(itemTotal)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Proof Image */}
            {payment.proof_image && (
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="border-b border-gray-200 bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 dark:border-gray-700 dark:from-slate-800 dark:to-slate-900">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Bukti Pembayaran
                  </h2>
                </div>
                <div className="p-4">
                  <img
                    src={`http://localhost:8000/storage/${payment.proof_image}`}
                    alt="Bukti Pembayaran"
                    className="w-full rounded-lg object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.alt = 'Gambar tidak dapat dimuat';
                      target.className =
                        'w-full rounded-lg object-cover bg-gray-200 dark:bg-gray-700';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Order Summary Card */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-200 bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 dark:border-gray-700 dark:from-slate-800 dark:to-slate-900">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                  <FileText className="h-5 w-5" />
                  Ringkasan Pesanan
                </h2>
              </div>

              <div className="space-y-4 p-6">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Kode Order
                  </p>
                  <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                    #{order.order_code}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Total Harga
                  </p>
                  <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                    Rp {formatCurrency(order.total_price)}
                  </p>
                </div>

                <div className="space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                  {order.area && (
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Area
                        </p>
                        <p className="mt-1 truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {order.area.name}
                        </p>
                      </div>
                    </div>
                  )}

                  {order.restaurant && (
                    <div className="flex items-start gap-3">
                      <Store className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Restoran
                        </p>
                        <p className="mt-1 truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {order.restaurant.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Status Pesanan
                  </p>
                  <p
                    className={`mt-1 inline-block rounded-lg px-3 py-1 text-sm font-semibold ${getOrderStatusColor(
                      order.status
                    )} bg-blue-50 dark:bg-blue-900/30`}
                  >
                    {getOrderStatusLabel(order.status)}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-200 bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 dark:border-gray-700 dark:from-slate-800 dark:to-slate-900">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                  <User className="h-5 w-5" />
                  Pelanggan
                </h2>
              </div>

              <div className="space-y-4 p-6">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Nama
                  </p>
                  <p className="mt-1 truncate font-semibold text-gray-900 dark:text-gray-100">
                    {order.user.name}
                  </p>
                </div>

                <div>
                  <p className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </p>
                  <p className="mt-1 truncate text-sm text-gray-900 dark:text-gray-100">
                    {order.user.email}
                  </p>
                </div>

                <div>
                  <p className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                    <Phone className="h-3.5 w-3.5" />
                    Telepon
                  </p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                    {order.user.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {(payment.notes || order.notes) && (
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="border-b border-gray-200 bg-gradient-to-r from-blue-100 to-blue-50 px-6 py-4 dark:border-gray-700 dark:from-blue-900/30 dark:to-blue-800/30">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Catatan
                  </h2>
                </div>

                <div className="space-y-3 p-6">
                  {payment.notes && (
                    <div>
                      <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                        Catatan Pembayaran
                      </p>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                        {payment.notes}
                      </p>
                    </div>
                  )}
                  {order.notes && (
                    <div
                      className={
                        payment.notes
                          ? 'border-t border-gray-200 pt-3 dark:border-gray-700'
                          : ''
                      }
                    >
                      <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                        Catatan Pesanan
                      </p>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                        {order.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
