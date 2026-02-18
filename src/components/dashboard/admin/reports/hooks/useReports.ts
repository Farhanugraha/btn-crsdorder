import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { 
  DashboardData, 
  ReportsData, 
  OrdersDetailData, 
  ExportFormat,
  Order,
  OrderItem,
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

// Key untuk localStorage
const STORAGE_KEYS = {
  SELECTED_MODULE: 'reports_selected_module',
  ACTIVE_FILTER_START: 'reports_active_start',
  ACTIVE_FILTER_END: 'reports_active_end'
};

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
  
  // User data
  const [userData, setUserData] = useState<UserData>({
    data_access: [],
    role: '',
    divisi: null,
    hasMultipleAccess: false,
    defaultModule: ''
  });
  
  // Selected module - load dari localStorage
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

  // Track current active filter dates
  const [activeFilterStartDate, setActiveFilterStartDate] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_FILTER_START) || '';
    }
    return '';
  });
  
  const [activeFilterEndDate, setActiveFilterEndDate] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_FILTER_END) || '';
    }
    return '';
  });

  // Ref untuk mencegah multiple fetch
  const isFetchingRef = useRef(false);
  const initialLoadDoneRef = useRef(false);

  // ============= SAVE TO LOCALSTORAGE =============
  useEffect(() => {
    if (selectedModule) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_MODULE, selectedModule);
    }
  }, [selectedModule]);

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

  // ============= AUTH HELPER =============
  const getAuthToken = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/auth/login');
      return null;
    }
    return token;
  }, [router]);

  // ============= GET USER DATA FROM LOCALSTORAGE =============
  const getUserDataFromStorage = useCallback((): UserData | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      // Ambil dari auth_user
      const userDataStr = localStorage.getItem('auth_user');
      if (userDataStr) {
        const user = JSON.parse(userDataStr);
        
        const dataAccess = user.data_access || [];
        const hasMultiple = dataAccess.filter((a: string) => 
          ['crsd1', 'crsd2'].includes(a)
        ).length > 1;
        
        // Tentukan default module
        let defaultModule = '';
        if (dataAccess.includes('crsd1') && dataAccess.includes('crsd2')) {
          defaultModule = 'general';
        } else if (dataAccess.includes('crsd1')) {
          defaultModule = 'crsd1';
        } else if (dataAccess.includes('crsd2')) {
          defaultModule = 'crsd2';
        }
        
        return {
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

  // ============= TRANSFORM DATA =============
  const transformDashboardData = useCallback((data: any): DashboardData => ({
    orders: {
      total: data.orders?.total || 0
    },
    payments: {
      total_revenue: data.payments?.total_revenue || 0
    }
  }), []);

  const transformReportsData = useCallback((data: any): ReportsData => ({
    total_orders: data.total_orders || 0,
    orders_by_status: data.orders_by_status || [],
    payment_summary: data.payment_summary || []
  }), []);

  const mapToOrdersDetailData = useCallback((apiData: any, activeStart: string, activeEnd: string): OrdersDetailData | null => {
    try {
      if (!apiData) return null;
      
      const ordersByDate = apiData.orders_by_date || [];
      
      if (ordersByDate.length === 0) {
        return null;
      }
      
      const totalOrders = ordersByDate.reduce(
        (sum: number, day: any) => sum + (day.total_orders || 0), 
        0
      );
      const totalRevenue = ordersByDate.reduce(
        (sum: number, day: any) => sum + (day.daily_total || 0), 
        0
      );
      
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
      return null;
    }
  }, []);

  // ✅ PERBAIKI: Gunakan parameter di URL, bukan endpoint khusus
  const getDashboardEndpoint = useCallback((module?: string): string => {
    const baseUrl = `${apiUrl}/api/admin/dashboard`;
    
    // Jika ada module dan bukan general, tambahkan sebagai query parameter
    if (module && module !== 'general') {
      return `${baseUrl}?crsd_type=${module}`;
    }
    
    return baseUrl;
  }, [apiUrl]);

  const getReportsEndpoint = useCallback((module?: string): string => {
    const baseUrl = `${apiUrl}/api/admin/reports`;
    
    // Jika ada module dan bukan general, tambahkan sebagai query parameter
    if (module && module !== 'general') {
      return `${baseUrl}?crsd_type=${module}`;
    }
    
    return baseUrl;
  }, [apiUrl]);

  const getOrdersDetailEndpoint = useCallback((module?: string): string => {
    const baseUrl = `${apiUrl}/api/admin/orders-detail`;
    
    // Jika ada module dan bukan general, tambahkan sebagai query parameter
    if (module && module !== 'general') {
      return `${baseUrl}?crsd_type=${module}`;
    }
    
    return baseUrl;
  }, [apiUrl]);

  // ============= FETCH DASHBOARD =============
  const fetchDashboard = useCallback(async (token: string, module?: string): Promise<boolean> => {
    try {
      const endpoint = getDashboardEndpoint(module);
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        },
        cache: 'no-cache'
      });

      if (response.status === 401) {
        router.push('/auth/login');
        return false;
      }

      if (response.status === 403) {
        console.error('Forbidden access to:', endpoint);
        setError('Anda tidak memiliki akses ke modul ini');
        return false;
      }

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setDashboardData(transformDashboardData(data.data));
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      return false;
    }
  }, [apiUrl, router, transformDashboardData, getDashboardEndpoint]);

  // ============= FETCH REPORTS =============
  const fetchReports = useCallback(async (token: string, module?: string): Promise<boolean> => {
    try {
      const params = new URLSearchParams();
      if (activeFilterStartDate) {
        params.append('start_date', activeFilterStartDate);
      }
      if (activeFilterEndDate) {
        params.append('end_date', activeFilterEndDate);
      }
      
      const endpoint = getReportsEndpoint(module);
      
      // Gabungkan params
      const url = new URL(endpoint, window.location.origin);
      if (params.toString()) {
        url.search = params.toString();
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        },
        cache: 'no-cache'
      });

      if (response.status === 403) {
        console.error('Forbidden access to reports:', endpoint);
        return false;
      }

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setReportsData(transformReportsData(data.data));
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error('Reports fetch error:', err);
      return false;
    }
  }, [apiUrl, activeFilterStartDate, activeFilterEndDate, transformReportsData, getReportsEndpoint]);

  // ✅ PERBAIKI: Fetch orders detail dengan query parameters yang benar
  const fetchOrdersDetail = useCallback(async (token: string, start: string, end: string, module?: string): Promise<boolean> => {
    try {
      const params = new URLSearchParams({
        start_date: start,
        end_date: end
      });

      const endpoint = getOrdersDetailEndpoint(module);
      
      // Gabungkan params
      const url = new URL(endpoint, window.location.origin);
      
      // Jika endpoint sudah punya query params, gabungkan dengan yang baru
      if (url.search) {
        const existingParams = new URLSearchParams(url.search);
        existingParams.forEach((value, key) => {
          params.append(key, value);
        });
      }
      
      url.search = params.toString();
      
      console.log('Fetching orders detail from:', url.toString());

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        },
        cache: 'no-cache'
      });

      if (response.status === 403) {
        console.error('Forbidden access to orders detail:', endpoint);
        return false;
      }

      if (response.status === 404) {
        console.log('No orders detail found for this period');
        setOrdersDetailData(undefined);
        return false;
      }

      if (response.ok) {
        const data = await response.json();
        console.log('Orders detail response:', data);
        
        if (data.success) {
          if (data.data) {
            const mappedData = mapToOrdersDetailData(data.data, activeFilterStartDate, activeFilterEndDate);
            if (mappedData) {
              setOrdersDetailData(mappedData);
              return true;
            } else {
              setOrdersDetailData(undefined);
              return false;
            }
          } else {
            setOrdersDetailData(undefined);
            return false;
          }
        } else {
          setOrdersDetailData(undefined);
          return false;
        }
      }
      
      setOrdersDetailData(undefined);
      return false;
    } catch (err) {
      console.error('Orders detail fetch error:', err);
      setOrdersDetailData(undefined);
      return false;
    }
  }, [apiUrl, activeFilterStartDate, activeFilterEndDate, mapToOrdersDetailData, getOrdersDetailEndpoint]);

  // ============= FETCH ALL DATA =============
  const fetchAllData = useCallback(async (start: string, end: string, module?: string, force = false) => {
    if (isFetchingRef.current && !force) {
      console.log('Fetch already in progress, skipping...');
      return;
    }

    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token || !apiUrl) {
        setError('Konfigurasi tidak lengkap');
        return;
      }

      // Fetch semua data dengan module yang ditentukan
      const moduleToUse = module || selectedModule;
      
      await Promise.all([
        fetchDashboard(token, moduleToUse),
        fetchReports(token, moduleToUse),
        fetchOrdersDetail(token, start, end, moduleToUse)
      ]);

    } catch (err) {
      console.error('Error in fetchAllData:', err);
      setError(err instanceof Error ? err.message : 'Gagal memuat data');
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [apiUrl, getAuthToken, selectedModule, fetchDashboard, fetchReports, fetchOrdersDetail]);

  // ============= INITIAL LOAD =============
  useEffect(() => {
    if (initialLoadDoneRef.current) return;

    const initialize = async () => {
      const token = getAuthToken();
      if (!token || !apiUrl) {
        setError('Konfigurasi tidak lengkap');
        setIsLoading(false);
        return;
      }

      // Dapatkan data user dari localStorage
      const user = getUserDataFromStorage();
      if (user) {
        setUserData(user);
        setAvailableModules(user.data_access);
        
        // Tentukan module yang akan digunakan
        let moduleToUse = selectedModule;
        
        // Jika user hanya punya satu akses, paksa module tersebut
        if (!user.hasMultipleAccess) {
          if (user.data_access.includes('crsd1')) {
            moduleToUse = 'crsd1';
          } else if (user.data_access.includes('crsd2')) {
            moduleToUse = 'crsd2';
          }
        }
        
        // Jika belum ada selectedModule, gunakan default
        if (!moduleToUse && user.defaultModule) {
          moduleToUse = user.defaultModule;
        }
        
        // Set selected module
        if (moduleToUse) {
          setSelectedModule(moduleToUse);
        }
        
        // Tampilkan module selection hanya jika user punya multiple access
        setShowModuleSelection(user.hasMultipleAccess && !moduleToUse);
      }

      // Set default dates
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

      // Fetch data dengan module yang sudah ditentukan
      await fetchAllData(
        activeFilterStartDate || monthAgo,
        activeFilterEndDate || today,
        selectedModule,
        true
      );
      
      initialLoadDoneRef.current = true;
    };

    initialize();
  }, []);

  // ============= HANDLERS =============
  const handleModuleSelect = useCallback(async (module: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      setSelectedModule(module);
      setShowModuleSelection(false);

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

    } catch (err) {
      console.error('Module select error:', err);
      setError(err instanceof Error ? err.message : 'Gagal memilih modul');
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, getAuthToken, activeFilterStartDate, activeFilterEndDate, startDate, endDate, fetchAllData]);

  const handleApplyFilter = useCallback((): void => {
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

  const handleExport = useCallback(async (): Promise<void> => {
    try {
      setIsExporting(true);
      setError(null);

      console.log('Orders detail data for export:', ordersDetailData);

      if (!ordersDetailData) {
        setError('Data pesanan tidak tersedia. Silakan refresh halaman.');
        setIsExporting(false);
        return;
      }

      if (!ordersDetailData.orders_by_date || ordersDetailData.orders_by_date.length === 0) {
        setError('Tidak ada data pesanan untuk periode yang dipilih. Silakan ubah tanggal filter.');
        setIsExporting(false);
        return;
      }

      const hasAnyOrders = ordersDetailData.orders_by_date.some(
        day => day.orders && day.orders.length > 0
      );

      if (!hasAnyOrders) {
        setError('Tidak ada detail pesanan untuk periode yang dipilih.');
        setIsExporting(false);
        return;
      }

      switch (exportFormat) {
        case 'csv': {
          const csvContent = generateOrdersAuditCSV(ordersDetailData);
          downloadFile(
            csvContent,
            `audit-orders-${ordersDetailData.period.start_date}-to-${ordersDetailData.period.end_date}.csv`,
            'text/csv;charset=utf-8'
          );
          break;
        }

        case 'excel': {
          await generateOrdersAuditExcel(ordersDetailData);
          break;
        }

        case 'pdf': {
          await generateOrdersAuditPDF(ordersDetailData);
          break;
        }

        case 'txt': {
          const txtContent = generateOrdersAuditTXT(ordersDetailData);
          downloadFile(
            txtContent,
            `audit-orders-${ordersDetailData.period.start_date}-to-${ordersDetailData.period.end_date}.txt`,
            'text/plain;charset=utf-8'
          );
          break;
        }

        default:
          throw new Error('Format export tidak diketahui');
      }

      setSuccessMessage(
        `Export ${exportFormat.toUpperCase()} berhasil dibuat untuk periode ${activeFilterStartDate} s/d ${activeFilterEndDate}`
      );
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (err) {
      console.error('Export error:', err);
      setError(err instanceof Error ? err.message : 'Gagal export laporan');
    } finally {
      setIsExporting(false);
    }
  }, [ordersDetailData, exportFormat, activeFilterStartDate, activeFilterEndDate]);

  const handleRefresh = useCallback(() => {
    fetchAllData(activeFilterStartDate, activeFilterEndDate, selectedModule, true);
  }, [activeFilterStartDate, activeFilterEndDate, selectedModule, fetchAllData]);

  const handleCloseModuleSelection = useCallback(() => {
    setShowModuleSelection(false);
  }, []);

  const handleOpenModuleSelection = useCallback(() => {
    if (userData.hasMultipleAccess) {
      setShowModuleSelection(true);
    }
  }, [userData.hasMultipleAccess]);

  const handleResetError = useCallback(() => {
    setError(null);
  }, []);

  const handleResetSuccess = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  const isDateAvailable = useCallback((date: string): boolean => {
    const available = availableDates.find(d => d.date === date);
    return available ? available.has_data : true;
  }, [availableDates]);

  return {
    // Data
    dashboardData,
    reportsData,
    ordersDetailData,
    availableDates,
    
    // User data
    userData,
    selectedModule,
    showModuleSelection,
    availableModules,
    
    // States
    isLoading,
    isExporting,
    error,
    successMessage,
    
    // Filter states
    startDate,
    endDate,
    exportFormat,
    activeFilterStartDate,
    activeFilterEndDate,
    
    // Setters
    setStartDate,
    setEndDate,
    setExportFormat,
    
    // Handlers
    handleModuleSelect,
    handleApplyFilter,
    handleExport,
    handleRefresh,
    handleCloseModuleSelection,
    handleOpenModuleSelection,
    handleResetError,
    handleResetSuccess,
    
    // Helpers
    isDateAvailable
  };
};