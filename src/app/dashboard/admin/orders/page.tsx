'use client';

import { useState, useEffect } from 'react';
import {
  Loader2,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  Building2
} from 'lucide-react';

interface Area {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

interface OrderItem {
  id: number;
  menu_id: number;
  quantity: number;
  price: string;
  notes: string;
  menu: {
    id: number;
    name: string;
    restaurant_id: number;
    restaurant: {
      id: number;
      name: string;
      area_id: number;
      area: Area;
    };
  };
}

interface Order {
  id: number;
  order_code: string;
  user_id: number;
  restaurant_id: number | null;
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
  items: OrderItem[];
  areas: Area[];
}

const API_BASE_URL = 'http://localhost:8000/api';

function StatusBadge({
  status,
  type
}: {
  status: string;
  type: 'order' | 'payment';
}) {
  const base =
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase whitespace-nowrap';

  const orderStyles: Record<
    string,
    { bg: string; text: string; icon: any }
  > = {
    processing: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-300',
      icon: Clock
    },
    completed: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-300',
      icon: CheckCircle
    },
    canceled: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-300',
      icon: XCircle
    }
  };

  const paymentStyles: Record<string, { bg: string; text: string }> =
    {
      pending: {
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        text: 'text-amber-800 dark:text-amber-300'
      },
      paid: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-800 dark:text-green-300'
      },
      canceled: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-800 dark:text-red-300'
      }
    };

  const displayStatus =
    status === 'processing'
      ? 'Menunggu'
      : status === 'completed'
        ? 'Selesai'
        : status === 'pending'
          ? 'Pending'
          : status === 'paid'
            ? 'Dibayar'
            : 'Dibatalkan';

  if (type === 'order') {
    const style = orderStyles[status] || orderStyles.canceled;
    const Icon = style.icon;
    return (
      <span className={`${base} ${style.bg} ${style.text}`}>
        <Icon className="h-3.5 w-3.5" />
        {displayStatus}
      </span>
    );
  }

  const style = paymentStyles[status] || paymentStyles.canceled;
  return (
    <span className={`${base} ${style.bg} ${style.text}`}>
      {displayStatus}
    </span>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<string>('processing');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const perPage = 10;

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    await Promise.all([fetchOrders(), fetchAreas()]);
  };

  const fetchAreas = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/areas`);
      if (!res.ok) throw new Error('Failed to fetch areas');

      const data = await res.json();
      if (data.success && data.data) {
        setAreas(data.data);
      }
    } catch (err) {
      console.error('Error fetching areas:', err);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage?.getItem('auth_token')
          : null;
      if (!token) {
        setError(
          'Token tidak ditemukan. Silakan login terlebih dahulu.'
        );
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Failed to fetch orders');

      const data = await res.json();
      if (data.success && data.data) {
        setOrders(data.data);
      }
      setPage(1);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Gagal memuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders();
    setIsRefreshing(false);
  };

  // Filter: search, status, area, dan date
  const filtered = orders.filter((o) => {
    const hasContent =
      o.order_code.toLowerCase().includes(search.toLowerCase()) ||
      o.user.name.toLowerCase().includes(search.toLowerCase()) ||
      o.user.email.toLowerCase().includes(search.toLowerCase()) ||
      o.items?.some(
        (item) =>
          item.menu?.restaurant?.name
            .toLowerCase()
            .includes(search.toLowerCase())
      );

    const matchesStatus =
      statusFilter === 'all' || o.order_status === statusFilter;

    // Filter berdasarkan area - cek apakah order punya item di area ini
    const matchesArea =
      areaFilter === 'all' ||
      (o.areas &&
        o.areas.some((area) => area.id.toString() === areaFilter));

    const orderDate = new Date(o.created_at)
      .toISOString()
      .split('T')[0];
    const matchesDate = orderDate === dateFilter;

    return (
      o.order_status !== null &&
      hasContent &&
      matchesStatus &&
      matchesArea &&
      matchesDate
    );
  });

  const pages = Math.ceil(filtered.length / perPage);
  const data = filtered.slice((page - 1) * perPage, page * perPage);

  const statusOptions = [
    { value: 'processing', label: 'Menunggu', icon: Clock },
    { value: 'completed', label: 'Selesai', icon: CheckCircle },
    { value: 'canceled', label: 'Dibatalkan', icon: XCircle },
    { value: 'all', label: 'Semua Status', icon: null }
  ];

  // Hitung jumlah order per area untuk badge
  const getAreaOrderCount = (areaId: number) => {
    return orders.filter(
      (o) =>
        o.areas &&
        o.areas.some((area) => area.id === areaId) &&
        o.order_status === statusFilter &&
        new Date(o.created_at).toISOString().split('T')[0] ===
          dateFilter
    ).length;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Memuat pesanan...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* PAGE TITLE */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Pesanan
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Kelola dan pantau semua pesanan pelanggan
          </p>
        </div>

        {/* ERROR ALERT */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="flex-1 text-sm font-medium">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
        )}

        {/* AREA FILTER CHIPS - PRIORITAS PERTAMA */}
        <div className="mb-6">
          <label className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
            <MapPin className="h-5 w-5 text-blue-600" />
            Filter Berdasarkan Area
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setAreaFilter('all');
                setPage(1);
              }}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                areaFilter === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Building2 className="h-4 w-4" />
              Semua Area
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                  areaFilter === 'all'
                    ? 'bg-white/20'
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                {
                  orders.filter(
                    (o) =>
                      o.order_status === statusFilter &&
                      new Date(o.created_at)
                        .toISOString()
                        .split('T')[0] === dateFilter
                  ).length
                }
              </span>
            </button>
            {areas.map((area) => {
              const count = getAreaOrderCount(area.id);
              return (
                <button
                  key={area.id}
                  onClick={() => {
                    setAreaFilter(area.id.toString());
                    setPage(1);
                  }}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                    areaFilter === area.id.toString()
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="text-base">
                    {area.icon || '🏢'}
                  </span>
                  {area.name}
                  {count > 0 && (
                    <span
                      className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                        areaFilter === area.id.toString()
                          ? 'bg-white/20'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* TOOLBAR - SEARCH & REFRESH */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-md flex-1">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari order, nama, email, restaurant..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400"
              />
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
            title="Refresh"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
            <span>Refresh</span>
          </button>
        </div>

        {/* RESULTS INFO */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {filtered.length > 0 ? (
            <>
              Menampilkan {(page - 1) * perPage + 1} -
              {Math.min(page * perPage, filtered.length)} dari{' '}
              {filtered.length} pesanan
              {areaFilter !== 'all' && (
                <span className="ml-1 font-semibold text-blue-600 dark:text-blue-400">
                  di area{' '}
                  {
                    areas.find((a) => a.id.toString() === areaFilter)
                      ?.name
                  }
                </span>
              )}
            </>
          ) : (
            <>Tidak ada pesanan ditemukan</>
          )}
        </div>

        {/* ORDERS TABLE - DESKTOP */}
        {data.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto rounded-lg border border-gray-200 shadow-sm dark:border-gray-700 md:block">
              <table className="w-full divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                <thead className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                      Order Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                      Restaurant / Area
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                      Pelanggan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                      No Telepon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                      Status Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                      Status Pembayaran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {data.map((order) => (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-blue-50 dark:hover:bg-gray-700"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                        #{order.order_code}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          {order.areas && order.areas.length > 0 ? (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {order.areas
                                  .map((a) => a.name)
                                  .join(', ')}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-400">-</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.user.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {order.user.email}
                          </p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {order.user.phone}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {new Date(
                          order.created_at
                        ).toLocaleDateString('id-ID')}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <StatusBadge
                          status={order.order_status}
                          type="order"
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <StatusBadge
                          status={order.status}
                          type="payment"
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                        Rp{' '}
                        {parseInt(order.total_price).toLocaleString(
                          'id-ID'
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <a
                          href={`/dashboard/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                          Detail
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ORDERS CARDS - MOBILE */}
            <div className="space-y-3 md:hidden">
              {data.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border border-blue-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  {/* Order Code */}
                  <div className="mb-3 flex items-center justify-between gap-2 border-b border-blue-200 pb-3 dark:border-gray-700">
                    <span className="truncate font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                      #{order.order_code}
                    </span>
                    <StatusBadge
                      status={order.order_status}
                      type="order"
                    />
                  </div>

                  {/* Area */}
                  <div className="mb-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                    {order.areas && order.areas.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {order.areas.map((a) => a.name).join(', ')}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">-</p>
                    )}
                  </div>

                  {/* Customer Info */}
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {order.user.name}
                    </p>
                    <p className="truncate text-xs text-gray-600 dark:text-gray-400">
                      {order.user.email}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {order.user.phone}
                    </p>
                  </div>

                  {/* Date & Payment */}
                  <div className="mb-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Tanggal:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(
                          order.created_at
                        ).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Order:
                      </span>
                      <StatusBadge
                        status={order.order_status}
                        type="order"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Pembayaran:
                      </span>
                      <StatusBadge
                        status={order.status}
                        type="payment"
                      />
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex items-center justify-between gap-3 border-t border-blue-200 pt-3 dark:border-gray-700">
                    <p className="text-base font-bold text-gray-900 dark:text-white">
                      Rp{' '}
                      {parseInt(order.total_price).toLocaleString(
                        'id-ID'
                      )}
                    </p>
                    <a
                      href={`/dashboard/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                    >
                      <Eye className="h-4 w-4" />
                      Lihat
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Tidak ada pesanan ditemukan
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {areaFilter !== 'all'
                ? `Tidak ada pesanan di area ${areas.find(
                    (a) => a.id.toString() === areaFilter
                  )?.name} untuk tanggal ini`
                : 'Coba ubah pencarian atau filter'}
            </p>
          </div>
        )}
        {/* PAGINATION */}
        {pages > 1 && (
          <div className="mt-8 flex flex-col items-center justify-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                title="Previous page"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex flex-wrap items-center justify-center gap-1">
                {pages <= 5 ? (
                  Array.from({ length: pages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`h-10 w-10 rounded-lg text-sm font-semibold transition-colors ${
                          page === p
                            ? 'bg-blue-600 text-white dark:bg-blue-700'
                            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )
                ) : (
                  <>
                    {[1, page, pages]
                      .filter((p, i, arr) => arr.indexOf(p) === i)
                      .map((p, i, arr) => (
                        <div key={p}>
                          {i > 0 && arr[i - 1] + 1 < p && (
                            <span className="px-2 text-gray-400 dark:text-gray-600">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() => setPage(p)}
                            className={`h-10 w-10 rounded-lg text-sm font-semibold transition-colors ${
                              page === p
                                ? 'bg-blue-600 text-white dark:bg-blue-700'
                                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                          >
                            {p}
                          </button>
                        </div>
                      ))}
                  </>
                )}
              </div>

              <button
                disabled={page === pages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                title="Next page"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Halaman {page} dari {pages}
            </div>
          </div>
        )}

        {/* FILTER SECTION - DI AKHIR */}
        <div className="mt-12 border-t-2 border-gray-200 pt-8 dark:border-gray-700">
          <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">
            Filter Pesanan
          </h3>
          <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {/* Date Filter */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  Filter Tanggal
                </div>
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setPage(1);
                }}
                max={new Date().toISOString().split('T')[0]}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="mb-4 block text-sm font-semibold text-gray-900 dark:text-white">
                Filter Status Pesanan
              </label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        setStatusFilter(option.value);
                        setPage(1);
                      }}
                      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                        statusFilter === option.value
                          ? 'bg-blue-600 text-white shadow-md dark:bg-blue-700'
                          : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
