import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { StatisticsData, FilterType, ExpandedSections, PieChartData, RechartsPieDataItem } from '../types';
import * as Formatters from '../utils/formatters';
import { STATUS_COLORS } from '../utils/constants';

export type FormattersType = {
  currency: (value: number) => string;
  number: (value: number) => string;
  date: (value: string) => string;
  shortDate: (value: string) => string;
  percentage: (value: number) => string;
};

export const useStatistics = () => {
  const router = useRouter();
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [chartData, setChartData] = useState<Array<{ date: string; orders: number; revenue: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('bulan-ini');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    ringkasan: true,
    grafik: true,
    status: true,
    performa: true
  });
  const [isExporting, setIsExporting] = useState(false);
  
  const initialLoadRef = useRef(false);
  const prevFilterTypeRef = useRef<FilterType>('bulan-ini');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const getStartDateByFilter = useCallback((filter: FilterType): string => {
    switch (filter) {
      case 'hari-ini':
        return Formatters.getTodayDate();
        
      case 'minggu-ini': {
        const today = new Date();
        const day = today.getDay();
        const diffToMonday = day === 0 ? 6 : day - 1;
        const monday = new Date(today);
        monday.setDate(today.getDate() - diffToMonday);
        monday.setHours(0, 0, 0, 0);
        return Formatters.formatDateForAPI(monday);
      }
        
      case 'bulan-ini':
        return Formatters.getFirstDayOfMonth();
        
      case 'kustom':
        return customStartDate || Formatters.getTodayDate();
        
      default:
        return Formatters.getTodayDate();
    }
  }, [customStartDate]);

  const getEndDateByFilter = useCallback((filter: FilterType): string => {
    switch (filter) {
      case 'hari-ini':
        return Formatters.getTodayDate();
        
      case 'minggu-ini': {
        const today = new Date();
        const day = today.getDay();
        const diffToSunday = day === 0 ? 0 : 7 - day;
        const sunday = new Date(today);
        sunday.setDate(today.getDate() + diffToSunday);
        sunday.setHours(23, 59, 59, 999);
        return Formatters.formatDateForAPI(sunday);
      }
        
      case 'bulan-ini':
        return Formatters.getTodayDate();
        
      case 'kustom':
        return customEndDate || Formatters.getTodayDate();
        
      default:
        return Formatters.getTodayDate();
    }
  }, [customEndDate]);

  const validateCustomDates = useCallback((start: string, end: string): boolean => {
    if (!start || !end) {
      setError('Silakan pilih tanggal mulai dan tanggal selesai');
      return false;
    }
    if (new Date(start) > new Date(end)) {
      setError('Tanggal mulai harus lebih awal dari tanggal selesai');
      return false;
    }
    return true;
  }, []);

  const fetchStatistics = useCallback(async (startDate?: string, endDate?: string, showError = true) => {
    try {
      if (!statistics) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      setError(null);

      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const finalStartDate = startDate || getStartDateByFilter(filterType);
      const finalEndDate = endDate || getEndDateByFilter(filterType);

      const params = new URLSearchParams({
        start_date: finalStartDate,
        end_date: finalEndDate
      });

      const url = `${apiUrl}/api/admin/statistics?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      if (response.status === 401) {
        router.push('/auth/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Gagal mengambil data');
      }

      const data = await response.json();

      if (data.success && data.data) {
        setStatistics(data.data);
        setChartData(data.data.chartData || []);
        setError(null);
      } else {
        throw new Error(data.message || 'Gagal memuat data');
      }
    } catch (err) {
      if (showError) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [apiUrl, router, statistics, filterType, getStartDateByFilter, getEndDateByFilter]);

  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      
      const today = Formatters.getTodayDate();
      const firstDayOfMonth = Formatters.getFirstDayOfMonth();

      setCustomStartDate(firstDayOfMonth);
      setCustomEndDate(today);

      fetchStatistics(firstDayOfMonth, today, false);
    }
  }, []); 

  useEffect(() => {
    if (filterType !== 'kustom' && filterType !== prevFilterTypeRef.current) {
      prevFilterTypeRef.current = filterType;
      
      const startDate = getStartDateByFilter(filterType);
      const endDate = getEndDateByFilter(filterType);
      fetchStatistics(startDate, endDate, false);
    }
  }, [filterType, getStartDateByFilter, getEndDateByFilter, fetchStatistics]); 

  const pieChartData = useMemo<PieChartData>(() => {
    if (!statistics) {
      return {
        data: [],
        colors: [],
        percentages: { completed: 0, processing: 0, canceled: 0 },
        rechartsData: []
      };
    }

    const total = statistics.completedOrders + statistics.processingOrders + statistics.canceledOrders;

    const data = [
      {
        name: 'Selesai',
        value: statistics.completedOrders,
        color: STATUS_COLORS.completed,
        percentage: total > 0 ? (statistics.completedOrders / total) * 100 : 0
      },
      {
        name: 'Diproses',
        value: statistics.processingOrders,
        color: STATUS_COLORS.processing,
        percentage: total > 0 ? (statistics.processingOrders / total) * 100 : 0
      },
      {
        name: 'Dibatalkan',
        value: statistics.canceledOrders,
        color: STATUS_COLORS.canceled,
        percentage: total > 0 ? (statistics.canceledOrders / total) * 100 : 0
      }
    ].filter(item => item.value > 0);

    const colors = data.map(item => item.color);
    
    const rechartsData: RechartsPieDataItem[] = data.map(item => ({
      name: item.name,
      value: item.value,
      color: item.color
    }));

    return {
      data,
      colors,
      rechartsData,
      percentages: {
        completed: total > 0 ? (statistics.completedOrders / total) * 100 : 0,
        processing: total > 0 ? (statistics.processingOrders / total) * 100 : 0,
        canceled: total > 0 ? (statistics.canceledOrders / total) * 100 : 0
      }
    };
  }, [statistics]);

  const handleFilterChange = useCallback((type: FilterType) => {
    setFilterType(type);
    setError(null);
  }, []);

  const handleCustomDateFilter = useCallback(() => {
    if (validateCustomDates(customStartDate, customEndDate)) {
      fetchStatistics(customStartDate, customEndDate);
    }
  }, [customStartDate, customEndDate, fetchStatistics, validateCustomDates]);

  const handleExportData = useCallback(async () => {
    if (!statistics) return;

    setIsExporting(true);
    try {
      const exportData = {
        ...statistics,
        periode: {
          filter: filterType,
          tanggal: {
            mulai: getStartDateByFilter(filterType),
            selesai: getEndDateByFilter(filterType)
          },
          diekspor: new Date().toISOString()
        }
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `statistik-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Gagal mengekspor data');
    } finally {
      setIsExporting(false);
    }
  }, [statistics, filterType, getStartDateByFilter, getEndDateByFilter]);

  const handleRefresh = useCallback(() => {
    fetchStatistics(undefined, undefined, true);
  }, [fetchStatistics]);

  const handleToggleSection = useCallback((section: keyof ExpandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const handleResetError = useCallback(() => {
    setError(null);
  }, []);

  const formatters = useMemo<FormattersType>(() => ({
    currency: Formatters.formatCurrency,
    number: Formatters.formatNumber,
    date: Formatters.formatDate,
    shortDate: Formatters.formatShortDate,
    percentage: Formatters.formatPercentage
  }), []);

  const completionRate = useMemo(() => {
    if (!statistics || statistics.totalOrders === 0) return 0;
    return (statistics.completedOrders / statistics.totalOrders) * 100;
  }, [statistics]);

  const processingRate = useMemo(() => {
    if (!statistics || statistics.totalOrders === 0) return 0;
    return (statistics.processingOrders / statistics.totalOrders) * 100;
  }, [statistics]);

  const cancellationRate = useMemo(() => {
    if (!statistics || statistics.totalOrders === 0) return 0;
    return (statistics.canceledOrders / statistics.totalOrders) * 100;
  }, [statistics]);

  const hasChartData = chartData.length > 0;
  const hasPieData = pieChartData.data.length > 0;

  return {
    statistics,
    chartData,
    pieChartData,
    
    isLoading,
    isRefreshing,
    isExporting,
    error,
    filterType,
    customStartDate,
    customEndDate,
    expandedSections,
    
    formatters,
    completionRate,
    processingRate,
    cancellationRate,
    hasChartData,
    hasPieData,
    
    setCustomStartDate,
    setCustomEndDate,
    handleFilterChange,
    handleCustomDateFilter,
    handleExportData,
    handleRefresh,
    handleToggleSection,
    handleResetError,
    
    FILTER_OPTIONS: [
      { key: 'hari-ini', label: 'Hari Ini' },
      { key: 'minggu-ini', label: 'Minggu Ini (Senin-Minggu)' },
      { key: 'bulan-ini', label: 'Bulan Ini' },
      { key: 'kustom', label: 'Kustom' }
    ]
  };
};