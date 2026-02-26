import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthData, PaginatedResponse, FilterRole, AlertState } from '../types';
import { API_ENDPOINTS, MESSAGES } from '../constants';

export const useUserManagement = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<FilterRole>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [alert, setAlert] = useState<AlertState>({ type: null, message: null });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState<number | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const getApiUrl = useCallback((): string => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl?.includes('/api')) return envUrl;
    if (envUrl) return `${envUrl}/api`;
    return 'http://localhost:8000/api';
  }, []);

  const getAuthToken = useCallback((): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem('auth_token');
    } catch {
      return null;
    }
  }, []);

  const showAlert = useCallback((type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: null, message: null }), 3000);
  }, []);

  const checkAuthentication = useCallback(() => {
    try {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('auth_user');

      if (!token || !userStr) {
        setIsAuthenticated(false);
        showAlert('error', MESSAGES.UNAUTHORIZED);
        setTimeout(() => router.push('/auth/login'), 2000);
        return;
      }

      const userData = JSON.parse(userStr);
      if (userData.role !== 'superadmin') {
        setIsAuthenticated(false);
        showAlert('error', MESSAGES.FORBIDDEN);
        setTimeout(() => router.push('/dashboard'), 2000);
        return;
      }

      setAuthData({ token, user: userData });
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
      showAlert('error', 'Terjadi kesalahan pada autentikasi');
      setTimeout(() => router.push('/auth/login'), 2000);
    }
  }, [router, showAlert]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      const token = getAuthToken();
      if (!token) {
        showAlert('error', 'Token tidak ditemukan');
        setIsAuthenticated(false);
        setTimeout(() => router.push('/auth/login'), 2000);
        return;
      }

      const apiUrl = getApiUrl();
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        per_page: perPage.toString()
      });

      if (searchTerm) queryParams.append('search', searchTerm);
      if (filterRole !== 'all') queryParams.append('role', filterRole);

      const response = await fetch(`${apiUrl}${API_ENDPOINTS.USERS}?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          setIsAuthenticated(false);
          router.push('/auth/login');
          return;
        }
        throw new Error(MESSAGES.FETCH_ERROR);
      }

      const result: PaginatedResponse = await response.json();
      
      if (result.success) {
        setUsers(result.data.data);
        setTotalPages(result.data.last_page);
        setTotalUsers(result.data.total);
      }
    } catch (err) {
      showAlert('error', err instanceof Error ? err.message : MESSAGES.FETCH_ERROR);
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, searchTerm, filterRole, getAuthToken, getApiUrl, router, showAlert]);

  const handleDeleteUser = useCallback(async (id: number) => {
    try {
      setIsProcessing(true);
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`${getApiUrl()}${API_ENDPOINTS.DELETE(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      showAlert('success', MESSAGES.DELETE_SUCCESS);
      setShowDeleteConfirm(null);
      setShowMobileMenu(null);
      
      // Optimistic update
      setUsers(prev => prev.filter(user => user.id !== id));
      setTotalUsers(prev => prev - 1);
      
      // Refresh jika halaman kosong
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        await fetchUsers();
      }
    } catch (err) {
      showAlert('error', err instanceof Error ? err.message : 'Gagal menghapus user');
    } finally {
      setIsProcessing(false);
    }
  }, [getAuthToken, getApiUrl, fetchUsers, showAlert, users.length, currentPage]);

  const handleActivateUser = useCallback(async (id: number) => {
    try {
      setIsProcessing(true);
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`${getApiUrl()}${API_ENDPOINTS.ACTIVATE(id)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      showAlert('success', MESSAGES.ACTIVATE_SUCCESS);
      setShowMobileMenu(null);
      
      // Optimistic update
      setUsers(prev => prev.map(user => 
        user.id === id 
          ? { ...user, email_verified_at: new Date().toISOString() }
          : user
      ));
      
      await fetchUsers();
    } catch (err) {
      showAlert('error', err instanceof Error ? err.message : 'Gagal mengaktifkan user');
    } finally {
      setIsProcessing(false);
    }
  }, [getAuthToken, getApiUrl, fetchUsers, showAlert]);

  const handleDeactivateUser = useCallback(async (id: number) => {
    try {
      setIsProcessing(true);
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`${getApiUrl()}${API_ENDPOINTS.DEACTIVATE(id)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      showAlert('success', MESSAGES.DEACTIVATE_SUCCESS);
      setShowMobileMenu(null);
      
      // Optimistic update
      setUsers(prev => prev.map(user => 
        user.id === id 
          ? { ...user, email_verified_at: null }
          : user
      ));
      
      await fetchUsers();
    } catch (err) {
      showAlert('error', err instanceof Error ? err.message : 'Gagal menonaktifkan user');
    } finally {
      setIsProcessing(false);
    }
  }, [getAuthToken, getApiUrl, fetchUsers, showAlert]);

  useEffect(() => {
    setMounted(true);
    checkAuthentication();
  }, [checkAuthentication]);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      fetchUsers();
    }
  }, [mounted, isAuthenticated, fetchUsers]);

  return {
    // State
    mounted,
    isAuthenticated,
    authData,
    users,
    loading,
    searchTerm,
    filterRole,
    currentPage,
    perPage,
    totalPages,
    totalUsers,
    alert,
    isProcessing,
    showDeleteConfirm,
    showMobileMenu,
    showFilterPanel,
    
    // Setters
    setSearchTerm,
    setFilterRole,
    setCurrentPage,
    setPerPage,
    setShowDeleteConfirm,
    setShowMobileMenu,
    setShowFilterPanel,
    
    // Handlers
    handleDeleteUser,
    handleActivateUser,
    handleDeactivateUser,
    fetchUsers,
    showAlert
  };
};