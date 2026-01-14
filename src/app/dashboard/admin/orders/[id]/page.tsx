'use client';

import { useState, useEffect } from 'react';
import {
  Loader2,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  MapPin,
  Clock,
  DollarSign,
  Package,
  CheckCircle2,
  Circle,
  PrinterIcon
} from 'lucide-react';

interface OrderItem {
  id: number;
  order_id: number;
  menu_id: number;
  quantity: number;
  price: string;
  notes: string;
  is_checked: boolean;
  menu: {
    id: number;
    name: string;
    price: string;
    image: string;
  };
}

interface Order {
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
    divisi?: string;
    unit_kerja?: string;
  };
  items: OrderItem[];
}

export default function OrderDetailPage({
  params
}: {
  params: { id: string };
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isTogglingCheck, setIsTogglingCheck] = useState<
    number | null
  >(null);

  useEffect(() => {
    const checkAuth = () => {
      const token =
        typeof window !== 'undefined'
          ? localStorage?.getItem('auth_token')
          : null;
      const userData =
        typeof window !== 'undefined'
          ? localStorage?.getItem('auth_user')
          : null;

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

      setIsLoading(false);
      fetchOrder();
    };

    checkAuth();
  }, []);

  const fetchOrder = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage?.getItem('auth_token')
          : null;
      if (!token) return;

      const response = await fetch(
        `http://localhost:8000/api/admin/orders/${params.id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.data) {
        setOrder(data.data);
      } else {
        setError('Data pesanan tidak ditemukan');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Gagal memuat data pesanan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrder();
    setIsRefreshing(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleItemCheck = async (itemId: number) => {
    setIsTogglingCheck(itemId);
    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage?.getItem('auth_token')
          : null;
      if (!token) return;

      const response = await fetch(
        `http://localhost:8000/api/admin/orders/${params.id}/items/${itemId}/toggle-check`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        await fetchOrder();
      }
    } catch (error) {
      console.error('Error toggling item check:', error);
    } finally {
      setIsTogglingCheck(null);
    }
  };

  const allItemsChecked =
    order?.items &&
    order.items.length > 0 &&
    order.items.every((item) => item.is_checked);

  const handleCompleteOrder = async () => {
    if (!allItemsChecked) {
      setSubmitError('Mohon centang semua item terlebih dahulu');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage?.getItem('auth_token')
          : null;
      if (!token) return;

      const response = await fetch(
        `http://localhost:8000/api/admin/orders/${order?.id}/status`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            order_status: 'completed'
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        await fetchOrder();
      } else {
        setSubmitError(data.message || 'Gagal menyelesaikan pesanan');
      }
    } catch (error) {
      console.error('Error completing order:', error);
      setSubmitError(
        'Gagal menyelesaikan pesanan. Silakan coba lagi.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Memuat detail pesanan...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-600" />
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Pesanan tidak ditemukan
          </p>
          {error && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<
      string,
      { bg: string; text: string; label: string }
    > = {
      pending: {
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        text: 'text-amber-800 dark:text-amber-300',
        label: 'Menunggu Pembayaran'
      },
      paid: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-800 dark:text-green-300',
        label: 'Pembayaran Diterima'
      },
      processing: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-800 dark:text-blue-300',
        label: 'Sedang Diproses'
      },
      completed: {
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        text: 'text-emerald-800 dark:text-emerald-300',
        label: 'Selesai'
      },
      canceled: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-800 dark:text-red-300',
        label: 'Dibatalkan'
      }
    };

    const style = styles[status] || styles.pending;
    return { ...style };
  };

  const paymentBadge = getStatusBadge(order.status);
  const orderBadge = getStatusBadge(order.order_status);

  const formatCurrency = (amount: string | number) => {
    return `Rp ${parseInt(String(amount)).toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b-2 border-blue-600 bg-white shadow-sm dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              <a
                href="/dashboard/admin/orders"
                className="flex flex-shrink-0 items-center justify-center rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Kembali"
              >
                <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-400 sm:h-5 sm:w-5" />
              </a>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                  Pesanan #
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-base font-bold text-gray-900 dark:text-white sm:text-xl lg:text-2xl">
                    {order.order_code}
                  </h1>
                  <button
                    onClick={() => copyToClipboard(order.order_code)}
                    className="flex-shrink-0 rounded-lg p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Salin nomor pesanan"
                  >
                    {copiedCode ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center justify-center rounded-lg bg-blue-600 p-2 text-white transition-all hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
                title="Refresh data"
              >
                <RefreshCw
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${
                    isRefreshing ? 'animate-spin' : ''
                  }`}
                />
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center rounded-lg bg-gray-200 p-2 text-gray-700 transition-all hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                title="Cetak pesanan"
              >
                <PrinterIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8">
        {/* Status Overview */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
          {/* Payment Status */}
          <div
            className={`rounded-lg border-2 p-4 sm:rounded-xl sm:p-6 ${paymentBadge.bg}`}
          >
            <div className="mb-2 flex items-start justify-between">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${paymentBadge.text}`}
              >
                💳 Status Pembayaran
              </span>
            </div>
            <p
              className={`text-base font-bold sm:text-lg ${paymentBadge.text}`}
            >
              {paymentBadge.label}
            </p>
            <p className="mt-2 text-xs opacity-70">
              Terakhir diperbarui:{' '}
              {new Date(order.updated_at).toLocaleTimeString('id-ID')}
            </p>
          </div>

          {/* Order Status */}
          <div
            className={`rounded-lg border-2 p-4 sm:rounded-xl sm:p-6 ${orderBadge.bg}`}
          >
            <div className="mb-2 flex items-start justify-between">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${orderBadge.text}`}
              >
                📦 Status Pesanan
              </span>
            </div>
            <p
              className={`text-base font-bold sm:text-lg ${orderBadge.text}`}
            >
              {orderBadge.label}
            </p>
            <p className="mt-2 text-xs opacity-70">
              Dibuat: {formatDate(order.created_at).split(',')[0]}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Order Items dengan Checklist */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:rounded-xl sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div>
                  <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white sm:text-lg">
                    <Package className="h-4 w-4 flex-shrink-0 text-blue-600 sm:h-5 sm:w-5" />
                    Menu Pesanan
                  </h2>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                    {order.items?.length || 0} item(s) -{' '}
                    {order.items?.filter((item) => item.is_checked)
                      .length || 0}{' '}
                    pesanan diselesaikan
                  </p>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {order.items && order.items.length > 0 ? (
                  <>
                    {order.items.map((item) => {
                      const isChecked = item.is_checked || false;
                      const isLoading = isTogglingCheck === item.id;
                      return (
                        <div
                          key={item.id}
                          className="overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-700/50"
                        >
                          {/* Item Header dengan Checkbox */}
                          <div
                            className={`flex cursor-pointer items-center justify-between gap-2 p-3 sm:p-4 ${
                              isChecked
                                ? 'bg-emerald-50 dark:bg-emerald-900/20'
                                : ''
                            }`}
                          >
                            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                              <button
                                onClick={() =>
                                  toggleItemCheck(item.id)
                                }
                                disabled={isLoading}
                                className="flex-shrink-0 rounded-lg p-1 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-700"
                              >
                                {isLoading ? (
                                  <Loader2 className="h-5 w-5 animate-spin text-blue-600 sm:h-6 sm:w-6" />
                                ) : isChecked ? (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-600 sm:h-6 sm:w-6" />
                                ) : (
                                  <Circle className="h-5 w-5 text-gray-400 sm:h-6 sm:w-6" />
                                )}
                              </button>
                              <span className="flex-shrink-0 whitespace-nowrap rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 sm:text-sm">
                                x{item.quantity}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p
                                  className={`truncate text-sm font-semibold sm:text-base ${
                                    isChecked
                                      ? 'text-emerald-700 line-through dark:text-emerald-300'
                                      : 'text-gray-900 dark:text-white'
                                  }`}
                                >
                                  {item.menu?.name || 'Item'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                                  Rp{' '}
                                  {parseInt(
                                    item.price
                                  ).toLocaleString('id-ID')}{' '}
                                  / item
                                </p>
                              </div>
                            </div>
                            <div className="ml-2 flex flex-shrink-0 items-center gap-2">
                              <p className="min-w-fit text-right text-xs font-bold text-gray-900 dark:text-white sm:text-sm">
                                {formatCurrency(
                                  parseInt(item.price) * item.quantity
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Item Notes */}
                          {item.notes && (
                            <div className="border-t border-gray-200 bg-blue-50 px-3 py-3 dark:border-gray-700 dark:bg-blue-900/20 sm:px-4 sm:py-3">
                              <p className="mb-1 text-xs font-semibold uppercase text-blue-900 dark:text-blue-300">
                                📝 Catatan Item
                              </p>
                              <p className="break-words text-xs text-blue-800 dark:text-blue-200 sm:text-sm">
                                {item.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Total */}
                    <div className="mt-4 flex flex-col gap-2 rounded-lg border-t-2 border-gray-200 bg-gradient-to-r from-blue-50 to-blue-50 p-4 dark:border-gray-700 dark:from-blue-900/20 dark:to-blue-900/20 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-base font-bold text-gray-900 dark:text-white sm:text-lg">
                        Total Pesanan:
                      </span>
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400 sm:text-2xl">
                        {formatCurrency(order.total_price)}
                      </span>
                    </div>

                    {/* Complete Order Button */}
                    {order.order_status === 'processing' &&
                      order.status === 'paid' && (
                        <div className="mt-6 space-y-3">
                          {submitError && (
                            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" />
                              <p className="text-xs text-red-800 dark:text-red-300 sm:text-sm">
                                {submitError}
                              </p>
                            </div>
                          )}
                          <button
                            onClick={handleCompleteOrder}
                            disabled={
                              !allItemsChecked || isSubmitting
                            }
                            className={`w-full rounded-lg px-4 py-3 font-semibold text-white transition-all sm:rounded-xl ${
                              allItemsChecked && !isSubmitting
                                ? 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600'
                                : 'cursor-not-allowed bg-gray-400 dark:bg-gray-600'
                            }`}
                          >
                            {isSubmitting ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Memproses...
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-2">
                                <Check className="h-4 w-4" />
                                Selesaikan Pesanan
                              </span>
                            )}
                          </button>
                          <p className="text-center text-xs text-gray-600 dark:text-gray-400">
                            {allItemsChecked
                              ? 'Semua item sudah dicek. Klik tombol di atas untuk menyelesaikan pesanan.'
                              : `Centang ${
                                  order.items?.filter(
                                    (item) => !item.is_checked
                                  ).length || 0
                                } item lagi`}
                          </p>
                        </div>
                      )}
                  </>
                ) : (
                  <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                    <Package className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p className="text-sm">
                      Tidak ada item dalam pesanan ini
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Special Notes */}
            {order.notes && (
              <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20 sm:rounded-xl sm:p-6">
                <p className="mb-3 flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-300 sm:text-sm">
                  <span>📋</span> Catatan Pesanan
                </p>
                <p className="whitespace-pre-wrap break-words text-xs leading-relaxed text-purple-800 dark:text-purple-200 sm:text-sm">
                  {order.notes}
                </p>
              </div>
            )}

            {/* Customer Info */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:rounded-xl sm:p-6">
              <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white sm:text-lg">
                <MapPin className="h-4 w-4 flex-shrink-0 text-green-600 sm:h-5 sm:w-5" />
                Informasi Pemesan
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div className="sm:col-span-2">
                  <p className="mb-1 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                    Nama
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                    {order.user.name}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                    Divisi
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                    {order.user.divisi || '-'}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                    Unit Kerja
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                    {order.user.unit_kerja || '-'}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="mb-1 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                    Telepon
                  </p>
                  <a
                    href={`tel:${order.user.phone}`}
                    className="break-all text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400 sm:text-base"
                  >
                    {order.user.phone}
                  </a>
                </div>
                <div className="sm:col-span-2">
                  <p className="mb-1 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <a
                    href={`mailto:${order.user.email}`}
                    className="break-all text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400 sm:text-base"
                  >
                    {order.user.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* Order Summary */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:rounded-xl sm:p-6">
                <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 sm:text-sm">
                  <DollarSign className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
                  Ringkasan
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Total Item
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {order.items?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Item Dicek
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {order.items?.filter((item) => item.is_checked)
                        .length || 0}
                      /{order.items?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal
                    </span>
                    <span className="ml-1 break-words text-right font-bold text-gray-900 dark:text-white">
                      {formatCurrency(order.total_price)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white sm:text-sm">
                      Total Akhir
                    </span>
                    <span className="ml-1 break-words text-right text-base font-bold text-blue-600 dark:text-blue-400 sm:text-lg">
                      {formatCurrency(order.total_price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:rounded-xl sm:p-6">
                <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 sm:text-sm">
                  <Clock className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
                  Timeline
                </h3>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Dibuat
                    </p>
                    <p className="mt-1 break-words text-xs font-semibold text-gray-900 dark:text-white sm:text-sm">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Terakhir Diupdate
                    </p>
                    <p className="mt-1 break-words text-xs font-semibold text-gray-900 dark:text-white sm:text-sm">
                      {formatDate(order.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
