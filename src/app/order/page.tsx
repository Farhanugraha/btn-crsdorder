'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
  Calendar,
  Hourglass,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  id: number;
  menu_id: number;
  quantity: number;
  price: string;
}

interface Order {
  id: number;
  order_code: string;
  user_id: number;
  restaurant_id: number;
  total_price: number;
  status: string;
  order_status: string;
  notes: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

const OrderListPage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('today');
  const [customDate, setCustomDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setMounted(true);
    const today = new Date().toISOString().split('T')[0];
    setCustomDate(today);
  }, []);

  useEffect(() => {
    if (mounted) {
      setCurrentPage(1);
      loadOrders();
    }
  }, [mounted, filterStatus, filterDate, customDate]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('auth_token');

      if (!token) {
        toast.error('Silakan login terlebih dahulu');
        router.push('/auth/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/orders`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session Anda telah berakhir');
          localStorage.removeItem('auth_token');
          router.push('/auth/login');
          return;
        }

        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        setOrders(data.data);
      } else {
        setError('Gagal memuat pesanan');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Gagal mengambil data pesanan');
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 sm:text-sm">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Menunggu Bayar</span>
            <span className="sm:hidden">Menunggu</span>
          </div>
        );
      case 'paid':
        return (
          <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 sm:text-sm">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Dibayar</span>
            <span className="sm:hidden">Bayar</span>
          </div>
        );
      case 'canceled':
        return (
          <div className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800 dark:bg-red-900/30 dark:text-red-300 sm:text-sm">
            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            Batal
          </div>
        );
      default:
        return (
          <div className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-800 dark:bg-slate-700/30 dark:text-slate-300 sm:text-sm">
            {status}
          </div>
        );
    }
  };

  const getOrderStatusBadge = (orderStatus: string) => {
    switch (orderStatus) {
      case 'processing':
        return (
          <div className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 sm:text-sm">
            <Hourglass className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Diproses</span>
            <span className="sm:hidden">Proses</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-300 sm:text-sm">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
            Selesai
          </div>
        );
      case 'canceled':
        return (
          <div className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800 dark:bg-red-900/30 dark:text-red-300 sm:text-sm">
            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            Batal
          </div>
        );
      default:
        return (
          <div className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-800 dark:bg-slate-700/30 dark:text-slate-300 sm:text-sm">
            {orderStatus}
          </div>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredOrders = () => {
    let filtered = orders;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(
        (order) => order.status === filterStatus
      );
    }

    if (filterDate === 'today') {
      const today = new Date().toDateString();
      filtered = filtered.filter((order) => {
        return new Date(order.created_at).toDateString() === today;
      });
    } else if (filterDate === 'custom' && customDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.created_at)
          .toISOString()
          .split('T')[0];
        return orderDate === customDate;
      });
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!mounted || isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-900 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              <ShoppingBag className="h-8 w-8" />
              Pesanan Saya
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Kelola dan pantau semua pesanan Anda di sini
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/')}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </div>

        {/* Filters Section */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          {/* Payment Status Filter */}
          <div className="mb-4 border-b border-slate-200 pb-4 dark:border-slate-700">
            <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Status Pembayaran
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setFilterStatus('all')}
                variant={
                  filterStatus === 'all' ? 'default' : 'outline'
                }
                size="sm"
                className="rounded-full"
              >
                Semua
              </Button>
              <Button
                onClick={() => setFilterStatus('pending')}
                variant={
                  filterStatus === 'pending' ? 'default' : 'outline'
                }
                size="sm"
                className="rounded-full"
              >
                Menunggu Bayar
              </Button>
              <Button
                onClick={() => setFilterStatus('paid')}
                variant={
                  filterStatus === 'paid' ? 'default' : 'outline'
                }
                size="sm"
                className="rounded-full"
              >
                Dibayar
              </Button>
              <Button
                onClick={() => setFilterStatus('canceled')}
                variant={
                  filterStatus === 'canceled' ? 'default' : 'outline'
                }
                size="sm"
                className="rounded-full"
              >
                Dibatalkan
              </Button>
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <Calendar className="h-4 w-4" />
              Tanggal
            </p>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button
                  onClick={() => setFilterDate('today')}
                  variant={
                    filterDate === 'today' ? 'default' : 'outline'
                  }
                  size="sm"
                  className="flex-1 rounded-full"
                >
                  Hari Ini
                </Button>
                <Button
                  onClick={() => setFilterDate('custom')}
                  variant={
                    filterDate === 'custom' ? 'default' : 'outline'
                  }
                  size="sm"
                  className="flex-1 rounded-full"
                >
                  Pilih Tanggal
                </Button>
              </div>
              {filterDate === 'custom' && (
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                />
              )}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {paginatedOrders.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-600 dark:bg-slate-800">
            <ShoppingBag className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
            <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
              Tidak ada pesanan
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {filterStatus !== 'all' || filterDate !== 'today'
                ? 'Coba ubah filter untuk melihat pesanan'
                : 'Mulai pesan sekarang untuk melihat pesanan Anda di sini'}
            </p>
            <Button
              onClick={() => router.push('/areas')}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700"
            >
              Mulai Pesan
            </Button>
          </div>
        )}

        {/* Orders List */}
        {paginatedOrders.length > 0 && (
          <>
            <div className="mb-4 space-y-4">
              {paginatedOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() =>
                    router.push(`/order/${String(order.id)}`)
                  }
                  className="block w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left Content */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <p className="font-mono font-semibold text-slate-900 dark:text-white">
                          {order.order_code}
                        </p>
                        {getPaymentStatusBadge(order.status)}
                        {order.status !== 'pending' &&
                          getOrderStatusBadge(order.order_status)}
                      </div>

                      <p className="mb-2 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                        {order.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )}{' '}
                        item • {formatDate(order.created_at)}
                      </p>

                      {order.notes && (
                        <p className="line-clamp-1 text-xs text-slate-600 dark:text-slate-400">
                          💬 {order.notes}
                        </p>
                      )}
                    </div>

                    {/* Right Content */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                          Total
                        </p>
                        <p className="font-bold text-emerald-600 dark:text-emerald-400 sm:text-lg">
                          Rp{' '}
                          {typeof order.total_price === 'string'
                            ? parseInt(
                                order.total_price
                              ).toLocaleString('id-ID')
                            : order.total_price.toLocaleString(
                                'id-ID'
                              )}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 flex-shrink-0 text-slate-400 dark:text-slate-600" />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 space-y-4">
                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                  Halaman {currentPage} dari {totalPages} • Total{' '}
                  {filteredOrders.length} pesanan
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                  <Button
                    onClick={() =>
                      setCurrentPage((p) => Math.max(p - 1, 1))
                    }
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    ← Sebelumnya
                  </Button>
                  <div className="flex flex-wrap items-center justify-center gap-1">
                    {Array.from(
                      { length: totalPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        variant={
                          currentPage === page ? 'default' : 'outline'
                        }
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(p + 1, totalPages)
                      )
                    }
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Selanjutnya →
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Error State */}
        {error && paginatedOrders.length === 0 && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div>
                <p className="font-semibold text-red-800 dark:text-red-300">
                  {error}
                </p>
                <Button
                  onClick={() => loadOrders()}
                  variant="link"
                  size="sm"
                  className="mt-2 text-red-600 dark:text-red-400"
                >
                  Coba Lagi
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderListPage;
