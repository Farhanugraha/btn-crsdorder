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
  const [userDivisi, setUserDivisi] = useState<string>(''); // ✅ TAMBAHKAN: user divisi

  // ============= API CALLS =============
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage?.getItem('auth_token');
      if (!token) {
        setError('Token tidak ditemukan. Silakan login terlebih dahulu.');
        setLoading(false);
        return;
      }

      // ✅ Ambil userRole dan userDivisi dari localStorage
      let role = userRole;
      let divisi = userDivisi;
      
      if (!role || !divisi) {
        try {
          // Coba ambil dari 'user' dulu
          const userData = localStorage.getItem('user');
          if (userData) {
            const user = JSON.parse(userData);
            role = user.role || '';
            divisi = user.divisi || '';
            setUserRole(role);
            setUserDivisi(divisi);
          } else {
            // Fallback ke 'auth_user'
            const authUser = localStorage.getItem('auth_user');
            if (authUser) {
              const user = JSON.parse(authUser);
              role = user.role || '';
              divisi = user.divisi || '';
              setUserRole(role);
              setUserDivisi(divisi);
            }
          }
        } catch (err) {
          console.error('Error parsing user data:', err);
        }
      }

      // ✅ Tentukan endpoint berdasarkan role DAN divisi
      let endpoint;
      
      if (role === 'superadmin') {
        // Superadmin bisa pilih semua CRSD
        if (crsdFilter === 'crsd1') {
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/crsd1/orders`;
        } else if (crsdFilter === 'crsd2') {
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/crsd2/orders`;
        } else {
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders`;
        }
      } else {
        // Admin biasa - filter berdasarkan divisi mereka
        if (divisi === 'CRSD 1' || divisi === 'crsd1') {
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/crsd1/orders`;
          // ✅ Paksa crsdFilter ke 'crsd1' untuk admin CRSD 1
          if (crsdFilter !== 'crsd1') {
            setCrsdFilter('crsd1');
          }
        } else if (divisi === 'CRSD 2' || divisi === 'crsd2') {
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/crsd2/orders`;
          // ✅ Paksa crsdFilter ke 'crsd2' untuk admin CRSD 2
          if (crsdFilter !== 'crsd2') {
            setCrsdFilter('crsd2');
          }
        } else {
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders`;
        }
      }

      console.log('Fetching orders from:', endpoint);
      console.log('User Role:', role);
      console.log('User Divisi:', divisi);
      console.log('CRSD Filter:', crsdFilter);
      
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
      console.error('Error fetching orders:', err);
      setError(err.message || 'Gagal memuat pesanan');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [userRole, userDivisi, crsdFilter]); // ✅ Tambahkan userDivisi sebagai dependency

  const fetchUserInfo = useCallback(() => {
    try {
      // Coba ambil dari 'user' dulu
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserRole(user.role || '');
        setUserDivisi(user.divisi || '');
        return { role: user.role || '', divisi: user.divisi || '' };
      }
      
      // Fallback ke 'auth_user'
      const authUser = localStorage.getItem('auth_user');
      if (authUser) {
        const user = JSON.parse(authUser);
        setUserRole(user.role || '');
        setUserDivisi(user.divisi || '');
        return { role: user.role || '', divisi: user.divisi || '' };
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
    return { role: '', divisi: '' };
  }, []);

  // ============= INITIAL LOAD =============
  useEffect(() => {
    const { role, divisi } = fetchUserInfo();
    
    // ✅ Set initial crsdFilter berdasarkan divisi
    if (role !== 'superadmin') {
      if (divisi === 'CRSD 1' || divisi === 'crsd1') {
        setCrsdFilter('crsd1');
      } else if (divisi === 'CRSD 2' || divisi === 'crsd2') {
        setCrsdFilter('crsd2');
      }
    }
    
    if (role) {
      fetchOrders();
    } else {
      setLoading(false);
      setError('Silakan login terlebih dahulu');
    }
  }, []);

  // ============= FIXED STATISTICS =============
const filteredStats = useMemo<FilteredStats>(() => {
  // Step 1: Ambil semua pesanan yang sudah dibayar
  let filtered = orders.filter(order => order.status === 'paid');
  
  // Step 2: Filter berdasarkan tanggal SAJA (bukan status)
  filtered = OrderUtils.filterOrdersByDate(filtered, dateFilter);
  
  // Step 3: Filter berdasarkan CRSD (jika superadmin)
  filtered = OrderUtils.filterOrdersByCRSD(filtered, crsdFilter);
  
  const totalOrders = filtered.length;
  const totalRevenue = filtered.reduce((sum, order) => sum + order.total_price, 0);
  
  return { totalOrders, totalRevenue };
}, [orders, dateFilter, crsdFilter]); 

const weeklyRevenue = useMemo<number>(() => {
  return OrderUtils.calculateWeeklyRevenue(orders);
}, [orders]);

  // ============= FILTERED ORDERS =============
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

  const handleResetFilters = useCallback(() => {
    setSearch('');
    setStatusFilter('processing');
    setAreaFilter('all');
    setRestaurantFilter('all');
    setDateFilter('today');
    
    // ✅ Reset CRSD filter berdasarkan divisi
    if (userRole === 'superadmin') {
      setCrsdFilter('all');
    } else if (userDivisi === 'CRSD 1' || userDivisi === 'crsd1') {
      setCrsdFilter('crsd1');
    } else if (userDivisi === 'CRSD 2' || userDivisi === 'crsd2') {
      setCrsdFilter('crsd2');
    }
    
    setPage(1);
  }, [userRole, userDivisi]);

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
    // ✅ Hanya superadmin yang bisa mengubah CRSD filter
    if (userRole === 'superadmin') {
      setCrsdFilter(value);
      setPage(1);
      fetchOrders();
    }
  }, [userRole, fetchOrders]);

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
  
  // ✅ TAMBAHKAN: Cek apakah user adalah admin CRSD 1 atau CRSD 2
  const isCrsd1Admin = userDivisi === 'CRSD 1' || userDivisi === 'crsd1';
  const isCrsd2Admin = userDivisi === 'CRSD 2' || userDivisi === 'crsd2';
  const isCrsdAdmin = isCrsd1Admin || isCrsd2Admin;

  return {
    // Data
    orders,
    areas,
    restaurants,
    filteredOrders,
    paginatedOrders,
    
    // Statistics - FIXED!
    filteredStats,
    weeklyRevenue,
    
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
    userDivisi, // ✅ EXPORT userDivisi
    hasActiveFilters,
    dateDisplayText,
    isSuperAdmin,
    isAdmin,
    isCrsd1Admin, // ✅ EXPORT isCrsd1Admin
    isCrsd2Admin, // ✅ EXPORT isCrsd2Admin
    isCrsdAdmin,  // ✅ EXPORT isCrsdAdmin
    
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