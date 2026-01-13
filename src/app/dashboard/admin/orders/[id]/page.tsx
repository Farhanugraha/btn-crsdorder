'use client';

import { useState, useEffect } from 'react';
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
  Save
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
  order_status: string;
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

export default function PaymentDetailPage({
  params
}: {
  params: { id: string };
}) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('auth_user');

      if (!token || !userData) {
        window.location.href = '/auth/login';
        return;
      }

      const parsedUser = JSON.parse(userData);
      if (
        parsedUser.role !== 'admin' &&
        parsedUser.role !== 'superadmin'
      ) {
        window.location.href = '/areas';
        return;
      }

      setUser(parsedUser);
      setIsLoading(false);
      fetchPayment();
    };

    checkAuth();
  }, []);

  const fetchPayment = async () => {
    setIsLoadingPayment(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(
        `http://localhost:8000/api/admin/payments/${params.id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      if (data.success && data.data) {
        setPayment(data.data);
        setEditStatus(data.data.payment_status);
      }
    } catch (error) {
      console.error('Error fetching payment:', error);
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const handleUpdateStatus = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const endpoint =
        editStatus === 'completed'
          ? `http://localhost:8000/api/admin/payments/${params.id}/confirm`
          : `http://localhost:8000/api/admin/payments/${params.id}/reject`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setPayment(data.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating payment:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPayment();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-900">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-900">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            Pembayaran tidak ditemukan
          </p>
        </div>
      </div>
    );
  }

  const order = payment.order;
  const getPaymentMethodLabel = (method: string) => {
    const methods: any = {
      qris: 'QRIS',
      bank_transfer: 'Transfer Bank',
      credit_card: 'Kartu Kredit',
      e_wallet: 'E-Wallet'
    };
    return methods[method] || method;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <a
                href="/dashboard/admin/payments"
                className="flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              </a>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                Pembayaran #{payment.transaction_id}
              </h1>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center justify-center rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600 sm:px-4 sm:py-2"
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

      <main className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
        <div className="grid gap-6">
          {/* Payment Status Card */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Status Pembayaran
              </h2>
              {!isEditing &&
                payment.payment_status !== 'completed' && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                  >
                    Verifikasi
                  </button>
                )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-700/50">
                  <p className="mb-3 text-sm font-medium text-slate-900 dark:text-white">
                    Pilih aksi:
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditStatus('completed')}
                      className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        editStatus === 'completed'
                          ? 'bg-green-600 text-white'
                          : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <Check className="mr-1 inline h-4 w-4" />
                      Konfirmasi
                    </button>
                    <button
                      onClick={() => setEditStatus('rejected')}
                      className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        editStatus === 'rejected'
                          ? 'bg-red-600 text-white'
                          : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <X className="mr-1 inline h-4 w-4" />
                      Tolak
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateStatus}
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-600"
                  >
                    <Save className="h-4 w-4" />
                    Simpan
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditStatus(payment.payment_status);
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Status Pembayaran
                  </span>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                      payment.payment_status === 'completed'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : payment.payment_status === 'pending'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {payment.payment_status === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                    {payment.payment_status === 'completed'
                      ? 'Terverifikasi'
                      : payment.payment_status === 'pending'
                        ? 'Pending'
                        : 'Ditolak'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Metode Pembayaran
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {getPaymentMethodLabel(payment.payment_method)}
                  </span>
                </div>
                {payment.paid_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Waktu Pembayaran
                    </span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {new Date(payment.paid_at).toLocaleDateString(
                        'id-ID',
                        { dateStyle: 'full', timeStyle: 'short' }
                      )}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Info */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
              Informasi Pesanan
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Order Code
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  #{order.order_code}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Total Harga
                </span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  Rp{' '}
                  {parseInt(order.total_price).toLocaleString(
                    'id-ID'
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Status Pesanan
                </span>
                <span
                  className={`text-sm font-semibold ${
                    order.order_status === 'processing'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}
                >
                  {order.order_status === 'processing'
                    ? 'Sedang Diproses'
                    : 'Selesai'}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
              Informasi Pelanggan
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Nama
                  </p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {order.user.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Email
                  </p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {order.user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Nomor Telepon
                  </p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {order.user.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
              Item Pesanan
            </h2>
            <div className="space-y-3">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-700/50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {item.menu?.name || 'Item'}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Qty: {item.quantity}
                        {item.notes && ` • ${item.notes}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Rp{' '}
                        {parseInt(item.price).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tidak ada item
                </p>
              )}
            </div>
          </div>

          {/* Proof Image */}
          {payment.proof_image && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                📷 Bukti Pembayaran
              </h2>
              <div className="overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700">
                <img
                  src={`http://localhost:8000/storage/${payment.proof_image}`}
                  alt="Bukti Pembayaran"
                  className="max-h-96 w-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          {(payment.notes || order.notes) && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
              <p className="mb-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                Catatan
              </p>
              {payment.notes && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Catatan Pembayaran:
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    {payment.notes}
                  </p>
                </div>
              )}
              {order.notes && (
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Catatan Pesanan:
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    {order.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
