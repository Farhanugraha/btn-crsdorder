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
  FileText,
  MoreVertical
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

// Helper function untuk format currency
function formatCurrency(amount: number) {
  if (amount >= 1000000000) {
    return `Rp ${(amount / 1000000000).toFixed(1)}M`;
  }
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1)}jt`;
  }
  if (amount >= 1000) {
    return `Rp ${(amount / 1000).toFixed(0)}k`;
  }
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

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

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
        setError('⚠️ Token tidak ditemukan. Silakan login terlebih dahulu.');
        setLoading(false);
        return;
      }

      const res = await fetch(`${apiUrl}/api/admin/payments?per_page=100`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });

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

  // Fungsi untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Fungsi untuk memeriksa apakah tanggal pembayaran sesuai dengan filter
  const checkDateFilter = (paymentDateStr: string) => {
    const paymentDate = new Date(paymentDateStr).toISOString().split('T')[0];
    
    // Jika ada dateFilter (filter tanggal spesifik)
    if (dateFilter) {
      return paymentDate === dateFilter;
    }
    
    // Jika ada dateRange (filter rentang tanggal)
    if (dateRange.start || dateRange.end) {
      const paymentDateObj = new Date(paymentDate);
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;
      
      if (startDate && endDate) {
        return paymentDateObj >= startDate && paymentDateObj <= endDate;
      } else if (startDate) {
        return paymentDateObj >= startDate;
      } else if (endDate) {
        return paymentDateObj <= endDate;
      }
    }
    
    // Jika tidak ada filter tanggal, return true
    return true;
  };

  const filtered = payments.filter((p) => {
    // Filter berdasarkan pencarian
    const hasContent =
      p.transaction_id.toLowerCase().includes(search.toLowerCase()) ||
      p.order.order_code.toLowerCase().includes(search.toLowerCase()) ||
      p.order.user.name.toLowerCase().includes(search.toLowerCase()) ||
      p.order.user.email.toLowerCase().includes(search.toLowerCase());

    // Filter berdasarkan status
    const matchesStatus =
      statusFilter === 'all' || p.payment_status === statusFilter;

    // Filter berdasarkan tanggal
    const matchesDate = checkDateFilter(p.created_at);

    return hasContent && matchesStatus && matchesDate;
  });

  const pages = Math.ceil(filtered.length / perPage);
  const data = filtered.slice((page - 1) * perPage, page * perPage);

  // Statistics
  const stats = {
    total: payments.length,
    pending: payments.filter((p) => p.payment_status === 'pending').length,
    completed: payments.filter((p) => p.payment_status === 'completed').length,
    rejected: payments.filter((p) => p.payment_status === 'rejected').length,
    totalRevenue: payments
      .filter((p) => p.payment_status === 'completed')
      .reduce((sum, p) => sum + parseInt(p.order.total_price), 0)
  };

  const statusOptions = [
    { value: 'pending', label: 'Menunggu', shortLabel: 'Pending', icon: Clock, color: 'text-amber-600' },
    { value: 'completed', label: 'Terverifikasi', shortLabel: 'Verified', icon: CheckCircle, color: 'text-green-600' },
    { value: 'rejected', label: 'Ditolak', shortLabel: 'Rejected', icon: XCircle, color: 'text-red-600' },
    { value: 'all', label: 'Semua Status', shortLabel: 'All', icon: FileText, color: 'text-blue-600' }
  ];

  // Loading State
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-900">
        <div className="relative">
          <Loader2 className="h-14 w-14 animate-spin text-blue-600 dark:text-blue-400" />
          <div className="absolute inset-0 -z-10 rounded-full bg-blue-50 dark:bg-blue-900/10 blur-sm"></div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-lg font-medium text-slate-800 dark:text-slate-200">Memuat halaman</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Harap tunggu sebentar...</p>
        </div>
      </div>
    );
  }

  // Handler untuk filter hari ini
  const handleTodayFilter = () => {
    const today = getTodayDate();
    setDateFilter(today);
    setDateRange({ start: '', end: '' });
    setPage(1);
  };

  // Handler untuk reset semua filter
  const handleResetFilters = () => {
    setDateFilter('');
    setDateRange({ start: '', end: '' });
    setStatusFilter('all');
    setSearch('');
    setPage(1);
    setShowMobileFilters(false);
  };

  // Cek apakah ada filter aktif
  const hasActiveFilters = dateFilter || dateRange.start || dateRange.end || statusFilter !== 'all' || search;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="mx-auto px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
        {/* HEADER SECTION */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 shadow-lg lg:p-3">
                <FileText className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white lg:text-2xl">
                  Manajemen Pembayaran
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 lg:text-sm">
                  Kelola semua pembayaran pesanan pelanggan
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition-all hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
                >
                  <span>Reset Filter</span>
                </button>
              )}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition-all hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 lg:px-4 lg:py-2.5 lg:text-sm"
                title="Refresh data"
              >
                <RefreshCw className={`h-3.5 w-3.5 lg:h-4 lg:w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              
              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="rounded-lg bg-gray-100 p-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 lg:hidden"
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* STATISTICS SECTION */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:mb-8 lg:grid-cols-4 lg:gap-6">
          {/* Total Pembayaran */}
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 lg:text-sm">Total Pembayaran</p>
                <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white lg:mt-2 lg:text-3xl">{stats.total}</p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 p-2 dark:from-blue-900/30 dark:to-blue-800/30 lg:p-3">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400 lg:h-6 lg:w-6" />
              </div>
            </div>
            <div className="mt-2 text-[10px] text-gray-500 dark:text-gray-400 lg:mt-4 lg:text-xs">
              Semua jenis pembayaran
            </div>
          </div>

          {/* Menunggu Verifikasi */}
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 lg:text-sm">Menunggu Verifikasi</p>
                <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white lg:mt-2 lg:text-3xl">{stats.pending}</p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 p-2 dark:from-amber-900/30 dark:to-amber-800/30 lg:p-3">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 lg:h-6 lg:w-6" />
              </div>
            </div>
            <div className="mt-2 text-[10px] text-gray-500 dark:text-gray-400 lg:mt-4 lg:text-xs">
              Butuh tindakan segera
            </div>
          </div>

          {/* Terverifikasi */}
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 lg:text-sm">Terverifikasi</p>
                <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white lg:mt-2 lg:text-3xl">{stats.completed}</p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 p-2 dark:from-emerald-900/30 dark:to-emerald-800/30 lg:p-3">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 lg:h-6 lg:w-6" />
              </div>
            </div>
            <div className="mt-2 text-[10px] text-gray-500 dark:text-gray-400 lg:mt-4 lg:text-xs">
              Pembayaran sukses
            </div>
          </div>

          {/* Total Pendapatan */}
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 lg:text-sm">Total Pendapatan</p>
                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white lg:mt-2 lg:text-2xl">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 lg:text-xs">
                  Rp {stats.totalRevenue.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 p-2 dark:from-purple-900/30 dark:to-purple-800/30 lg:p-3">
                <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400 lg:h-6 lg:w-6" />
              </div>
            </div>
            <div className="mt-2 text-[10px] text-gray-500 dark:text-gray-400 lg:mt-4 lg:text-xs">
              Dari {stats.completed} transaksi
            </div>
          </div>
        </div>

        {/* ERROR ALERT */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 lg:p-4">
            <AlertCircle className="h-4 w-4 shrink-0 lg:h-5 lg:w-5" />
            <p className="flex-1 font-medium">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
        )}

        {/* MOBILE FILTERS OVERLAY */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setShowMobileFilters(false)}>
            <div className="fixed bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-6 dark:bg-gray-800" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filter</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
              
              {/* Mobile Status Filter */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
                  Status Pembayaran
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setStatusFilter(option.value);
                          setPage(1);
                        }}
                        className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-all ${
                          statusFilter === option.value
                            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                            : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${option.color}`} />
                        <span className="text-xs font-medium">{option.shortLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Date Filter */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
                  Filter Tanggal
                </label>
                <div className="space-y-3">
                  {/* Button Hari Ini */}
                  <button
                    onClick={() => {
                      handleTodayFilter();
                      setShowMobileFilters(false);
                    }}
                    className={`w-full rounded-lg py-2.5 text-sm font-medium transition-all ${
                      dateFilter === getTodayDate()
                        ? 'bg-blue-600 text-white dark:bg-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    Hari Ini
                  </button>
                  
                  <div className="space-y-2">
                    <div>
                      <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Dari Tanggal</label>
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => {
                          setDateRange({ ...dateRange, start: e.target.value });
                          setDateFilter('');
                          setPage(1);
                        }}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Sampai Tanggal</label>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => {
                          setDateRange({ ...dateRange, end: e.target.value });
                          setDateFilter('');
                          setPage(1);
                        }}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {/* SEARCH BAR */}
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari transaksi, kode order, atau nama pelanggan..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400"
              />
            </div>
          </div>

          {/* DESKTOP FILTERS */}
          <div className="hidden border-b border-gray-200 px-6 py-4 dark:border-gray-700 lg:block">
            <div className="flex flex-wrap items-center gap-4">
              {/* STATUS FILTER */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <div className="flex rounded-lg border border-gray-300 bg-white p-0.5 dark:border-gray-600 dark:bg-gray-700">
                  {statusOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setStatusFilter(option.value);
                          setPage(1);
                        }}
                        className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                          statusFilter === option.value
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${option.color}`} />
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DATE FILTERS */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <button
                  onClick={handleTodayFilter}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    dateFilter === getTodayDate()
                      ? 'bg-blue-600 text-white shadow-md dark:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Hari Ini
                </button>
                
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => {
                      setDateRange({ ...dateRange, start: e.target.value });
                      setDateFilter('');
                      setPage(1);
                    }}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Dari"
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <span className="text-gray-400 dark:text-gray-500">-</span>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => {
                      setDateRange({ ...dateRange, end: e.target.value });
                      setDateFilter('');
                      setPage(1);
                    }}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Sampai"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RESULTS INFO */}
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filtered.length > 0 ? (
                  <>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {filtered.length}
                    </span>{' '}
                    pembayaran ditemukan
                    {(dateFilter || dateRange.start || dateRange.end) && (
                      <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                        (difilter berdasarkan tanggal)
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    Tidak ada pembayaran ditemukan
                    {hasActiveFilters && (
                      <span className="ml-2 text-xs text-red-600 dark:text-red-400">
                        (coba ubah filter)
                      </span>
                    )}
                  </>
                )}
              </div>
              {filtered.length > 0 && (
                <div className="text-xs text-gray-500">
                  Halaman {page} dari {pages}
                </div>
              )}
            </div>
          </div>

          {/* PAYMENTS CONTENT */}
          {data.length > 0 ? (
            <>
              {/* MOBILE VIEW - Cards */}
              <div className="space-y-3 p-4 sm:hidden">
                {data.map((payment) => (
                  <div
                    key={payment.id}
                    className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="border-b border-gray-100 p-3 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            #{payment.order.order_code}
                          </p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {payment.transaction_id.slice(0, 12)}...
                          </p>
                        </div>
                        <StatusBadge status={payment.payment_status} type="payment" />
                      </div>
                    </div>
                    
                    <div className="p-3">
                      {/* Customer Info */}
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {payment.order.user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {payment.order.user.email}
                        </p>
                      </div>
                      
                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Metode</p>
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
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Tanggal</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {new Date(payment.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      {/* Amount & Action */}
                      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Jumlah</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            Rp {parseInt(payment.order.total_price).toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`/dashboard/admin/payments/${payment.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Lihat
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP VIEW - Table */}
              <div className="hidden overflow-x-auto p-0 sm:block">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Transaksi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Pelanggan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Metode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Jumlah
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {data.map((payment) => (
                      <tr
                        key={payment.id}
                        className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              #{payment.order.order_code}
                            </p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {payment.transaction_id.slice(0, 12)}...
                            </p>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
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
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            {payment.payment_method === 'bank_transfer'
                              ? 'Transfer Bank'
                              : payment.payment_method === 'credit_card'
                                ? 'Kartu Kredit'
                                : payment.payment_method === 'e_wallet'
                                  ? 'E-Wallet'
                                  : 'QRIS'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            Rp {parseInt(payment.order.total_price).toLocaleString('id-ID')}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <StatusBadge status={payment.payment_status} type="payment" />
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(payment.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-2">
                            <a
                              href={`/dashboard/admin/payments/${payment.id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-all hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Detail
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="p-8 text-center sm:p-12">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 sm:h-16 sm:w-16">
                <AlertCircle className="h-6 w-6 text-gray-400 dark:text-gray-500 sm:h-8 sm:w-8" />
              </div>
              <p className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                Tidak ada pembayaran ditemukan
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:mt-2">
                {hasActiveFilters 
                  ? 'Coba ubah filter pencarian Anda' 
                  : 'Belum ada data pembayaran'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Reset Filter
                </button>
              )}
            </div>
          )}

          {/* PAGINATION */}
          {pages > 1 && (
            <div className="border-t border-gray-200 px-4 py-4 dark:border-gray-700 sm:px-6">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                <div className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                  Menampilkan {(page - 1) * perPage + 1} - {Math.min(page * perPage, filtered.length)} dari {filtered.length}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="flex items-center justify-center rounded-lg border border-gray-300 bg-white p-1.5 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:p-2"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                  
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    {(() => {
                      const buttons = [];
                      const maxVisible = window.innerWidth < 640 ? 3 : 5;
                      
                      if (pages <= maxVisible) {
                        for (let i = 1; i <= pages; i++) {
                          buttons.push(
                            <button
                              key={i}
                              onClick={() => setPage(i)}
                              className={`h-7 w-7 rounded-lg text-xs font-medium transition-colors sm:h-8 sm:w-8 sm:text-sm ${
                                page === i
                                  ? 'bg-blue-600 text-white dark:bg-blue-700'
                                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                              }`}
                            >
                              {i}
                            </button>
                          );
                        }
                      } else {
                        // First page
                        buttons.push(
                          <button
                            key={1}
                            onClick={() => setPage(1)}
                            className={`h-7 w-7 rounded-lg text-xs font-medium transition-colors sm:h-8 sm:w-8 sm:text-sm ${
                              page === 1
                                ? 'bg-blue-600 text-white dark:bg-blue-700'
                                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                          >
                            1
                          </button>
                        );

                        // Ellipsis if needed
                        if (page > 3) {
                          buttons.push(
                            <span key="ellipsis1" className="px-1 text-gray-400 dark:text-gray-600">
                              ...
                            </span>
                          );
                        }

                        // Current page and neighbors
                        const start = Math.max(2, page - 1);
                        const end = Math.min(pages - 1, page + 1);
                        
                        for (let i = start; i <= end; i++) {
                          if (i !== 1 && i !== pages) {
                            buttons.push(
                              <button
                                key={i}
                                onClick={() => setPage(i)}
                                className={`h-7 w-7 rounded-lg text-xs font-medium transition-colors sm:h-8 sm:w-8 sm:text-sm ${
                                  page === i
                                    ? 'bg-blue-600 text-white dark:bg-blue-700'
                                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                }`}
                              >
                                {i}
                              </button>
                            );
                          }
                        }

                        // Ellipsis if needed
                        if (page < pages - 2) {
                          buttons.push(
                            <span key="ellipsis2" className="px-1 text-gray-400 dark:text-gray-600">
                              ...
                            </span>
                          );
                        }

                        // Last page
                        buttons.push(
                          <button
                            key={pages}
                            onClick={() => setPage(pages)}
                            className={`h-7 w-7 rounded-lg text-xs font-medium transition-colors sm:h-8 sm:w-8 sm:text-sm ${
                              page === pages
                                ? 'bg-blue-600 text-white dark:bg-blue-700'
                                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                          >
                            {pages}
                          </button>
                        );
                      }
                      
                      return buttons;
                    })()}
                  </div>

                  <button
                    disabled={page === pages}
                    onClick={() => setPage((p) => p + 1)}
                    className="flex items-center justify-center rounded-lg border border-gray-300 bg-white p-1.5 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:p-2"
                  >
                    <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}