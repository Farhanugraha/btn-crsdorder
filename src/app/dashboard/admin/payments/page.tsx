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
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  Filter,
  TrendingUp,
  DollarSign,
  FileText
} from 'lucide-react';

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
  order: {
    id: number;
    order_code: string;
    user_id: number;
    total_price: string;
    status: string;
    created_at: string;
    user: {
      id: number;
      name: string;
      email: string;
      phone: string;
    };
  };
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function StatusBadge({
  status,
  type
}: {
  status: string;
  type: 'payment' | 'order';
}) {
  const base =
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase whitespace-nowrap';

  const paymentStyles: Record<
    string,
    { bg: string; text: string; icon: any }
  > = {
    pending: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-800 dark:text-amber-300',
      icon: Clock
    },
    completed: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-300',
      icon: CheckCircle
    },
    rejected: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-300',
      icon: XCircle
    }
  };

  const orderStyles: Record<
    string,
    { bg: string; text: string; icon: any }
  > = {
    pending: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-800 dark:text-amber-300',
      icon: Clock
    },
    paid: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-300',
      icon: CheckCircle
    }
  };

  const displayStatus =
    status === 'pending'
      ? 'Menunggu'
      : status === 'completed'
        ? 'Terverifikasi'
        : status === 'rejected'
          ? 'Ditolak'
          : status === 'paid'
            ? 'Dibayar'
            : status;

  const styles = type === 'payment' ? paymentStyles : orderStyles;
  const style = styles[status] || paymentStyles.pending;
  const Icon = style.icon;

  return (
    <span className={`${base} ${style.bg} ${style.text}`}>
      <Icon className="h-3.5 w-3.5" />
      {displayStatus}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-3 ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const perPage = 10;

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError(
          '⚠️ Token tidak ditemukan. Silakan login terlebih dahulu.'
        );
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${apiUrl}/api/admin/payments?per_page=100`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      if (data.success && data.data) {
        const paymentsData = Array.isArray(data.data.data)
          ? data.data.data
          : Array.isArray(data.data)
            ? data.data
            : [];

        setPayments(paymentsData);
      } else {
        setError('❌ Gagal memuat data pembayaran');
      }

      setPage(1);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('❌ Gagal memuat pembayaran. Periksa koneksi Anda.');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPayments();
    setIsRefreshing(false);
  };

  const filtered = payments.filter((p) => {
    const hasContent =
      p.transaction_id.toLowerCase().includes(search.toLowerCase()) ||
      p.order.order_code
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      p.order.user.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      p.order.user.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || p.payment_status === statusFilter;

    const paymentDate = new Date(p.created_at)
      .toISOString()
      .split('T')[0];
    const matchesDate = paymentDate === dateFilter;

    return hasContent && matchesStatus && matchesDate;
  });

  const pages = Math.ceil(filtered.length / perPage);
  const data = filtered.slice((page - 1) * perPage, page * perPage);

  // Statistics
  const stats = {
    total: payments.length,
    pending: payments.filter((p) => p.payment_status === 'pending')
      .length,
    completed: payments.filter(
      (p) => p.payment_status === 'completed'
    ).length,
    rejected: payments.filter((p) => p.payment_status === 'rejected')
      .length,
    totalRevenue: payments
      .filter((p) => p.payment_status === 'completed')
      .reduce((sum, p) => sum + parseInt(p.order.total_price), 0)
  };

  const statusOptions = [
    { value: 'pending', label: '⏳ Menunggu Verifikasi' },
    { value: 'completed', label: '✅ Terverifikasi' },
    { value: 'rejected', label: '❌ Ditolak' },
    { value: 'all', label: '📊 Semua Status' }
  ];

  // Loading State
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Memuat data pembayaran...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* PAGE HEADER */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Manajemen Pembayaran
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola, verifikasi, dan pantau semua pembayaran pesanan
            pelanggan dengan mudah
          </p>
        </div>

        {/* STATISTICS */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            icon={FileText}
            label="Total Pembayaran"
            value={stats.total}
            color="bg-blue-600"
          />
          <StatCard
            icon={Clock}
            label="Menunggu Verifikasi"
            value={stats.pending}
            color="bg-amber-600"
          />
          <StatCard
            icon={CheckCircle}
            label="Terverifikasi"
            value={stats.completed}
            color="bg-green-600"
          />
          <StatCard
            icon={XCircle}
            label="Ditolak"
            value={stats.rejected}
            color="bg-red-600"
          />
          <StatCard
            icon={DollarSign}
            label="Total Pendapatan"
            value={`Rp ${stats.totalRevenue.toLocaleString('id-ID')}`}
            color="bg-purple-600"
          />
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

        {/* TOOLBAR */}
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
                placeholder="Cari berdasarkan ID, kode order, nama pelanggan..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400"
              />
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
            title="Refresh data"
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
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filtered.length > 0 ? (
              <>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {filtered.length}
                </span>{' '}
                pembayaran ditemukan
                {filtered.length !== payments.length && (
                  <span className="ml-2 text-xs">
                    (dari {payments.length} total)
                  </span>
                )}
              </>
            ) : (
              <>Tidak ada pembayaran ditemukan</>
            )}
          </div>
          {filtered.length > 0 && (
            <div className="text-xs text-gray-500">
              Menampilkan {(page - 1) * perPage + 1}-
              {Math.min(page * perPage, filtered.length)} dari{' '}
              {filtered.length}
            </div>
          )}
        </div>

        {/* PAYMENTS TABLE - DESKTOP */}
        {data.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto rounded-lg border border-gray-200 shadow-sm dark:border-gray-700 md:block">
              <table className="w-full divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                <thead className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                      ID Transaksi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                      Kode Order
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                      Pelanggan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                      Metode
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                      Jumlah
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {data.map((payment) => (
                    <tr
                      key={payment.id}
                      className="transition-colors hover:bg-blue-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <code className="rounded bg-gray-100 px-2 py-1 font-mono text-xs text-blue-600 dark:bg-gray-700 dark:text-blue-400">
                          {payment.transaction_id.slice(0, 12)}...
                        </code>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        #{payment.order.order_code}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.order.user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {payment.order.user.email}
                          </p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {payment.payment_method === 'bank_transfer'
                            ? 'Transfer'
                            : payment.payment_method === 'credit_card'
                              ? 'Kartu'
                              : payment.payment_method === 'e_wallet'
                                ? 'E-Wallet'
                                : 'QRIS'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                        Rp{' '}
                        {parseInt(
                          payment.order.total_price
                        ).toLocaleString('id-ID')}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <StatusBadge
                          status={payment.payment_status}
                          type="payment"
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(
                          payment.created_at
                        ).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center">
                        <a
                          href={`/dashboard/admin/payments/${payment.id}`}
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">
                            Lihat
                          </span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAYMENTS CARDS - MOBILE */}
            <div className="space-y-4 md:hidden">
              {data.map((payment) => (
                <div
                  key={payment.id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 dark:from-gray-700 dark:to-gray-600">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                          ID Transaksi
                        </p>
                        <code className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                          {payment.transaction_id.slice(0, 20)}
                        </code>
                      </div>
                      <StatusBadge
                        status={payment.payment_status}
                        type="payment"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {payment.order.user.name}
                      </span>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        #{payment.order.order_code}
                      </span>
                    </div>

                    <p className="truncate text-xs text-gray-600 dark:text-gray-400">
                      {payment.order.user.email}
                    </p>

                    <div className="grid grid-cols-2 gap-2 border-t border-gray-200 pt-3 dark:border-gray-700">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Metode
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {payment.payment_method === 'bank_transfer'
                            ? 'Transfer'
                            : payment.payment_method === 'credit_card'
                              ? 'Kartu'
                              : payment.payment_method === 'e_wallet'
                                ? 'E-Wallet'
                                : 'QRIS'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Tanggal
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(
                            payment.created_at
                          ).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        Rp{' '}
                        {parseInt(
                          payment.order.total_price
                        ).toLocaleString('id-ID')}
                      </p>
                      <a
                        href={`/dashboard/admin/payments/${payment.id}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                      >
                        <Eye className="h-4 w-4" />
                        Lihat
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Tidak ada pembayaran ditemukan
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Coba ubah pencarian, filter, atau tanggal
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
                title="Halaman sebelumnya"
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
                title="Halaman berikutnya"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Halaman{' '}
              <span className="font-bold text-gray-900 dark:text-white">
                {page}
              </span>{' '}
              dari{' '}
              <span className="font-bold text-gray-900 dark:text-white">
                {pages}
              </span>
            </div>
          </div>
        )}

        {/* FILTER SECTION - DI AKHIR */}
        <div className="mt-12 border-t-2 border-gray-200 pt-8 dark:border-gray-700">
          <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">
            Filter Pembayaran
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
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  Filter Status Pembayaran
                </div>
              </label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
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
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
