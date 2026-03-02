import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import type { 
  Order, 
  Area, 
  Restaurant, 
  OrderStatusFilter, 
  DateFilterType, 
  CrsdFilterType,
  FilteredStats 
} from '../types';
import * as OrderUtils from '../utils/orderUtils';
import { PER_PAGE } from '../utils/constants';

export const useDashboardOrders = () => {
  // ============= STATE =============
  const [orders, setOrders] = useState<Order[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('processing');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [restaurantFilter, setRestaurantFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('today');
  const [crsdFilter, setCrsdFilter] = useState<CrsdFilterType>('all');
  
  // UI states
  const [page, setPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [userDivisi, setUserDivisi] = useState<string>('');
  const [userDataAccess, setUserDataAccess] = useState<string[]>([]);

  // ============= API CALLS =============
  const fetchOrders = useCallback(async (selectedCrsdFilter?: CrsdFilterType) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage?.getItem('auth_token');
      if (!token) {
        setError('Token tidak ditemukan. Silakan login terlebih dahulu.');
        setLoading(false);
        return;
      }

      let role = userRole;
      let divisi = userDivisi;
      let dataAccess = userDataAccess;
      
      if (!role || !divisi) {
        try {
          // Coba ambil dari 'user' dulu
          const userData = localStorage.getItem('user');
          if (userData) {
            const user = JSON.parse(userData);
            role = user.role || '';
            divisi = user.divisi || '';
            dataAccess = user.data_access || [];
            setUserRole(role);
            setUserDivisi(divisi);
            setUserDataAccess(dataAccess);
          } else {
            // Fallback ke 'auth_user'
            const authUser = localStorage.getItem('auth_user');
            if (authUser) {
              const user = JSON.parse(authUser);
              role = user.role || '';
              divisi = user.divisi || '';
              dataAccess = user.data_access || [];
              setUserRole(role);
              setUserDivisi(divisi);
              setUserDataAccess(dataAccess);
            }
          }
        } catch (err) {
          // Silent error
        }
      }

      // Gunakan filter yang dipilih atau default
      const activeCrsdFilter = selectedCrsdFilter !== undefined ? selectedCrsdFilter : crsdFilter;
      
      let endpoint;
      
      if (role === 'superadmin') {
        // Superadmin bisa pilih semua CRSD
        if (activeCrsdFilter === 'crsd1') {
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/crsd1/orders`;
        } else if (activeCrsdFilter === 'crsd2') {
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/crsd2/orders`;
        } else {
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders`;
        }
      } else {
        // Admin biasa - filter berdasarkan divisi mereka
        const hasAccessToAllCrsd = dataAccess && 
                                   dataAccess.length === 2 && 
                                   dataAccess.includes('crsd1') && 
                                   dataAccess.includes('crsd2');
        
        if (hasAccessToAllCrsd) {
          // Admin dengan akses semua CRSD bisa memilih
          if (activeCrsdFilter === 'crsd1') {
            endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/crsd1/orders`;
          } else if (activeCrsdFilter === 'crsd2') {
            endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/crsd2/orders`;
          } else {
            endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders`;
          }
        } else if (divisi === 'CRSD 1' || divisi === 'crsd1') {
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/crsd1/orders`;
          if (crsdFilter !== 'crsd1') {
            setCrsdFilter('crsd1');
          }
        } else if (divisi === 'CRSD 2' || divisi === 'crsd2') {
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/crsd2/orders`;
          if (crsdFilter !== 'crsd2') {
            setCrsdFilter('crsd2');
          }
        } else {
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders`;
        }
      }

      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error(`Gagal mengambil data: ${res.status}`);

      const data = await res.json();

      if (data.success && data.data) {
        const processedOrders = data.data.map((order: any) => ({
          ...order,
          crsd_type: order.crsd_type || 
                     (order.user?.divisi === 'CRSD 2' ? 'crsd2' : 
                      order.user?.divisi === 'CRSD 1' ? 'crsd1' : undefined),
          items_count: order.items?.length || 0,
          total_price: typeof order.total_price === 'string' 
            ? parseInt(order.total_price) 
            : order.total_price
        }));

        setOrders(processedOrders);
        
        const extractedAreas = OrderUtils.extractAreasFromOrders(processedOrders);
        const extractedRestaurants = OrderUtils.extractRestaurantsFromOrders(processedOrders);
        
        setAreas(extractedAreas);
        setRestaurants(extractedRestaurants);
        setPage(1);
      } else {
        throw new Error(data.message || 'Gagal mengambil data pesanan');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat pesanan');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [userRole, userDivisi, userDataAccess, crsdFilter]);

  const fetchUserInfo = useCallback(() => {
    try {
      // Coba ambil dari 'user' dulu
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserRole(user.role || '');
        setUserDivisi(user.divisi || '');
        setUserDataAccess(user.data_access || []);
        return { 
          role: user.role || '', 
          divisi: user.divisi || '',
          data_access: user.data_access || [] 
        };
      }
      
      // Fallback ke 'auth_user'
      const authUser = localStorage.getItem('auth_user');
      if (authUser) {
        const user = JSON.parse(authUser);
        setUserRole(user.role || '');
        setUserDivisi(user.divisi || '');
        setUserDataAccess(user.data_access || []);
        return { 
          role: user.role || '', 
          divisi: user.divisi || '',
          data_access: user.data_access || [] 
        };
      }
    } catch (err) {
      // Silent error
    }
    return { role: '', divisi: '', data_access: [] };
  }, []);

  // ============= INITIAL LOAD =============
  useEffect(() => {
    const { role, divisi, data_access } = fetchUserInfo();
  
    if (role !== 'superadmin') {
      // Cek apakah admin memiliki akses ke semua CRSD
      const hasAccessToAllCrsd = data_access && 
                                 data_access.length === 2 && 
                                 data_access.includes('crsd1') && 
                                 data_access.includes('crsd2');
      
      if (!hasAccessToAllCrsd) {
        // Hanya set filter otomatis jika tidak punya akses semua
        if (divisi === 'CRSD 1' || divisi === 'crsd1') {
          setCrsdFilter('crsd1');
        } else if (divisi === 'CRSD 2' || divisi === 'crsd2') {
          setCrsdFilter('crsd2');
        }
      }
      // Jika punya akses semua, biarkan filter 'all' (default)
    }
    
    if (role) {
      fetchOrders();
    } else {
      setLoading(false);
      setError('Silakan login terlebih dahulu');
    }
  }, []);

  // ============= FILTERED STATISTICS UNTUK CARDS =============
  
  // Statistik berdasarkan filter yang aktif (untuk cards)
  const filteredStatsByActiveFilters = useMemo(() => {
    // Mulai dengan semua pesanan paid
    let filtered = orders.filter(order => order.status === 'paid');
    
    // Terapkan filter tanggal
    filtered = OrderUtils.filterOrdersByDate(filtered, dateFilter);
    
    // Terapkan filter CRSD
    filtered = OrderUtils.filterOrdersByCRSD(filtered, crsdFilter);
    
    // Terapkan filter search
    filtered = OrderUtils.filterOrdersBySearch(filtered, search);
    
    // Filter berdasarkan area (jika ada)
    if (areaFilter !== 'all') {
      filtered = filtered.filter(order => 
        OrderUtils.getOrderAreas(order).some(area => area.id.toString() === areaFilter)
      );
    }
    
    // Filter berdasarkan restaurant (jika ada)
    if (restaurantFilter !== 'all') {
      filtered = filtered.filter(order => 
        OrderUtils.getOrderRestaurants(order).some(
          restaurant => restaurant.id.toString() === restaurantFilter
        )
      );
    }
    
    // Hitung berdasarkan status
    const processingOrders = filtered.filter(order => order.order_status === 'processing');
    const completedOrders = filtered.filter(order => order.order_status === 'completed');
    
    const totalOrders = filtered.length;
    const totalRevenue = filtered.reduce((sum, order) => sum + order.total_price, 0);
    const processingOrdersCount = processingOrders.length;
    const completedOrdersCount = completedOrders.length;
    
    return { 
      totalOrders, 
      totalRevenue,
      processingOrdersCount,
      completedOrdersCount
    };
  }, [orders, dateFilter, crsdFilter, search, areaFilter, restaurantFilter]);

  // Statistik untuk overview (tanpa filter status, area, restaurant, search)
  const overviewStats = useMemo(() => {
    let filtered = orders.filter(order => order.status === 'paid');
    filtered = OrderUtils.filterOrdersByDate(filtered, dateFilter);
    filtered = OrderUtils.filterOrdersByCRSD(filtered, crsdFilter);
    
    const totalOrders = filtered.length;
    const totalRevenue = filtered.reduce((sum, order) => sum + order.total_price, 0);
    
    return { totalOrders, totalRevenue };
  }, [orders, dateFilter, crsdFilter]);

  // Pendapatan mingguan (selalu minggu ini, tidak terpengaruh filter)
  const weeklyRevenue = useMemo<number>(() => {
    return OrderUtils.calculateWeeklyRevenue(orders);
  }, [orders]);

  // ============= FILTERED ORDERS (untuk tabel) =============
  const filteredOrders = useMemo(() => {
    let filtered = orders.filter(order => order.status === 'paid');
    
    filtered = OrderUtils.filterOrdersByStatus(filtered, statusFilter);
    filtered = OrderUtils.filterOrdersByDate(filtered, dateFilter);
    filtered = OrderUtils.filterOrdersByCRSD(filtered, crsdFilter);
    filtered = OrderUtils.filterOrdersBySearch(filtered, search);
    
    if (areaFilter !== 'all') {
      filtered = filtered.filter(order => 
        order.order_status === 'processing' && 
        OrderUtils.getOrderAreas(order).some(area => area.id.toString() === areaFilter)
      );
    }
    
    if (restaurantFilter !== 'all') {
      filtered = filtered.filter(order => 
        order.order_status === 'processing' && 
        OrderUtils.getOrderRestaurants(order).some(
          restaurant => restaurant.id.toString() === restaurantFilter
        )
      );
    }
    
    return filtered;
  }, [orders, statusFilter, dateFilter, crsdFilter, search, areaFilter, restaurantFilter]);

  // ============= COUNT FUNCTIONS =============
  const getProcessingOrderCountByStatus = useCallback((status: string) => {
    if (status === 'processing') {
      return OrderUtils.getProcessingOrderCountByStatus(orders, 'processing');
    }
    return 0;
  }, [orders]);

  const getOrderCountByArea = useCallback((areaId: number) => {
    return OrderUtils.getOrderCountByArea(orders, areaId);
  }, [orders]);

  const getOrderCountByRestaurant = useCallback((restaurantId: number) => {
    return OrderUtils.getOrderCountByRestaurant(orders, restaurantId);
  }, [orders]);

  // ============= PAGINATION =============
  const pages = Math.ceil(filteredOrders.length / PER_PAGE);
  const paginatedOrders = useMemo(() => {
    return OrderUtils.paginateOrders(filteredOrders, page, PER_PAGE);
  }, [filteredOrders, page]);

  // ============= HANDLERS =============
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = useCallback((value: OrderStatusFilter) => {
    setStatusFilter(value);
    setPage(1);
    if (value !== 'processing') {
      setAreaFilter('all');
      setRestaurantFilter('all');
    }
  }, []);

  const handleDateChange = useCallback((value: DateFilterType) => {
    setDateFilter(value);
    setPage(1);
  }, []);

  const handleCrsdChange = useCallback((value: CrsdFilterType) => {
    const hasAccessToAllCrsd = userDataAccess && 
                               userDataAccess.length === 2 && 
                               userDataAccess.includes('crsd1') && 
                               userDataAccess.includes('crsd2');
    
    if (userRole === 'superadmin' || hasAccessToAllCrsd) {
      setCrsdFilter(value);
      setPage(1);
      
      setTimeout(() => {
        fetchOrders(value);
      }, 0);
    }
  }, [userRole, userDataAccess, fetchOrders]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleAreaChange = useCallback((value: string) => {
    setAreaFilter(value);
    setPage(1);
  }, []);

  const handleRestaurantChange = useCallback((value: string) => {
    setRestaurantFilter(value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleExpandOrder = useCallback((orderId: number | null) => {
    setExpandedOrder(orderId);
  }, []);

  const handleExportExcel = useCallback(() => {
    return filteredOrders;
  }, [filteredOrders]);

  const handleResetFilters = useCallback(() => {
    setSearch('');
    setStatusFilter('processing');
    setAreaFilter('all');
    setRestaurantFilter('all');
    setDateFilter('today');
    
    if (userRole === 'superadmin') {
      setCrsdFilter('all');
      setTimeout(() => {
        fetchOrders('all');
      }, 0);
    } else {
      const hasAccessToAllCrsd = userDataAccess && 
                                 userDataAccess.length === 2 && 
                                 userDataAccess.includes('crsd1') && 
                                 userDataAccess.includes('crsd2');
      
      if (hasAccessToAllCrsd) {
        setCrsdFilter('all');
        setTimeout(() => {
          fetchOrders('all');
        }, 0);
      } else if (userDivisi === 'CRSD 1' || userDivisi === 'crsd1') {
        setCrsdFilter('crsd1');
        setTimeout(() => {
          fetchOrders('crsd1');
        }, 0);
      } else if (userDivisi === 'CRSD 2' || userDivisi === 'crsd2') {
        setCrsdFilter('crsd2');
        setTimeout(() => {
          fetchOrders('crsd2');
        }, 0);
      }
    }
    
    setPage(1);
  }, [userRole, userDivisi, userDataAccess, fetchOrders]);

  // ============= COMPUTED VALUES =============
  const hasActiveFilters = useMemo(() => {
    return search !== '' || 
           statusFilter !== 'processing' || 
           areaFilter !== 'all' || 
           restaurantFilter !== 'all' || 
           dateFilter !== 'today' || 
           crsdFilter !== 'all';
  }, [search, statusFilter, areaFilter, restaurantFilter, dateFilter, crsdFilter]);

  const dateDisplayText = useMemo(() => {
    return OrderUtils.getDateDisplayText(dateFilter);
  }, [dateFilter]);

  const isSuperAdmin = userRole === 'superadmin';
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';
  
  const isCrsd1Admin = userDivisi === 'CRSD 1' || userDivisi === 'crsd1';
  const isCrsd2Admin = userDivisi === 'CRSD 2' || userDivisi === 'crsd2';
  const isCrsdAdmin = isCrsd1Admin || isCrsd2Admin;
  
  const hasAccessToAllCrsd = userDataAccess && 
                             userDataAccess.length === 2 && 
                             userDataAccess.includes('crsd1') && 
                             userDataAccess.includes('crsd2');

  return {
    // Data
    orders,
    areas,
    restaurants,
    filteredOrders,
    paginatedOrders,
    
    // Statistics untuk cards
    overviewStats,
    weeklyRevenue,
    
    // Data spesifik untuk OrdersStatsSection
    filteredProcessingOrders: filteredStatsByActiveFilters.processingOrdersCount,
    filteredCompletedOrders: filteredStatsByActiveFilters.completedOrdersCount,
    filteredTotalOrders: filteredStatsByActiveFilters.totalOrders,
    filteredTotalRevenue: filteredStatsByActiveFilters.totalRevenue,
    
    // Loading states
    loading,
    isRefreshing,
    error,
    setError,
    
    // Filter states
    search,
    statusFilter,
    areaFilter,
    restaurantFilter,
    dateFilter,
    crsdFilter,
    
    // UI states
    page,
    pages,
    expandedOrder,
    userRole,
    userDivisi,
    userDataAccess,
    hasActiveFilters,
    dateDisplayText,
    isSuperAdmin,
    isAdmin,
    isCrsd1Admin, 
    isCrsd2Admin, 
    isCrsdAdmin,
    hasAccessToAllCrsd,
    
    // Count functions
    getProcessingOrderCountByStatus,
    getOrderCountByArea,
    getOrderCountByRestaurant,
    
    // Handlers
    setSearch: handleSearchChange,
    setStatusFilter: handleStatusChange,
    setAreaFilter: handleAreaChange,
    setRestaurantFilter: handleRestaurantChange,
    setDateFilter: handleDateChange,
    setCrsdFilter: handleCrsdChange,
    setPage: handlePageChange,
    setExpandedOrder: handleExpandOrder,
    
    // Actions
    handleRefresh,
    handleResetFilters,
    handleExportExcel,
    fetchOrders,
    
    // Constants
    PER_PAGE
  };
};