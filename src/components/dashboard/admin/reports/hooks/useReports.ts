import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { 
  DashboardData, 
  ReportsData, 
  OrdersDetailData, 
  ExportFormat,
  OrderByDate,
  AvailableDate,
  UserData
} from '../types';
import { 
  generateOrdersAuditTXT,
  generateOrdersAuditCSV,
  generateOrdersAuditExcel,
  generateOrdersAuditPDF,
  downloadFile
} from '@/lib/exportOrdersAudit';
import { getTodayDate, getMonthAgoDate } from '../utils/formatters';

const STORAGE_KEYS = {
  ACTIVE_FILTER_START: 'reports_active_start',
  ACTIVE_FILTER_END: 'reports_active_end'
};

interface UserWithId extends UserData {
  id: string;
}

export const useReports = () => {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // ============= STATE =============
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showModuleSelection, setShowModuleSelection] = useState(false);
  const [availableModules, setAvailableModules] = useState<string[]>([]);
  
  const [userData, setUserData] = useState<UserData>({
    data_access: [],
    role: '',
    divisi: null,
    hasMultipleAccess: false,
    defaultModule: ''
  });
  
  const [selectedModule, setSelectedModule] = useState<string>('');
  
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [ordersDetailData, setOrdersDetailData] = useState<OrdersDetailData | undefined>(undefined);
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('excel');

  const [activeFilterStartDate, setActiveFilterStartDate] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_FILTER_START) || '';
    }
    return '';
  });
  
  const [activeFilterEndDate, setActiveFilterEndDate] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_FILTER_END) || '';
    }
    return '';
  });

  // Refs
  const isFetchingRef = useRef(false);
  const initialLoadDoneRef = useRef(false);
  const currentUserIdRef = useRef<string | null>(null);

  // ============= LOCALSTORAGE =============
  useEffect(() => {
    if (activeFilterStartDate) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_FILTER_START, activeFilterStartDate);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_FILTER_START);
    }
  }, [activeFilterStartDate]);

  useEffect(() => {
    if (activeFilterEndDate) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_FILTER_END, activeFilterEndDate);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_FILTER_END);
    }
  }, [activeFilterEndDate]);

  // ============= AUTH =============
  const getAuthToken = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/auth/login');
      return null;
    }
    return token;
  }, [router]);

  const getUserDataFromStorage = useCallback((): UserWithId | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const userDataStr = localStorage.getItem('auth_user');
      if (userDataStr) {
        const user = JSON.parse(userDataStr);
        
        const dataAccess = user.data_access || [];
        const hasMultiple = dataAccess.filter((a: string) => 
          ['crsd1', 'crsd2'].includes(a)
        ).length > 1;
        
        let defaultModule = '';
        if (dataAccess.includes('crsd1') && dataAccess.includes('crsd2')) {
          defaultModule = 'general';
        } else if (dataAccess.includes('crsd1')) {
          defaultModule = 'crsd1';
        } else if (dataAccess.includes('crsd2')) {
          defaultModule = 'crsd2';
        }
        
        return {
          id: user.id || user.email || 'unknown',
          data_access: dataAccess,
          role: user.role || '',
          divisi: user.divisi || null,
          hasMultipleAccess: hasMultiple,
          defaultModule
        };
      }
    } catch (err) {
      console.error('Error parsing user data:', err);
    }
    return null;
  }, []);

  // ============= RESET =============
  const resetAllData = useCallback(() => {
    console.log('🔄 Resetting all data');
    setDashboardData(null);
    setReportsData(null);
    setOrdersDetailData(undefined);
    setAvailableDates([]);
    setSelectedModule('');
    setShowModuleSelection(false);
    setError(null);
    setSuccessMessage(null);
    initialLoadDoneRef.current = false;
  }, []);

  // ============= USER CHANGE DETECTION =============
  useEffect(() => {
    const checkUserChange = () => {
      const user = getUserDataFromStorage();
      if (!user) return;
      
      if (currentUserIdRef.current && currentUserIdRef.current !== user.id) {
        console.log('🚨 User changed');
        resetAllData();
        window.location.reload();
      }
    };
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_user' || e.key === 'auth_token') {
        checkUserChange();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [getUserDataFromStorage, resetAllData]);

  // ============= DATA TRANSFORM =============
  const transformDashboardData = useCallback((data: any): DashboardData => ({
    orders: { total: data.orders?.total || 0 },
    payments: { total_revenue: data.payments?.total_revenue || 0 }
  }), []);

  const transformReportsData = useCallback((data: any): ReportsData => ({
    total_orders: data.total_orders || 0,
    orders_by_status: data.orders_by_status || [],
    payment_summary: data.payment_summary || []
  }), []);

  const mapToOrdersDetailData = useCallback((apiData: any, activeStart: string, activeEnd: string): OrdersDetailData | undefined => {
    try {
      if (!apiData?.orders_by_date?.length) return undefined;
      
      const ordersByDate = apiData.orders_by_date;
      
      const totalOrders = ordersByDate.reduce((sum: number, day: any) => sum + (day.total_orders || 0), 0);
      const totalRevenue = ordersByDate.reduce((sum: number, day: any) => sum + (day.daily_total || 0), 0);
      
      const dates = ordersByDate.map((day: any) => ({
        date: day.date,
        has_data: day.total_orders > 0
      }));
      setAvailableDates(dates);

      const mappedOrdersByDate: OrderByDate[] = ordersByDate.map((day: any) => ({
        date: day.date,
        total_orders: day.total_orders || 0,
        daily_total: day.daily_total || 0,
        cumulative_total: day.cumulative_total || 0,
        orders: (day.orders || []).map((order: any) => ({
          order_id: order.id || order.order_id,
          order_number: order.order_code || order.order_number,
          customer: order.user?.name || order.customer || '-',
          status: order.status || '-',
          created_at: order.created_at,
          total: order.total_price || order.total || 0,
          items: (order.items || []).map((item: any) => ({
            name: item.menu?.name || item.name || '-',
            quantity: item.quantity || 0,
            price: parseFloat(item.price) || 0,
            subtotal: (parseFloat(item.price) || 0) * (item.quantity || 0)
          }))
        }))
      }));

      return {
        period: { 
          start_date: apiData.period?.start_date || activeStart, 
          end_date: apiData.period?.end_date || activeEnd 
        },
        summary: {
          total_orders: apiData.summary?.total_orders || totalOrders,
          total_revenue: apiData.summary?.total_revenue || totalRevenue,
          average_order_value: totalOrders > 0 ? totalRevenue / totalOrders : 0
        },
        orders_by_date: mappedOrdersByDate
      };
    } catch (err) {
      console.error('Error mapping orders detail:', err);
      return undefined;
    }
  }, []);

  // ============= URL BUILDER =============
  const buildUrl = useCallback((baseUrl: string, params: Record<string, string>): string => {
    const url = new URL(baseUrl, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
    url.searchParams.append('_t', Date.now().toString());
    return url.toString();
  }, []);

  // ============= FETCH FUNCTIONS =============
  const fetchDashboard = useCallback(async (token: string, module?: string): Promise<DashboardData | null> => {
    try {
      const params: Record<string, string> = {};
      if (module && module !== 'general') params.crsd_type = module;
      
      const response = await fetch(buildUrl(`${apiUrl}/api/admin/dashboard`, params), {
        headers: { 
          Authorization: `Bearer ${token}`, 
          Accept: 'application/json',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-cache'
      });

      if (response.status === 401) {
        router.push('/auth/login');
        return null;
      }

      if (response.status === 403) {
        console.error('Forbidden access to dashboard');
        return null;
      }

      if (response.ok) {
        const data = await response.json();
        return data.success ? transformDashboardData(data.data) : null;
      }
      return null;
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      return null;
    }
  }, [apiUrl, router, transformDashboardData, buildUrl]);

  const fetchReports = useCallback(async (token: string, module?: string): Promise<ReportsData | null> => {
    try {
      const params: Record<string, string> = {};
      if (activeFilterStartDate) params.start_date = activeFilterStartDate;
      if (activeFilterEndDate) params.end_date = activeFilterEndDate;
      if (module && module !== 'general') params.crsd_type = module;
      
      const response = await fetch(buildUrl(`${apiUrl}/api/admin/reports`, params), {
        headers: { 
          Authorization: `Bearer ${token}`, 
          Accept: 'application/json',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-cache'
      });

      if (response.status === 403) {
        console.error('Forbidden access to reports');
        return null;
      }

      if (response.ok) {
        const data = await response.json();
        return data.success ? transformReportsData(data.data) : null;
      }
      return null;
    } catch (err) {
      console.error('Reports fetch error:', err);
      return null;
    }
  }, [apiUrl, activeFilterStartDate, activeFilterEndDate, transformReportsData, buildUrl]);

  const fetchOrdersDetail = useCallback(async (token: string, start: string, end: string, module?: string): Promise<OrdersDetailData | undefined> => {
    try {
      const params: Record<string, string> = { 
        start_date: start, 
        end_date: end 
      };
      if (module && module !== 'general') params.crsd_type = module;
      
      const response = await fetch(buildUrl(`${apiUrl}/api/admin/orders-detail`, params), {
        headers: { 
          Authorization: `Bearer ${token}`, 
          Accept: 'application/json',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-cache'
      });

      if (response.status === 403) {
        console.error('Forbidden access to orders detail');
        return undefined;
      }

      if (response.status === 404) {
        console.log('No orders detail found');
        return undefined;
      }

      if (response.ok) {
        const data = await response.json();
        return data.success ? mapToOrdersDetailData(data.data, start, end) : undefined;
      }
      return undefined;
    } catch (err) {
      console.error('Orders detail fetch error:', err);
      return undefined;
    }
  }, [apiUrl, mapToOrdersDetailData, buildUrl]);

  const fetchModuleData = useCallback(async (token: string, start: string, end: string, module: string) => {
    console.log(`📊 Fetching data for module: ${module}`);
    
    setDashboardData(null);
    setReportsData(null);
    setOrdersDetailData(undefined);
    setAvailableDates([]);
    
    const [dashboardResult, reportsResult, ordersDetailResult] = await Promise.all([
      fetchDashboard(token, module),
      fetchReports(token, module),
      fetchOrdersDetail(token, start, end, module)
    ]);

    setDashboardData(dashboardResult);
    setReportsData(reportsResult);
    setOrdersDetailData(ordersDetailResult);
    
    console.log('✅ Data fetched successfully');
  }, [fetchDashboard, fetchReports, fetchOrdersDetail]);

  // ============= MAIN FETCH =============
  const fetchAllData = useCallback(async (start: string, end: string, module?: string, force = false) => {
    if (isFetchingRef.current && !force) return;

    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token || !apiUrl) {
        setError('Konfigurasi tidak lengkap');
        return;
      }

      const user = getUserDataFromStorage();
      if (!user) {
        setError('Data user tidak ditemukan');
        return;
      }

      if (!currentUserIdRef.current) {
        currentUserIdRef.current = user.id;
      }

      setUserData(user);
      setAvailableModules(user.data_access);

      const moduleToUse = module || selectedModule;

      // All Admin - No module selected
      if (!moduleToUse && user.hasMultipleAccess) {
        setShowModuleSelection(true);
        setIsLoading(false);
        return;
      }

      // Single Access - Use default module
      if (!moduleToUse && !user.hasMultipleAccess) {
        const defaultModule = user.data_access.includes('crsd1') ? 'crsd1' : 
                             user.data_access.includes('crsd2') ? 'crsd2' : '';
        if (defaultModule) {
          setSelectedModule(defaultModule);
          await fetchModuleData(token, start, end, defaultModule);
        }
        return;
      }

      // Validate module
      if (moduleToUse && moduleToUse !== 'general' && !user.data_access.includes(moduleToUse)) {
        setError('Anda tidak memiliki akses ke modul ini');
        setSelectedModule('');
        if (user.hasMultipleAccess) setShowModuleSelection(true);
        return;
      }

      // Fetch data
      if (moduleToUse) {
        await fetchModuleData(token, start, end, moduleToUse);
        setShowModuleSelection(false);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data');
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [apiUrl, getAuthToken, selectedModule, fetchModuleData, getUserDataFromStorage]);

// ============= INITIAL LOAD =============
useEffect(() => {
  if (initialLoadDoneRef.current) return;

  const initialize = async () => {
    // SCROLL TO TOP - TAMBAHKAN INI
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // instant agar langsung
      });
    }

    const token = getAuthToken();
    if (!token || !apiUrl) {
      setError('Konfigurasi tidak lengkap');
      setIsLoading(false);
      return;
    }

    const user = getUserDataFromStorage();
    if (!user) {
      setError('Data user tidak ditemukan');
      setIsLoading(false);
      return;
    }

    currentUserIdRef.current = user.id;
    setUserData(user);
    setAvailableModules(user.data_access);
    setSelectedModule('');

    const monthAgo = getMonthAgoDate();
    const today = getTodayDate();

    if (!activeFilterStartDate) {
      setActiveFilterStartDate(monthAgo);
      setStartDate(monthAgo);
    } else {
      setStartDate(activeFilterStartDate);
    }

    if (!activeFilterEndDate) {
      setActiveFilterEndDate(today);
      setEndDate(today);
    } else {
      setEndDate(activeFilterEndDate);
    }

    // All Admin - Show module selection
    if (user.hasMultipleAccess) {
      setShowModuleSelection(true);
      setIsLoading(false);
      initialLoadDoneRef.current = true;
      return;
    }

    // Single Access - Auto select module
    const defaultModule = user.data_access.includes('crsd1') ? 'crsd1' : 
                         user.data_access.includes('crsd2') ? 'crsd2' : '';
    
    if (defaultModule) {
      setSelectedModule(defaultModule);
      await fetchAllData(
        activeFilterStartDate || monthAgo,
        activeFilterEndDate || today,
        defaultModule,
        true
      );
    }
    
    initialLoadDoneRef.current = true;
  };

  initialize();
}, []);

  // ============= HANDLERS =============
  const handleModuleSelect = useCallback(async (module: string) => {
    setIsLoading(true);
    setError(null);
    
    const user = getUserDataFromStorage();
    if (user && module !== 'general' && !user.data_access.includes(module)) {
      setError('Anda tidak memiliki akses ke modul ini');
      setIsLoading(false);
      return;
    }
    
    setSelectedModule(module);

    const token = getAuthToken();
    if (!token || !apiUrl) {
      setError('Konfigurasi tidak lengkap');
      setIsLoading(false);
      return;
    }

    await fetchAllData(
      activeFilterStartDate || startDate,
      activeFilterEndDate || endDate,
      module,
      true
    );

    setSuccessMessage(
      module === 'general'
        ? 'Dashboard umum berhasil dimuat'
        : `Dashboard ${module === 'crsd1' ? 'CRSD 1' : 'CRSD 2'} berhasil dimuat`
    );
    setTimeout(() => setSuccessMessage(null), 3000);
  }, [apiUrl, getAuthToken, activeFilterStartDate, activeFilterEndDate, startDate, endDate, fetchAllData, getUserDataFromStorage]);

  const handleChangeModule = useCallback(() => {
    console.log('🔄 Changing module');
    setSelectedModule('');
    setShowModuleSelection(true);
    setDashboardData(null);
    setReportsData(null);
    setOrdersDetailData(undefined);
    setAvailableDates([]);
    setError(null);
    setSuccessMessage(null);
  }, []);

  const handleApplyFilter = useCallback(() => {
    if (!startDate || !endDate) {
      setError('Silakan pilih tanggal awal dan akhir');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Tanggal awal harus lebih kecil dari tanggal akhir');
      return;
    }

    setActiveFilterStartDate(startDate);
    setActiveFilterEndDate(endDate);
    fetchAllData(startDate, endDate, selectedModule, true);
  }, [startDate, endDate, selectedModule, fetchAllData]);

  const handleExport = useCallback(async () => {
    try {
      setIsExporting(true);
      setError(null);

      if (!ordersDetailData?.orders_by_date?.length) {
        setError('Tidak ada data pesanan untuk periode yang dipilih');
        return;
      }

      const filename = `audit-orders-${ordersDetailData.period.start_date}-to-${ordersDetailData.period.end_date}`;

      switch (exportFormat) {
        case 'csv':
          downloadFile(generateOrdersAuditCSV(ordersDetailData), `${filename}.csv`, 'text/csv');
          break;
        case 'excel':
          await generateOrdersAuditExcel(ordersDetailData);
          break;
        case 'pdf':
          await generateOrdersAuditPDF(ordersDetailData);
          break;
        case 'txt':
          downloadFile(generateOrdersAuditTXT(ordersDetailData), `${filename}.txt`, 'text/plain');
          break;
      }

      setSuccessMessage(`Export ${exportFormat.toUpperCase()} berhasil`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal export');
    } finally {
      setIsExporting(false);
    }
  }, [ordersDetailData, exportFormat]);

  const handleRefresh = useCallback(() => {
    fetchAllData(activeFilterStartDate, activeFilterEndDate, selectedModule, true);
  }, [activeFilterStartDate, activeFilterEndDate, selectedModule, fetchAllData]);

  const handleResetError = useCallback(() => setError(null), []);
  const handleResetSuccess = useCallback(() => setSuccessMessage(null), []);
  
  const isDateAvailable = useCallback((date: string): boolean => {
    const available = availableDates.find(d => d.date === date);
    return available ? available.has_data : true;
  }, [availableDates]);

  return {
    dashboardData,
    reportsData,
    ordersDetailData,
    availableDates,
    userData,
    selectedModule,
    showModuleSelection,
    availableModules,
    isLoading,
    isExporting,
    error,
    successMessage,
    startDate,
    endDate,
    exportFormat,
    activeFilterStartDate,
    activeFilterEndDate,
    setStartDate,
    setEndDate,
    setExportFormat,
    handleModuleSelect,
    handleChangeModule,
    handleApplyFilter,
    handleExport,
    handleRefresh,
    handleResetError,
    handleResetSuccess,
    isDateAvailable
  };
};