'use client';

import { useState, useEffect } from 'react';
import {
  Loader2,
  Eye,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  RefreshCw,
  X
} from 'lucide-react';

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
  };
}

export default function OrdersPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const itemsPerPage = 10;

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
      fetchOrders();
    };

    checkAuth();
  }, []);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(
        'http://localhost:8000/api/admin/orders',
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
        setOrders(data.data);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.order_code
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.user.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.user.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchStatus =
      filterStatus === '' || order.order_status === filterStatus;
    const matchPayment =
      filterPaymentStatus === '' ||
      order.status === filterPaymentStatus;

    return matchSearch && matchStatus && matchPayment;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-900">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
              Manajemen Pesanan
            </h1>
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

      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* Search & Filter */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          {/* Search */}
          <div className="sm:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari order code, nama, email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="">Semua Status</option>
            <option value="processing">Sedang Proses</option>
            <option value="completed">Selesai</option>
            <option value="canceled">Dibatalkan</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={filterPaymentStatus}
            onChange={(e) => {
              setFilterPaymentStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="">Semua Pembayaran</option>
            <option value="pending">Pending</option>
            <option value="paid">Dibayar</option>
            <option value="canceled">Dibatalkan</option>
          </select>
        </div>

        {/* Results Info */}
        <div className="mb-4 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
          Menampilkan{' '}
          {paginatedOrders.length > 0 ? startIndex + 1 : 0} -{' '}
          {Math.min(startIndex + itemsPerPage, filteredOrders.length)}{' '}
          dari {filteredOrders.length} pesanan
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">
                    Order Code
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">
                    Pembayaran
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">
                    Tanggal
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-white">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {isLoadingOrders ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-500" />
                    </td>
                  </tr>
                ) : paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        #{order.order_code}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {order.user.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {order.user.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                        Rp{' '}
                        {parseInt(order.total_price).toLocaleString(
                          'id-ID'
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            order.order_status === 'processing'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : order.order_status === 'completed'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {order.order_status === 'processing' ? (
                            <Clock className="h-3 w-3" />
                          ) : order.order_status === 'completed' ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          {order.order_status === 'processing'
                            ? 'Proses'
                            : order.order_status === 'completed'
                              ? 'Selesai'
                              : 'Dibatalkan'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            order.status === 'pending'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              : order.status === 'paid'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {order.status === 'pending'
                            ? 'Pending'
                            : order.status === 'paid'
                              ? 'Dibayar'
                              : 'Dibatalkan'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                        {new Date(
                          order.created_at
                        ).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <a
                          href={`/dashboard/admin/orders/${order.id}`}
                          className="inline-flex items-center justify-center rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <AlertCircle className="mx-auto mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
                      <p className="text-slate-600 dark:text-slate-400">
                        Tidak ada pesanan ditemukan
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Halaman {currentPage} dari {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setCurrentPage(Math.max(1, currentPage - 1))
                }
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from(
                { length: totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage(
                    Math.min(totalPages, currentPage + 1)
                  )
                }
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
