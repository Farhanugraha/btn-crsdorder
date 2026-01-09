'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  AlertCircle,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import Loading from '@/components/Loading';
import { toast } from 'sonner';

interface MenuItem {
  id: number;
  name: string;
  price: string;
  restaurant_id: number;
}

interface OrderItem {
  id: number;
  order_id: number;
  menu_id: number;
  quantity: number;
  price: string;
  notes: string;
  menu: MenuItem;
}

interface Order {
  id: number;
  order_code: string;
  user_id: number;
  restaurant_id: number;
  total_price: number;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

interface Restaurant {
  id: number;
  name: string;
  address: string;
  phone: string;
  is_open: number;
}

const OrderDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.orderId as string;

  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [restaurants, setRestaurants] = useState<
    Map<number, Restaurant>
  >(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && orderId) {
      loadOrderData();
    }
  }, [mounted, orderId]);

  const loadOrderData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('auth_token');

      if (!token) {
        toast.error('Silakan login terlebih dahulu');
        router.push('/auth/login');
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/orders/${orderId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session Anda telah berakhir');
          localStorage.removeItem('auth_token');
          router.push('/auth/login');
          return;
        }

        if (response.status === 404) {
          setError('Pesanan tidak ditemukan');
          return;
        }

        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        setOrder(data.data);

        // Fetch restaurant data untuk setiap item
        if (data.data.items && data.data.items.length > 0) {
          await fetchRestaurantData(data.data.items, token);
        }
      } else {
        setError('Data pesanan tidak valid');
      }
    } catch (error) {
      console.error('Error loading order:', error);
      setError('Gagal mengambil data pesanan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRestaurantData = async (
    items: OrderItem[],
    token: string
  ) => {
    try {
      const restaurantIds = new Set(
        items.map((item) => item.menu?.restaurant_id)
      );

      const restaurantIdArray = Array.from(restaurantIds);

      for (const restoId of restaurantIdArray) {
        try {
          const response = await fetch(
            `http://localhost:8000/api/restaurants/${restoId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
              }
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              setRestaurants((prev) =>
                new Map(prev).set(restoId, data.data)
              );
            }
          }
        } catch (err) {
          console.error(`Error fetching restaurant ${restoId}:`, err);
        }
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setIsCancelling(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        toast.error('Silakan login terlebih dahulu');
        router.push('/auth/login');
        return;
      }

      if (!order) {
        toast.error('Data pesanan tidak ditemukan');
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/orders/${order.id}/cancel`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session Anda telah berakhir');
          router.push('/auth/login');
          return;
        }
        throw new Error('Failed to cancel order');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Pesanan berhasil dibatalkan');
        setShowCancelDialog(false);

        setTimeout(() => {
          router.push('/order');
        }, 1000);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Gagal membatalkan pesanan');
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            <Clock className="h-4 w-4" />
            Menunggu Pembayaran
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
            <CheckCircle className="h-4 w-4" />
            Dibayar
          </span>
        );
      case 'canceled':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800 dark:bg-red-900/30 dark:text-red-300">
            <AlertCircle className="h-4 w-4" />
            Dibatalkan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-800 dark:bg-slate-700/30 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Group items by restaurant
  const groupedItems = order?.items.reduce(
    (acc, item) => {
      const restoId = item.menu?.restaurant_id || 0;
      if (!acc[restoId]) {
        acc[restoId] = [];
      }
      acc[restoId].push(item);
      return acc;
    },
    {} as Record<number, OrderItem[]>
  );

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loading />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loading />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 dark:bg-slate-900">
        <div className="text-6xl">❌</div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {error || 'Pesanan Tidak Ditemukan'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Order ID: {orderId}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={() => loadOrderData()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Coba Lagi
          </Button>
          <Button
            onClick={() => router.push('/order')}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Kembali ke Pesanan
          </Button>
        </div>
      </div>
    );
  }

  const totalPrice =
    typeof order.total_price === 'string'
      ? parseInt(order.total_price)
      : order.total_price;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-900 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/order')}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                Detail Pesanan
              </h1>
            </div>
          </div>
          {getStatusBadge(order.status)}
        </div>

        {/* Order Code & Info Card */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Nomor Pesanan
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                {order.order_code}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Status
                </p>
                <p className="mt-1 text-sm font-semibold capitalize text-slate-900 dark:text-white">
                  {order.status}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Tanggal Pesan
                </p>
                <p className="mt-1 text-sm text-slate-900 dark:text-white">
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items - Grouped by Restaurant */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            Rincian Pesanan
          </h2>

          <div className="space-y-6">
            {groupedItems &&
              Object.entries(groupedItems).map(([restoId, items]) => {
                const resto = restaurants.get(parseInt(restoId));
                const restoSubtotal = items.reduce(
                  (sum, item) =>
                    sum + parseFloat(item.price) * item.quantity,
                  0
                );

                return (
                  <div
                    key={restoId}
                    className="space-y-3 border-b border-slate-200 pb-4 last:border-b-0 dark:border-slate-700"
                  >
                    {/* Restaurant Header */}
                    {resto && (
                      <div className="rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-3 dark:border-emerald-800 dark:from-emerald-900/20 dark:to-emerald-800/10">
                        <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
                          {resto.name}
                        </h3>
                        {resto.address && (
                          <div className="flex gap-2">
                            <MapPin className="h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {resto.address}
                            </p>
                          </div>
                        )}
                        {resto.phone && (
                          <div className="mt-1 flex gap-2">
                            <Phone className="h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {resto.phone}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Items for this restaurant */}
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between py-2"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 dark:text-white">
                              {item.menu?.name}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Rp{' '}
                              {parseFloat(item.price).toLocaleString(
                                'id-ID'
                              )}{' '}
                              × {item.quantity}
                            </p>
                            {item.notes && (
                              <p className="mt-1 text-xs italic text-blue-600 dark:text-blue-400">
                                💬 {item.notes}
                              </p>
                            )}
                          </div>
                          <p className="ml-2 font-semibold text-slate-900 dark:text-white">
                            Rp{' '}
                            {(
                              parseFloat(item.price) * item.quantity
                            ).toLocaleString('id-ID')}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Subtotal per restaurant */}
                    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          Subtotal
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          Rp {restoSubtotal.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="mb-4 mt-6 rounded-lg border-l-4 border-l-blue-500 bg-blue-50 py-2 pl-3 pr-2 dark:border-l-blue-400 dark:bg-blue-900/20">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Catatan Pesanan
              </p>
              <p className="mt-1 text-sm text-slate-900 dark:text-white">
                {order.notes}
              </p>
            </div>
          )}

          {/* Total */}
          <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
            <div className="flex justify-end">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Total Keseluruhan
                </p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {order.status === 'pending' && (
          <div className="space-y-3">
            <Button
              onClick={() => router.push(`/checkout/${order.id}`)}
              className="w-full bg-emerald-600 py-2 text-sm font-semibold hover:bg-emerald-700 sm:py-3 sm:text-base"
            >
              Lanjut ke Pembayaran
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowCancelDialog(true)}
              className="w-full text-sm sm:text-base"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Batalkan Pesanan
            </Button>
          </div>
        )}

        {order.status === 'paid' && (
          <Button
            onClick={() => router.push('/order')}
            className="w-full bg-blue-600 py-2 text-sm font-semibold hover:bg-blue-700 sm:py-3 sm:text-base"
          >
            Kembali ke Daftar Pesanan
          </Button>
        )}
      </div>

      {/* Cancel Order Dialog */}
      <AlertDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
      >
        <AlertDialogContent className="rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">
              Batalkan Pesanan?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-slate-600 dark:text-slate-400">
              Apakah Anda yakin ingin membatalkan pesanan ini?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-6 rounded-lg border-l-4 border-l-red-600 bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">
              ⚠️ Pesanan {order?.order_code} akan dibatalkan
            </p>
          </div>
          <div className="flex gap-3">
            <AlertDialogCancel className="rounded-lg border-slate-300 dark:border-slate-700">
              Tidak, Lanjutkan
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              {isCancelling ? '⏳ Membatalkan...' : '🗑️ Ya, Batalkan'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrderDetailPage;
