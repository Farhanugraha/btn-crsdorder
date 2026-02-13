import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import type { Payment, DateRange, PaymentsStats } from '../types';
import * as PaymentUtils from '../utils/paymentUtils';
import { PER_PAGE } from '../utils/constants';

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter states - DEFAULT: Hari Ini
  const [search, setSearch] = useState('');
  const [datePreset, setDatePreset] = useState<string>('today');
  const [dateRange, setDateRange] = useState<DateRange>({ start: '', end: '' });

  // UI states
  const [page, setPage] = useState(1);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // ============= FETCH PAYMENTS =============
  const fetchPayments = useCallback(async () => {
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
        setPage(1);
      } else {
        setError('❌ Gagal memuat data pembayaran');
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('❌ Gagal memuat pembayaran. Periksa koneksi Anda.');
      setPayments([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // ============= HANDLERS =============
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchPayments();
  }, [fetchPayments]);

  const handleTodayFilter = useCallback(() => {
    setDatePreset('today');
    setDateRange({ start: '', end: '' });
    setPage(1);
    setShowMobileFilters(false);
  }, []);

  const handleResetFilters = useCallback(() => {
    setDatePreset('today');
    setDateRange({ start: '', end: '' });
    setSearch('');
    setPage(1);
    setShowMobileFilters(false);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleDatePresetChange = useCallback((value: string) => {
    setDatePreset(value);
    setDateRange({ start: '', end: '' });
    setPage(1);
  }, []);

  const handleDateRangeChange = useCallback((range: DateRange) => {
    setDateRange(range);
    setDatePreset(''); // Clear preset when using custom range
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // ============= FILTERED PAYMENTS =============
  const filteredPayments = useMemo(() => {
    let filtered = [...payments];
    
    // Filter berdasarkan pencarian
    filtered = PaymentUtils.filterPaymentsBySearch(filtered, search);
    
    // Filter berdasarkan tanggal preset
    if (datePreset) {
      filtered = PaymentUtils.filterPaymentsByDatePreset(filtered, datePreset);
    }
    
    // Filter berdasarkan range tanggal
    if (dateRange.start || dateRange.end) {
      filtered = PaymentUtils.filterPaymentsByDateRange(filtered, dateRange);
    }
    
    return filtered;
  }, [payments, search, datePreset, dateRange]);

  // ============= STATISTICS - SEMUA MENGIKUTI FILTER =============
  const stats = useMemo(() => {
    return PaymentUtils.calculateStats(payments, datePreset, dateRange);
  }, [payments, datePreset, dateRange]);

  // ============= PAGINATION =============
  const totalPages = PaymentUtils.getTotalPages(filteredPayments.length, PER_PAGE);
  const paginatedPayments = PaymentUtils.paginatePayments(filteredPayments, page, PER_PAGE);

  // ============= COMPUTED VALUES =============
  const hasActiveFilters = PaymentUtils.hasActiveFilters(search, datePreset, dateRange);
  const dateDisplayText = PaymentUtils.getDateDisplayText(datePreset, dateRange);

  return {
    // Data
    payments,
    filteredPayments,
    paginatedPayments,
    stats,
    
    // Loading states
    loading,
    isRefreshing,
    error,
    setError,
    
    // Filter states
    search,
    datePreset,
    dateRange,
    
    // UI states
    page,
    totalPages,
    showMobileFilters,
    setShowMobileFilters,
    hasActiveFilters,
    dateDisplayText,
    
    // Handlers
    handleSearchChange: setSearch,
    handleDatePresetChange,
    handleDateRangeChange,
    handleTodayFilter,
    handleResetFilters,
    handleRefresh,
    handlePageChange: setPage,
    
    // Constants
    PER_PAGE
  };
};