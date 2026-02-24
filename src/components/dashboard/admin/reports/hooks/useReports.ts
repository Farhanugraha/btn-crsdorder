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
  ACTIVE_FILTER_END: 'reports_active_end',
  SELECTED_MODULE: 'reports_selected_module'
};

interface UserWithId extends UserData {
  id: string;
}

interface ModuleDataCache {
  [key: string]: {
    dashboardData: DashboardData | null;
    reportsData: ReportsData | null;
    ordersDetailData: OrdersDetailData | undefined;
    availableDates: AvailableDate[];
    timestamp: number;
  }
}

export const useReports = () => {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
  
  const [selectedModule, setSelectedModule] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.SELECTED_MODULE) || '';
    }
    return '';
  });
  
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [ordersDetailData, setOrdersDetailData] = useState<OrdersDetailData | undefined>(undefined);
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('excel');

  const [activeFilterStartDate, setActiveFilterStartDate] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_FILTER_START) || getMonthAgoDate();
    }
    return getMonthAgoDate();
  });
  
  const [activeFilterEndDate, setActiveFilterEndDate] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_FILTER_END) || getTodayDate();
    }
    return getTodayDate();
  });

  const isFetchingRef = useRef(false);
  const initialLoadDoneRef = useRef(false);
  const currentUserIdRef = useRef<string | null>(null);
  
  const moduleCacheRef = useRef<ModuleDataCache>({});

  useEffect(() => {
    if (activeFilterStartDate) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_FILTER_START, activeFilterStartDate);
    }
  }, [activeFilterStartDate]);

  useEffect(() => {
    if (activeFilterEndDate) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_FILTER_END, activeFilterEndDate);
    }
  }, [activeFilterEndDate]);

  useEffect(() => {
    if (selectedModule) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_MODULE, selectedModule);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SELECTED_MODULE);
    }
  }, [selectedModule]);

  const getAuthToken = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }, []);

  const checkAuth = useCallback(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/auth/login');
      return false;
    }
    return true;
  }, [router, getAuthToken]);

  const getUserDataFromStorage = useCallback((): UserWithId | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const userDataStr = localStorage.getItem('auth_user');
      if (!userDataStr) return null;
      
      const user = JSON.parse(userDataStr);
      
      let dataAccess = user.data_access || [];
      
      if (user.role === 'superadmin') {
        dataAccess = ['crsd1', 'crsd2', 'general'];
      }
      
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
    } catch {
      return null;
    }
  }, []);

  const resetAllData = useCallback(() => {
    setDashboardData(null);
    setReportsData(null);
    setOrdersDetailData(undefined);
    setAvailableDates([]);
    setError(null);
    setSuccessMessage(null);
    moduleCacheRef.current = {};
  }, []);

  useEffect(() => {
    const checkUserChange = () => {
      const user = getUserDataFromStorage();
      if (!user) return;
      
      if (currentUserIdRef.current && currentUserIdRef.current !== user.id) {
        resetAllData();
        setSelectedModule('');
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

  const transformDashboardData = useCallback((data: any): DashboardData => {
    if (!data) {
      return {
        orders: {
          total: 0,
          pending: 0,
          processing: 0,
          completed: 0,
          canceled: 0,
          today: 0,
          completedToday: 0
        },
        payments: {
          total_revenue: 0,
          pending_payments: 0,
          today_revenue: 0
        },
        users: {
          total_users: 0,
          total_admins: 0
        }
      };
    }

    return {
      orders: {
        total: data?.orders?.total || 0,
        pending: data?.orders?.pending || 0,
        processing: data?.orders?.processing || 0,
        completed: data?.orders?.completed || 0,
        canceled: data?.orders?.canceled || 0,
        today: data?.orders?.today || 0,
        completedToday: data?.orders?.completedToday || 0
      },
      payments: {
        total_revenue: data?.payments?.total_revenue || 0,
        pending_payments: data?.payments?.pending_payments || 0,
        today_revenue: data?.payments?.today_revenue || 0
      },
      users: {
        total_users: data?.users?.total_users || 0,
        total_admins: data?.users?.total_admins || 0
      }
    };
  }, []);

  const transformReportsData = useCallback((data: any): ReportsData => {
    if (!data) {
      return {
        total_orders: 0,
        orders_by_status: [],
        payment_summary: []
      };
    }

    return {
      total_orders: data.total_orders || 0,
      orders_by_status: data.orders_by_status || [],
      payment_summary: data.payment_summary || []
    };
  }, []);

  const mapToOrdersDetailData = useCallback((apiData: any, activeStart: string, activeEnd: string): OrdersDetailData | undefined => {
    try {
      if (!apiData) {
        return undefined;
      }
      
      if (!apiData?.orders_by_date?.length) {
        return undefined;
      }
      
      const ordersByDate = apiData.orders_by_date;
      
      const totalOrders = ordersByDate.reduce((sum: number, day: any) => sum + (day.total_orders || 0), 0);
      const totalRevenue = ordersByDate.reduce((sum: number, day: any) => sum + (day.daily_total || 0), 0);
      
      const mappedOrdersByDate: OrderByDate[] = ordersByDate.map((day: any) => {
        return {
          date: day.date,
          total_orders: day.total_orders || 0,
          daily_total: day.daily_total || 0,
          cumulative_total: day.cumulative_total || 0,
          orders: (day.orders || []).map((order: any) => ({
            order_id: order.order_id || order.id,
            order_number: order.order_number || order.order_code,
            customer: order.customer || '-',
            order_status: order.order_status || 'completed',
            payment_status: order.payment_status || 'paid',
            created_at: order.created_at,
            total: order.total || 0,
            items: (order.items || []).map((item: any) => ({
              name: item.name || '-',
              quantity: item.quantity || 0,
              price: item.price || 0,
              subtotal: item.subtotal || 0
            }))
          }))
        };
      });

      const result = {
        period: { 
          start_date: apiData.period?.start_date || activeStart, 
          end_date: apiData.period?.end_date || activeEnd 
        },
        summary: {
          total_orders: apiData.summary?.total_orders || totalOrders,
          total_revenue: apiData.summary?.total_revenue || totalRevenue,
          average_order_value: apiData.summary?.average_order_value || (totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0)
        },
        orders_by_date: mappedOrdersByDate
      };
      
      return result;
      
    } catch {
      return undefined;
    }
  }, []);

  const buildUrl = useCallback((baseUrl: string, params: Record<string, string>): string => {
    const url = new URL(baseUrl, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
    url.searchParams.append('_t', Date.now().toString());
    return url.toString();
  }, []);

  const getCacheKey = useCallback((module: string, start: string, end: string) => {
    return `${module}_${start}_${end}`;
  }, []);

  const getCachedData = useCallback((module: string, start: string, end: string) => {
    const cacheKey = getCacheKey(module, start, end);
    const cache = moduleCacheRef.current[cacheKey];
    if (!cache) return null;
    
    const CACHE_DURATION = 2 * 60 * 1000;
    if (Date.now() - cache.timestamp > CACHE_DURATION) {
      delete moduleCacheRef.current[cacheKey];
      return null;
    }
    
    return cache;
  }, [getCacheKey]);

  const setCachedData = useCallback((
    module: string,
    start: string,
    end: string,
    data: {
      dashboardData: DashboardData | null;
      reportsData: ReportsData | null;
      ordersDetailData: OrdersDetailData | undefined;
      availableDates: AvailableDate[];
    }
  ) => {
    const cacheKey = getCacheKey(module, start, end);
    moduleCacheRef.current[cacheKey] = {
      ...data,
      timestamp: Date.now()
    };
  }, [getCacheKey]);

  const fetchDashboard = useCallback(async (token: string, start: string, end: string, module?: string): Promise<DashboardData | null> => {
    try {
      const params: Record<string, string> = {
        start_date: start,
        end_date: end
      };
      
      if (module && module !== 'general') {
        params.crsd_type = module;
      }
      
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

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.success ? transformDashboardData(data.data) : null;
    } catch {
      return null;
    }
  }, [apiUrl, router, transformDashboardData, buildUrl]);

  const fetchReports = useCallback(async (token: string, start: string, end: string, module?: string): Promise<ReportsData | null> => {
    try {
      const params: Record<string, string> = {
        start_date: start,
        end_date: end
      };
      
      if (module && module !== 'general') {
        params.crsd_type = module;
      }
      
      const response = await fetch(buildUrl(`${apiUrl}/api/admin/reports`, params), {
        headers: { 
          Authorization: `Bearer ${token}`, 
          Accept: 'application/json',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-cache'
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return transformReportsData(data.data);
      } else if (data.success && !data.data) {
        return transformReportsData(null);
      }
      
      return null;
    } catch {
      return null;
    }
  }, [apiUrl, transformReportsData, buildUrl]);

  const fetchOrdersDetail = useCallback(async (token: string, start: string, end: string, module?: string): Promise<OrdersDetailData | undefined> => {
    try {
      const params: Record<string, string> = { 
        start_date: start, 
        end_date: end 
      };
      
      if (module) {
        params.crsd_type = module;
      }
      
      const response = await fetch(buildUrl(`${apiUrl}/api/admin/orders-detail`, params), {
        headers: { 
          Authorization: `Bearer ${token}`, 
          Accept: 'application/json',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-cache'
      });

      if (!response.ok) {
        return undefined;
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return mapToOrdersDetailData(data.data, start, end);
      }
      
      return undefined;
    } catch {
      return undefined;
    }
  }, [apiUrl, mapToOrdersDetailData, buildUrl]);

  const fetchModuleData = useCallback(async (token: string, start: string, end: string, module: string) => {
    const cached = getCachedData(module, start, end);
    if (cached) {
      setDashboardData(cached.dashboardData);
      setReportsData(cached.reportsData);
      setOrdersDetailData(cached.ordersDetailData);
      setAvailableDates(cached.availableDates);
      return;
    }

    setDashboardData(null);
    setReportsData(null);
    setOrdersDetailData(undefined);
    setAvailableDates([]);
    
    try {
      const [dashboardResult, reportsResult, ordersDetailResult] = await Promise.all([
        fetchDashboard(token, start, end, module),
        fetchReports(token, start, end, module),
        fetchOrdersDetail(token, start, end, module)
      ]);

      let newAvailableDates: AvailableDate[] = [];
      if (ordersDetailResult?.orders_by_date) {
        newAvailableDates = ordersDetailResult.orders_by_date.map(day => ({
          date: day.date,
          has_data: day.total_orders > 0
        }));
      }

      setDashboardData(dashboardResult);
      setReportsData(reportsResult);
      setOrdersDetailData(ordersDetailResult);
      setAvailableDates(newAvailableDates);

      setCachedData(module, start, end, {
        dashboardData: dashboardResult,
        reportsData: reportsResult,
        ordersDetailData: ordersDetailResult,
        availableDates: newAvailableDates
      });
    } catch {
      setError('Gagal memuat data module');
    }
  }, [fetchDashboard, fetchReports, fetchOrdersDetail, getCachedData, setCachedData]);

  const fetchAllData = useCallback(async (start: string, end: string, module?: string, force = false) => {
    if (isFetchingRef.current && !force) return;

    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      if (!checkAuth()) return;

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

      const isSuperadmin = user.role === 'superadmin';
      const needsModuleSelection = (isSuperadmin || user.hasMultipleAccess) && !moduleToUse;

      if (needsModuleSelection) {
        setShowModuleSelection(true);
        setIsLoading(false);
        return;
      }

      if (!moduleToUse && !user.hasMultipleAccess && !isSuperadmin) {
        const defaultModule = user.data_access.includes('crsd1') ? 'crsd1' : 
                             user.data_access.includes('crsd2') ? 'crsd2' : '';
        if (defaultModule) {
          setSelectedModule(defaultModule);
          await fetchModuleData(token, start, end, defaultModule);
        }
        return;
      }

      if (moduleToUse && moduleToUse !== 'general' && !isSuperadmin && !user.data_access.includes(moduleToUse)) {
        setError('Anda tidak memiliki akses ke modul ini');
        setSelectedModule('');
        if (user.hasMultipleAccess) setShowModuleSelection(true);
        return;
      }

      if (moduleToUse) {
        await fetchModuleData(token, start, end, moduleToUse);
        setShowModuleSelection(false);
      }

    } catch {
      setError('Gagal memuat data');
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [apiUrl, selectedModule, fetchModuleData, getUserDataFromStorage, checkAuth, getAuthToken]);

  useEffect(() => {
    if (initialLoadDoneRef.current) return;

    const initialize = async () => {
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }

      if (!checkAuth()) return;

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

      if (user.role === 'superadmin' || user.hasMultipleAccess) {
        if (selectedModule) {
          await fetchAllData(activeFilterStartDate, activeFilterEndDate, selectedModule, true);
        } else {
          setShowModuleSelection(true);
          setIsLoading(false);
        }
        initialLoadDoneRef.current = true;
        return;
      }

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
      } else {
        setIsLoading(false);
      }
      
      initialLoadDoneRef.current = true;
    };

    initialize();
  }, []);

  const handleModuleSelect = useCallback(async (module: string) => {
    setIsLoading(true);
    setError(null);
    
    const user = getUserDataFromStorage();
    
    if (user && module !== 'general') {
      const isSuperadmin = user.role === 'superadmin';
      if (!isSuperadmin && !user.data_access.includes(module)) {
        setError('Anda tidak memiliki akses ke modul ini');
        setIsLoading(false);
        return;
      }
    }
    
    setSelectedModule(module);
    setShowModuleSelection(false);

    if (!checkAuth()) return;

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

    const moduleName = module === 'general' ? 'Umum' : 
                      module === 'crsd1' ? 'CRSD 1' : 'CRSD 2';
    
    setSuccessMessage(`Dashboard ${moduleName} berhasil dimuat`);
    setTimeout(() => setSuccessMessage(null), 3000);
  }, [apiUrl, activeFilterStartDate, activeFilterEndDate, startDate, endDate, fetchAllData, getUserDataFromStorage, checkAuth, getAuthToken]);

  const handleChangeModule = useCallback(() => {
    setSelectedModule('');
    setShowModuleSelection(true);
    resetAllData();
  }, [resetAllData]);

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
    
    if (selectedModule) {
      const prefix = selectedModule;
      Object.keys(moduleCacheRef.current).forEach(key => {
        if (key.startsWith(prefix)) {
          delete moduleCacheRef.current[key];
        }
      });
    }
    
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
    } catch {
      setError('Gagal export');
    } finally {
      setIsExporting(false);
    }
  }, [ordersDetailData, exportFormat]);

  const handleRefresh = useCallback(() => {
    if (selectedModule) {
      const prefix = selectedModule;
      Object.keys(moduleCacheRef.current).forEach(key => {
        if (key.startsWith(prefix)) {
          delete moduleCacheRef.current[key];
        }
      });
    }
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