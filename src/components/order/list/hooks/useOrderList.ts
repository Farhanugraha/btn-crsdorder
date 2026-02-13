import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Order, OrderFilterType, StatsPeriod, StatusTab, SortBy, DateFilter } from '../types';
import { ITEMS_PER_PAGE, MAX_PRICE } from '../constants/orderConstants';

export const useOrderList = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [selectedTab, setSelectedTab] = useState<StatusTab>('all');
  const [statsPeriod, setStatsPeriod] = useState<StatsPeriod>('month');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
        setCurrentPage(1);
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

  const handleBack = () => {
    router.push('/');
  };

  const handleOrderClick = (orderId: number) => {
    router.push(`/order/${String(orderId)}`);
  };

  const handleTabChange = (tab: StatusTab) => {
    setSelectedTab(tab);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setDateFilter('all');
    setSearchQuery('');
    setPriceRange([0, MAX_PRICE]);
    setSortBy('newest');
    setSelectedTab('all');
    setCurrentPage(1);
  };

  const getFilteredOrders = () => {
    let filtered = [...orders];

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.order_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (order.restaurant_name || order.restaurant?.name || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTab !== 'all') {
      filtered = filtered.filter((order) => order.status === selectedTab);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
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
      (order) => order.total_price >= priceRange[0] && order.total_price <= priceRange[1]
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
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

  const filteredOrders = getFilteredOrders();
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatsData = () => {
    const now = new Date();
    let statsOrders = [...orders];

    if (statsPeriod === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      statsOrders = statsOrders.filter((order) => new Date(order.created_at) >= today);
    } else if (statsPeriod === 'month') {
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      statsOrders = statsOrders.filter((order) => new Date(order.created_at) >= firstDayOfMonth);
    } else if (statsPeriod === 'year') {
      const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
      statsOrders = statsOrders.filter((order) => new Date(order.created_at) >= firstDayOfYear);
    }

    const totalOrders = statsOrders.length;
    const pendingOrders = statsOrders.filter((order) => order.status === 'pending').length;
    const paidOrders = statsOrders.filter((order) => order.status === 'paid').length;
    const totalSpent = statsOrders
      .filter((order) => order.status === 'paid')
      .reduce((sum, order) => sum + order.total_price, 0);

    return { totalOrders, pendingOrders, paidOrders, totalSpent };
  };

  const getOrderCountByStatus = (status: string) => {
    return orders.filter((order) => order.status === status).length;
  };

  return {
    mounted,
    orders,
    isLoading,
    error,
    refreshing,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    showAdvancedFilters,
    setShowAdvancedFilters,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    dateFilter,
    setDateFilter,
    priceRange,
    setPriceRange,
    selectedTab,
    setSelectedTab: handleTabChange,
    statsPeriod,
    setStatsPeriod,
    filteredOrders,
    paginatedOrders,
    totalPages,
    handleRefresh,
    handleBack,
    handleOrderClick,
    resetFilters,
    loadOrders,
    getStatsData,
    getOrderCountByStatus
  };
};