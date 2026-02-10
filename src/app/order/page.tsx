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
  Filter,
  RefreshCw,
  Package,
  X,
  CreditCard,
  DollarSign,
  BarChart3,
  CalendarDays,
  ChevronUp,
  ChevronDown as ChevronDownIcon,
  FilterX,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface OrderItem {
  id: number;
  menu_id: number;
  quantity: number;
  price: string;
  menu_name?: string;
  menu_image?: string;
  menu?: {
    name: string;
    price: number;
  };
}

interface Order {
  id: number;
  order_code: string;
  user_id: number;
  restaurant_id: number;
  total_price: number;
  status: 'pending' | 'paid' | 'canceled';
  order_status: 'processing' | 'completed' | 'canceled';
  notes: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  restaurant_name?: string;
  restaurant?: {
    name: string;
  };
}

const OrderListPage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter states
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 1000000
  ]);
  const [showAdvancedFilters, setShowAdvancedFilters] =
    useState(false);

  // Stats filter
  const [statsPeriod, setStatsPeriod] = useState<string>('month');

  const itemsPerPage = 6;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadOrders();
    }
  }, [mounted]);

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
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const getStatusConfig = (status: string, orderStatus: string) => {
    const configs = {
      pending: {
        bg: 'bg-yellow-100/80 dark:bg-yellow-900/30',
        text: 'text-yellow-800 dark:text-yellow-300',
        icon: Clock,
        label: 'Menunggu Pembayaran',
        progress: 25
      },
      paid:
        orderStatus === 'processing'
          ? {
              bg: 'bg-blue-100/80 dark:bg-blue-900/30',
              text: 'text-blue-800 dark:text-blue-300',
              icon: Hourglass,
              label: 'Diproses',
              progress: 50
            }
          : orderStatus === 'completed'
            ? {
                bg: 'bg-emerald-100/80 dark:bg-emerald-900/30',
                text: 'text-emerald-800 dark:text-emerald-300',
                icon: CheckCircle,
                label: 'Selesai',
                progress: 100
              }
            : {
                bg: 'bg-blue-100/80 dark:bg-blue-900/30',
                text: 'text-blue-800 dark:text-blue-300',
                icon: CheckCircle,
                label: 'Dibayar',
                progress: 75
              },
      canceled: {
        bg: 'bg-red-100/80 dark:bg-red-900/30',
        text: 'text-red-800 dark:text-red-300',
        icon: X,
        label: 'Dibatalkan',
        progress: 0
      }
    };

    return configs[status as keyof typeof configs] || configs.pending;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const minutes = Math.floor(
          (now.getTime() - date.getTime()) / (1000 * 60)
        );
        return `${minutes} menit yang lalu`;
      }
      return `${diffInHours} jam yang lalu`;
    }

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getItemDisplayName = (item: OrderItem) => {
    if (item.menu_name) {
      return item.menu_name;
    }

    if (item.menu?.name) {
      return item.menu.name;
    }

    return `Item #${item.menu_id}`;
  };

  const getItemPrice = (item: OrderItem) => {
    if (item.menu?.price) {
      return item.menu.price * item.quantity;
    }

    if (item.price) {
      return parseFloat(item.price) * item.quantity;
    }

    return 0;
  };

  const getFilteredAndSortedOrders = () => {
    let filtered = [...orders];

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.order_code
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (order.restaurant_name || order.restaurant?.name || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.notes
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTab !== 'all') {
      filtered = filtered.filter(
        (order) => order.status === selectedTab
      );
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.created_at);
        switch (dateFilter) {
          case 'today':
            return orderDate >= today;
          case 'yesterday':
            return orderDate >= yesterday && orderDate < today;
          case 'week':
            return orderDate >= lastWeek;
          case 'month':
            return orderDate >= lastMonth;
          default:
            return true;
        }
      });
    }

    filtered = filtered.filter(
      (order) =>
        order.total_price >= priceRange[0] &&
        order.total_price <= priceRange[1]
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
        case 'oldest':
          return (
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
          );
        case 'price_high':
          return b.total_price - a.total_price;
        case 'price_low':
          return a.total_price - b.total_price;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredOrders = getFilteredAndSortedOrders();
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatsData = () => {
    const now = new Date();
    let statsOrders = [...orders];

    if (statsPeriod === 'today') {
      const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      statsOrders = statsOrders.filter(
        (order) => new Date(order.created_at) >= today
      );
    } else if (statsPeriod === 'month') {
      const firstDayOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );
      statsOrders = statsOrders.filter(
        (order) => new Date(order.created_at) >= firstDayOfMonth
      );
    } else if (statsPeriod === 'year') {
      const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
      statsOrders = statsOrders.filter(
        (order) => new Date(order.created_at) >= firstDayOfYear
      );
    }

    const totalOrders = statsOrders.length;
    const pendingOrders = statsOrders.filter(
      (order) => order.status === 'pending'
    ).length;
    const paidOrders = statsOrders.filter(
      (order) => order.status === 'paid'
    ).length;
    const totalSpent = statsOrders
      .filter((order) => order.status === 'paid')
      .reduce((sum, order) => sum + order.total_price, 0);

    return {
      totalOrders,
      pendingOrders,
      paidOrders,
      totalSpent
    };
  };

  const stats = getStatsData();

  const getOrderCountByStatus = (status: string) => {
    return orders.filter((order) => order.status === status).length;
  };

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 px-4 py-6 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section - Responsif */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/')}
                className="h-10 w-10 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
                  Pesanan Saya
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Kelola dan pantau semua pesanan Anda
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                size="sm"
                className="rounded-full border-slate-300 dark:border-slate-700"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    refreshing ? 'animate-spin' : ''
                  }`}
                />
                <span className="ml-2 hidden sm:inline">Refresh</span>
              </Button>
              <Button
                onClick={() => router.push('/areas')}
                className="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                size="sm"
              >
                <span className="hidden sm:inline">Pesan Lagi</span>
                <span className="sm:hidden">Pesan</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Mobile Filter Button */}
        <div className="mb-4 lg:hidden">
          <Button
            onClick={() => setMobileFiltersOpen(true)}
            variant="outline"
            className="w-full justify-start"
          >
            <Filter className="mr-2 h-4 w-4" />
            Buka Filter & Sort
          </Button>
        </div>

        {/* Mobile Filter Modal */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileFiltersOpen(false)}
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-white p-6 dark:bg-slate-900 lg:hidden"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Filter & Sort
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    ✕
                  </Button>
                </div>

                {/* Mobile Search */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium">
                    <Search className="mr-2 inline h-4 w-4" />
                    Cari Pesanan
                  </label>
                  <Input
                    placeholder="Cari kode pesanan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Mobile Sort */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium">
                    Urutkan Berdasarkan
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih urutan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Terbaru</SelectItem>
                      <SelectItem value="oldest">Terlama</SelectItem>
                      <SelectItem value="price_high">
                        Harga Tertinggi
                      </SelectItem>
                      <SelectItem value="price_low">
                        Harga Terendah
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mobile Date Filter */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium">
                    <Calendar className="mr-2 inline h-4 w-4" />
                    Periode Waktu
                  </label>
                  <Select
                    value={dateFilter}
                    onValueChange={setDateFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua waktu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Waktu</SelectItem>
                      <SelectItem value="today">Hari Ini</SelectItem>
                      <SelectItem value="yesterday">
                        Kemarin
                      </SelectItem>
                      <SelectItem value="week">
                        7 Hari Terakhir
                      </SelectItem>
                      <SelectItem value="month">
                        30 Hari Terakhir
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mobile Advanced Filters Toggle */}
                <div className="mb-4">
                  <button
                    onClick={() =>
                      setShowAdvancedFilters(!showAdvancedFilters)
                    }
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <span>Filter Lanjutan</span>
                    {showAdvancedFilters ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Mobile Advanced Filters */}
                <AnimatePresence>
                  {showAdvancedFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium">
                          Rentang Harga
                        </label>
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                            <span>
                              Rp{' '}
                              {priceRange[0].toLocaleString('id-ID')}
                            </span>
                            <span>
                              Rp{' '}
                              {priceRange[1].toLocaleString('id-ID')}
                            </span>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <div className="h-1 w-full rounded-full bg-slate-300 dark:bg-slate-700"></div>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="1000000"
                              step="10000"
                              value={priceRange[0]}
                              onChange={(e) =>
                                setPriceRange([
                                  parseInt(e.target.value),
                                  priceRange[1]
                                ])
                              }
                              className="absolute h-1 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500"
                            />
                            <input
                              type="range"
                              min="0"
                              max="1000000"
                              step="10000"
                              value={priceRange[1]}
                              onChange={(e) =>
                                setPriceRange([
                                  priceRange[0],
                                  parseInt(e.target.value)
                                ])
                              }
                              className="absolute h-1 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Mobile Reset Button */}
                <Button
                  onClick={() => {
                    setDateFilter('all');
                    setSearchQuery('');
                    setPriceRange([0, 1000000]);
                    setSortBy('newest');
                    setSelectedTab('all');
                    setMobileFiltersOpen(false);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <FilterX className="mr-2 h-4 w-4" />
                  Reset Filter
                </Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Desktop Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:col-span-1 lg:block"
          >
            <div className="sticky top-6 rounded-xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                  <Filter className="h-5 w-5" />
                  Filter & Sort
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDateFilter('all');
                    setSearchQuery('');
                    setPriceRange([0, 1000000]);
                    setSortBy('newest');
                    setSelectedTab('all');
                  }}
                  className="text-sm"
                >
                  <FilterX className="mr-1 h-4 w-4" />
                  Reset
                </Button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  <Search className="mr-2 inline h-4 w-4" />
                  Cari Pesanan
                </label>
                <Input
                  placeholder="Cari kode pesanan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-slate-300 dark:border-slate-700"
                />
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Urutkan Berdasarkan
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="border-slate-300 dark:border-slate-700">
                    <SelectValue placeholder="Pilih urutan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Terbaru</SelectItem>
                    <SelectItem value="oldest">Terlama</SelectItem>
                    <SelectItem value="price_high">
                      Harga Tertinggi
                    </SelectItem>
                    <SelectItem value="price_low">
                      Harga Terendah
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Filter */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  <Calendar className="mr-2 inline h-4 w-4" />
                  Periode Waktu
                </label>
                <Select
                  value={dateFilter}
                  onValueChange={setDateFilter}
                >
                  <SelectTrigger className="border-slate-300 dark:border-slate-700">
                    <SelectValue placeholder="Semua waktu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Waktu</SelectItem>
                    <SelectItem value="today">Hari Ini</SelectItem>
                    <SelectItem value="yesterday">Kemarin</SelectItem>
                    <SelectItem value="week">
                      7 Hari Terakhir
                    </SelectItem>
                    <SelectItem value="month">
                      30 Hari Terakhir
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Filters Toggle */}
              <div className="mb-4">
                <button
                  onClick={() =>
                    setShowAdvancedFilters(!showAdvancedFilters)
                  }
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <span>Filter Lanjutan</span>
                  {showAdvancedFilters ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showAdvancedFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {/* Price Range */}
                    <div className="mb-6">
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Rentang Harga
                      </label>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                          <span>
                            Rp {priceRange[0].toLocaleString('id-ID')}
                          </span>
                          <span>
                            Rp {priceRange[1].toLocaleString('id-ID')}
                          </span>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="h-1 w-full rounded-full bg-slate-300 dark:bg-slate-700"></div>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1000000"
                            step="10000"
                            value={priceRange[0]}
                            onChange={(e) =>
                              setPriceRange([
                                parseInt(e.target.value),
                                priceRange[1]
                              ])
                            }
                            className="absolute h-1 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-lg"
                          />
                          <input
                            type="range"
                            min="0"
                            max="1000000"
                            step="10000"
                            value={priceRange[1]}
                            onChange={(e) =>
                              setPriceRange([
                                priceRange[0],
                                parseInt(e.target.value)
                              ])
                            }
                            className="absolute h-1 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Orders Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            {/* Status Tabs - Responsif */}
            <div className="mb-6 overflow-x-auto">
              <div className="flex min-w-max space-x-1 rounded-lg bg-slate-100/50 p-1 dark:bg-slate-800/50">
                {[
                  { value: 'all', label: 'Semua' },
                  { value: 'pending', label: 'Menunggu' },
                  { value: 'paid', label: 'Dibayar' },
                  { value: 'canceled', label: 'Batal' }
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => {
                      setSelectedTab(tab.value);
                      setCurrentPage(1);
                    }}
                    className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      selectedTab === tab.value
                        ? tab.value === 'pending'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : tab.value === 'paid'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : tab.value === 'canceled'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                              : 'bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-300'
                        : 'text-slate-600 hover:bg-white/50 dark:text-slate-400 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {tab.label}
                    {tab.value === 'pending' &&
                      getOrderCountByStatus('pending') > 0 && (
                        <span className="ml-2 rounded-full bg-yellow-500 px-1.5 py-0.5 text-xs text-white">
                          {getOrderCountByStatus('pending')}
                        </span>
                      )}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <AnimatePresence mode="wait">
              {filteredOrders.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-white/50 to-slate-50/50 p-8 text-center backdrop-blur-sm dark:border-slate-700 dark:from-slate-900/30 dark:to-slate-900/20"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <Package className="h-8 w-8 text-slate-400 dark:text-slate-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                    Tidak ada pesanan
                  </h3>
                  <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
                    {searchQuery ||
                    dateFilter !== 'all' ||
                    selectedTab !== 'all'
                      ? 'Coba ubah filter pencarian Anda'
                      : 'Mulai pesan makanan sekarang!'}
                  </p>
                  <Button
                    onClick={() => router.push('/areas')}
                    className="rounded-full bg-emerald-600 px-6"
                  >
                    Pesan Sekarang
                  </Button>
                </motion.div>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                      Menampilkan{' '}
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {(currentPage - 1) * itemsPerPage + 1}
                      </span>
                      -
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {Math.min(
                          currentPage * itemsPerPage,
                          filteredOrders.length
                        )}
                      </span>{' '}
                      dari{' '}
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {filteredOrders.length}
                      </span>
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {currentPage}/{totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) =>
                            Math.min(totalPages, p + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <AnimatePresence>
                      {paginatedOrders.map((order) => {
                        const statusConfig = getStatusConfig(
                          order.status,
                          order.order_status
                        );
                        const StatusIcon = statusConfig.icon;
                        const restaurantName =
                          order.restaurant_name ||
                          order.restaurant?.name;

                        return (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            whileHover={{
                              y: -4,
                              transition: { duration: 0.2 }
                            }}
                          >
                            <div
                              onClick={() =>
                                router.push(
                                  `/order/${String(order.id)}`
                                )
                              }
                              className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-white to-white/50 backdrop-blur-sm transition-all duration-300 hover:border-emerald-300 hover:shadow-lg dark:border-slate-800 dark:from-slate-900/50 dark:to-slate-900/30 dark:hover:border-emerald-600"
                            >
                              <div className="p-4 sm:p-6">
                                <div className="mb-4 flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                      <span
                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
                                      >
                                        <StatusIcon className="mr-1 h-3 w-3" />
                                        <span className="hidden sm:inline">
                                          {statusConfig.label}
                                        </span>
                                        <span className="sm:hidden">
                                          {
                                            statusConfig.label.split(
                                              ' '
                                            )[0]
                                          }
                                        </span>
                                      </span>
                                      <span className="text-xs text-slate-500 dark:text-slate-500">
                                        {formatDate(order.created_at)}
                                      </span>
                                    </div>
                                    <h3 className="font-mono text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                                      {order.order_code}
                                    </h3>
                                    {restaurantName && (
                                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                                        {restaurantName}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                                      Total
                                    </p>
                                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 sm:text-xl">
                                      {formatPrice(order.total_price)}
                                    </p>
                                  </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                    <div
                                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300"
                                      style={{
                                        width: `${statusConfig.progress}%`
                                      }}
                                    />
                                  </div>
                                </div>

                                {/* Order Items Preview */}
                                <div className="mb-4">
                                  <p className="mb-2 text-xs font-medium text-slate-700 dark:text-slate-300 sm:text-sm">
                                    Pesanan ({order.items.length})
                                  </p>
                                  <div className="space-y-2">
                                    {order.items
                                      .slice(0, 2)
                                      .map((item) => (
                                        <div
                                          key={item.id}
                                          className="flex items-center justify-between text-xs sm:text-sm"
                                        >
                                          <span className="truncate text-slate-600 dark:text-slate-400">
                                            {getItemDisplayName(item)}{' '}
                                            × {item.quantity}
                                          </span>
                                          <span className="font-medium text-slate-900 dark:text-white">
                                            {formatPrice(
                                              getItemPrice(item)
                                            )}
                                          </span>
                                        </div>
                                      ))}
                                    {order.items.length > 2 && (
                                      <p className="text-xs text-slate-500 dark:text-slate-500">
                                        +{order.items.length - 2} item
                                        lainnya
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Notes */}
                                {order.notes && (
                                  <div className="mb-4 rounded-lg bg-slate-50/50 p-3 dark:bg-slate-800/50">
                                    <div className="flex items-start gap-2">
                                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400 dark:text-slate-500" />
                                      <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                                        <span className="font-medium">
                                          Catatan:{' '}
                                        </span>
                                        {order.notes}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6"
                    >
                      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Menampilkan{' '}
                          {(currentPage - 1) * itemsPerPage + 1}-
                          {Math.min(
                            currentPage * itemsPerPage,
                            filteredOrders.length
                          )}{' '}
                          dari {filteredOrders.length} pesanan
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                          >
                            Awal
                          </Button>
                          <div className="flex items-center">
                            {Array.from(
                              { length: Math.min(3, totalPages) },
                              (_, i) => {
                                let pageNum;
                                if (totalPages <= 3) {
                                  pageNum = i + 1;
                                } else if (currentPage === 1) {
                                  pageNum = i + 1;
                                } else if (
                                  currentPage === totalPages
                                ) {
                                  pageNum = totalPages - 2 + i;
                                } else {
                                  pageNum = currentPage - 1 + i;
                                }

                                return (
                                  <Button
                                    key={pageNum}
                                    variant={
                                      currentPage === pageNum
                                        ? 'default'
                                        : 'outline'
                                    }
                                    size="sm"
                                    onClick={() =>
                                      setCurrentPage(pageNum)
                                    }
                                    className="h-8 w-8 text-sm"
                                  >
                                    {pageNum}
                                  </Button>
                                );
                              }
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                          >
                            Akhir
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Stats Section - Dipindah ke bawah */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="rounded-xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                  <BarChart3 className="h-5 w-5" />
                  Statistik Pesanan
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Ringkasan aktivitas pemesanan Anda
                </p>
              </div>

              <Select
                value={statsPeriod}
                onValueChange={setStatsPeriod}
              >
                <SelectTrigger className="w-full border-slate-300 dark:border-slate-700 sm:w-[140px]">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hari Ini</SelectItem>
                  <SelectItem value="month">Bulan Ini</SelectItem>
                  <SelectItem value="year">Tahun Ini</SelectItem>
                  <SelectItem value="all">Semua Waktu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stats Grid - Responsif */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {/* Total Orders */}
              <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-4 dark:border-slate-800 dark:from-slate-900/50 dark:to-slate-900/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 sm:text-sm">
                      Total Pesanan
                    </p>
                    <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                      {stats.totalOrders}
                    </p>
                  </div>
                  <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/30">
                    <ShoppingBag className="h-4 w-4 text-emerald-600 dark:text-emerald-400 sm:h-5 sm:w-5" />
                  </div>
                </div>
              </div>

              {/* Menunggu Bayar */}
              <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-4 dark:border-slate-800 dark:from-slate-900/50 dark:to-slate-900/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 sm:text-sm">
                      Menunggu Bayar
                    </p>
                    <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                      {stats.pendingOrders}
                    </p>
                    {stats.pendingOrders > 0 && (
                      <p className="mt-0.5 text-xs text-yellow-600 dark:text-yellow-400">
                        {stats.pendingOrders} pesanan
                      </p>
                    )}
                  </div>
                  <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/30">
                    <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400 sm:h-5 sm:w-5" />
                  </div>
                </div>
              </div>

              {/* Dibayar */}
              <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-4 dark:border-slate-800 dark:from-slate-900/50 dark:to-slate-900/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 sm:text-sm">
                      Dibayar
                    </p>
                    <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                      {stats.paidOrders}
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                    <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 sm:h-5 sm:w-5" />
                  </div>
                </div>
              </div>

              {/* Total Pengeluaran */}
              <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-4 dark:border-slate-800 dark:from-slate-900/50 dark:to-slate-900/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 sm:text-sm">
                      Pengeluaran
                    </p>
                    <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                      {formatPrice(stats.totalSpent).replace(
                        'Rp',
                        'Rp '
                      )}
                    </p>
                  </div>
                  <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/30">
                    <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400 sm:h-5 sm:w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6"
          >
            <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50/50 to-white/50 p-6 backdrop-blur-sm dark:border-red-800 dark:from-red-900/20 dark:to-slate-900/30">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 font-semibold text-red-800 dark:text-red-300">
                    Gagal Memuat Pesanan
                  </h4>
                  <p className="mb-4 text-sm text-red-700/80 dark:text-red-400/80">
                    {error}
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={loadOrders}
                      variant="destructive"
                      size="sm"
                    >
                      Coba Lagi
                    </Button>
                    <Button
                      onClick={() => router.push('/areas')}
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      Pesan Sekarang
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderListPage;
