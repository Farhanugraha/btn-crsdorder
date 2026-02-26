import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface UserDetail {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'user' | 'admin' | 'superadmin';
  divisi: string | null;
  unit_kerja: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthData {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'superadmin';
  };
}

export interface UserDetailState {
  user: UserDetail | null;
  loading: boolean;
  error: string | null;
  isDeleting: boolean;
  showDeleteConfirm: boolean;
  showMobileMenu: boolean;
  activateLoading: boolean;
  deactivateLoading: boolean;
}

export function useUserDetail(userId: string) {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  
  const [state, setState] = useState<UserDetailState>({
    user: null,
    loading: true,
    error: null,
    isDeleting: false,
    showDeleteConfirm: false,
    showMobileMenu: false,
    activateLoading: false,
    deactivateLoading: false
  });

  const getAuthToken = (): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  const getApiUrl = (): string => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl && envUrl.includes('/api')) return envUrl;
    if (envUrl) return `${envUrl}/api`;
    return 'http://localhost:8000/api';
  };

  useEffect(() => {
    setMounted(true);
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated && userId && mounted) {
      fetchUserDetail();
    }
  }, [isAuthenticated, userId, mounted]);

  const checkAuthentication = useCallback(() => {
    try {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('auth_user');

      if (!token || !userStr) {
        setIsAuthenticated(false);
        setAuthData(null);
        setState(prev => ({
          ...prev,
          error: 'Silakan login terlebih dahulu',
          loading: false
        }));

        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
        return;
      }

      const userData = JSON.parse(userStr);

      if (userData.role !== 'superadmin') {
        setIsAuthenticated(false);
        setAuthData(null);
        setState(prev => ({
          ...prev,
          error: 'Hanya superadmin yang dapat mengakses halaman ini',
          loading: false
        }));

        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
        return;
      }

      setAuthData({
        token,
        user: userData
      });
      setIsAuthenticated(true);
      setState(prev => ({ ...prev, error: null }));
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
      setAuthData(null);
      setState(prev => ({
        ...prev,
        error: 'Terjadi kesalahan pada autentikasi',
        loading: false
      }));

      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    }
  }, [router]);

  const fetchUserDetail = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const token = getAuthToken();

      if (!token) {
        setState(prev => ({
          ...prev,
          error: 'Token tidak ditemukan. Silakan login kembali.',
          loading: false
        }));
        setIsAuthenticated(false);
        setTimeout(() => router.push('/auth/login'), 2000);
        return;
      }

      const apiUrl = getApiUrl();
      const url = `${apiUrl}/superadmin/users/${userId}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Pengguna tidak ditemukan');
        }
        if (response.status === 401) {
          setIsAuthenticated(false);
          setTimeout(() => router.push('/auth/login'), 2000);
          throw new Error('Sesi telah berakhir. Silakan login kembali.');
        }
        if (response.status === 403) {
          throw new Error('Anda tidak memiliki akses ke data ini');
        }
        throw new Error(
          data.message || 'Gagal mengambil detail pengguna'
        );
      }

      if (!data.success) {
        throw new Error(
          data.message || 'Gagal mengambil detail pengguna'
        );
      }

      setState(prev => ({ ...prev, user: data.data, loading: false }));
    } catch (err: any) {
      console.error('Fetch user detail error:', err);
      
      if (err.name === 'AbortError') {
        setState(prev => ({ 
          ...prev, 
          error: 'Permintaan timeout. Silakan coba lagi.',
          loading: false 
        }));
      } else {
        const errorMsg =
          err instanceof Error
            ? err.message
            : 'Terjadi kesalahan saat mengambil data pengguna';
        setState(prev => ({ ...prev, error: errorMsg, loading: false }));
      }
    }
  }, [userId, router]);

  const handleActivateUser = async () => {
    try {
      setState(prev => ({ ...prev, activateLoading: true, error: null }));

      const token = getAuthToken();

      if (!token) {
        setState(prev => ({ 
          ...prev, 
          error: 'Token tidak ditemukan',
          activateLoading: false 
        }));
        return;
      }

      const apiUrl = getApiUrl();
      const url = `${apiUrl}/superadmin/users/${userId}/activate`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Gagal mengaktifkan pengguna'
        );
      }

      await fetchUserDetail();
      setState(prev => ({ ...prev, error: null, activateLoading: false }));
    } catch (err) {
      console.error('Activate user error:', err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Gagal mengaktifkan pengguna';
      setState(prev => ({ 
        ...prev, 
        error: errorMsg,
        activateLoading: false 
      }));
    }
  };

  const handleDeactivateUser = async () => {
    try {
      setState(prev => ({ ...prev, deactivateLoading: true, error: null }));

      const token = getAuthToken();

      if (!token) {
        setState(prev => ({ 
          ...prev, 
          error: 'Token tidak ditemukan',
          deactivateLoading: false 
        }));
        return;
      }

      const apiUrl = getApiUrl();
      const url = `${apiUrl}/superadmin/users/${userId}/deactivate`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Gagal menonaktifkan pengguna'
        );
      }

      await fetchUserDetail();
      setState(prev => ({ ...prev, error: null, deactivateLoading: false }));
    } catch (err) {
      console.error('Deactivate user error:', err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Gagal menonaktifkan pengguna';
      setState(prev => ({ 
        ...prev, 
        error: errorMsg,
        deactivateLoading: false 
      }));
    }
  };

  const handleDeleteUser = async () => {
    try {
      setState(prev => ({ ...prev, isDeleting: true, error: null }));

      const token = getAuthToken();

      if (!token) {
        setState(prev => ({
          ...prev,
          error: 'Token tidak ditemukan',
          isDeleting: false,
          showDeleteConfirm: false
        }));
        return;
      }

      const apiUrl = getApiUrl();
      const url = `${apiUrl}/superadmin/users/${userId}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal menghapus pengguna');
      }

      if (!data.success) {
        throw new Error(data.message || 'Gagal menghapus pengguna');
      }

      router.push('/dashboard/user-management');
      router.refresh();
    } catch (err) {
      console.error('Delete user error:', err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Gagal menghapus pengguna';
      setState(prev => ({
        ...prev,
        error: errorMsg,
        isDeleting: false,
        showDeleteConfirm: false
      }));
    }
  };

  const setShowDeleteConfirm = (show: boolean) => {
    setState(prev => ({ ...prev, showDeleteConfirm: show }));
  };

  const setShowMobileMenu = (show: boolean) => {
    setState(prev => ({ ...prev, showMobileMenu: show }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const refreshUserData = () => {
    if (isAuthenticated && userId) {
      fetchUserDetail();
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return '-';
    }
  };

  const getRoleLabel = (role: string): string => {
    switch (role) {
      case 'superadmin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'user':
        return 'Pengguna';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'superadmin':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
      case 'admin':
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800';
      case 'user':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
    }
  };

  return {
    // State
    mounted,
    isAuthenticated,
    authData,
    state,
    
    // Actions
    handleActivateUser,
    handleDeactivateUser,
    handleDeleteUser,
    setShowDeleteConfirm,
    setShowMobileMenu,
    setError,
    refreshUserData,
    
    // Helper functions
    formatDate,
    getRoleLabel,
    getRoleColor
  };
}