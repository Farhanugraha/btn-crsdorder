import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { UserData, AuthInfo, FetchState, FilterRole } from '../types';

function getApiBaseUrl(): string {
  const envUrl = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');
  if (envUrl.endsWith('/api')) return envUrl;
  return `${envUrl}/api`;
}

function buildHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };
}

function readAuth(): AuthInfo | null {
  try {
    const token = localStorage.getItem('auth_token');
    const raw = localStorage.getItem('auth_user');
    if (!token || !raw) return null;
    const user = JSON.parse(raw);
    return { token, user };
  } catch {
    return null;
  }
}

export function useUserManagement() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [auth, setAuth] = useState<AuthInfo | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [users, setUsers] = useState<UserData[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterRole, setFilterRole] = useState<FilterRole>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  const [fetchState, setFetchState] = useState<FetchState>({
    loading: false,
    error: null
  });
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [mobileMenuId, setMobileMenuId] = useState<number | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    const info = readAuth();
    if (!info) {
      setTimeout(() => router.push('/auth/login'), 1500);
    } else if (info.user.role !== 'superadmin') {
      setTimeout(() => router.push('/dashboard'), 1500);
    } else {
      setAuth(info);
    }
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchTerm]);

  const fetchUsers = useCallback(async () => {
    if (!auth) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setFetchState({ loading: true, error: null });
    try {
      const base = getApiBaseUrl();
      const params = new URLSearchParams({
        page: String(currentPage),
        per_page: String(perPage)
      });
      if (debouncedSearch.trim()) params.append('search', debouncedSearch.trim());
      if (filterRole !== 'all') params.append('role', filterRole);

      const res = await fetch(`${base}/superadmin/users?${params}`, {
        headers: buildHeaders(auth.token),
        signal: controller.signal
      });

      if (res.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        router.push('/auth/login');
        return;
      }
      if (res.status === 403) {
        setFetchState({ loading: false, error: 'Akses ditolak.' });
        return;
      }
      if (res.status === 404) {
        setUsers([]);
        setTotalPages(1);
        setTotalUsers(0);
        setFetchState({ loading: false, error: null });
        return;
      }
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.message ?? `HTTP ${res.status}`);
      }

      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? 'Gagal mengambil data');

      const rawList: UserData[] = json.data?.data ?? json.data ?? [];
      setUsers(Array.isArray(rawList) ? rawList : []);
      setTotalPages(json.data?.last_page ?? json.last_page ?? 1);
      setTotalUsers(json.data?.total ?? json.total ?? 0);
      setFetchState({ loading: false, error: null });
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      setFetchState({ loading: false, error: err?.message ?? 'Gagal terhubung ke server' });
    }
  }, [auth, currentPage, perPage, debouncedSearch, filterRole, router]);

  useEffect(() => {
    if (mounted && auth) fetchUsers();
    return () => { abortRef.current?.abort(); };
  }, [mounted, auth, currentPage, perPage, debouncedSearch, filterRole, fetchUsers]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setActionError(null);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const showError = (msg: string) => {
    setActionError(msg);
    setSuccessMsg(null);
    setTimeout(() => setActionError(null), 4000);
  };

  async function handleActivate(id: number) {
    if (!auth || processingId !== null) return;
    setProcessingId(id);
    try {
      const base = getApiBaseUrl();
      const res = await fetch(`${base}/superadmin/users/${id}/activate`, {
        method: 'POST',
        headers: buildHeaders(auth.token)
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message ?? 'Gagal mengaktifkan user');
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== id) return u;
          if (json.data && typeof json.data === 'object') return json.data as UserData;
          return { ...u, email_verified_at: new Date().toISOString() };
        })
      );
      showSuccess('User berhasil diaktifkan');
    } catch (err: any) {
      showError(err?.message ?? 'Gagal mengaktifkan user');
    } finally {
      setProcessingId(null);
      setMobileMenuId(null);
    }
  }

  async function handleDeactivate(id: number) {
    if (!auth || processingId !== null) return;
    setProcessingId(id);
    try {
      const base = getApiBaseUrl();
      const res = await fetch(`${base}/superadmin/users/${id}/deactivate`, {
        method: 'POST',
        headers: buildHeaders(auth.token)
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message ?? 'Gagal menonaktifkan user');
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== id) return u;
          if (json.data && typeof json.data === 'object') return json.data as UserData;
          return { ...u, email_verified_at: null };
        })
      );
      showSuccess('User berhasil dinonaktifkan');
    } catch (err: any) {
      showError(err?.message ?? 'Gagal menonaktifkan user');
    } finally {
      setProcessingId(null);
      setMobileMenuId(null);
    }
  }

  async function handleDelete(id: number) {
    if (!auth || processingId !== null) return;
    setProcessingId(id);
    try {
      const base = getApiBaseUrl();
      const res = await fetch(`${base}/superadmin/users/${id}`, {
        method: 'DELETE',
        headers: buildHeaders(auth.token)
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message ?? 'Gagal menghapus user');
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setTotalUsers((prev) => Math.max(0, prev - 1));
      showSuccess('User berhasil dihapus');
    } catch (err: any) {
      showError(err?.message ?? 'Gagal menghapus user');
    } finally {
      setProcessingId(null);
      setDeleteConfirmId(null);
      setMobileMenuId(null);
    }
  }

  const resetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setFilterRole('all');
    setPerPage(10);
    setCurrentPage(1);
  };

  const superadminCount = users.filter((u) => u.role === 'superadmin').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const userCount = users.filter((u) => u.role === 'user').length;

  return {
    mounted,
    authChecked,
    auth,
    users,
    totalUsers,
    totalPages,
    searchTerm,
    filterRole,
    currentPage,
    perPage,
    showFilters,
    fetchState,
    processingId,
    successMsg,
    actionError,
    deleteConfirmId,
    mobileMenuId,
    superadminCount,
    adminCount,
    userCount,

    setSearchTerm,
    setFilterRole,
    setCurrentPage,
    setPerPage,
    setShowFilters,
    setDeleteConfirmId,
    setMobileMenuId,

    fetchUsers,
    handleActivate,
    handleDeactivate,
    handleDelete,
    resetFilters,
    showSuccess,
    showError
  };
}