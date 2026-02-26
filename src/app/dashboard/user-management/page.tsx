'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Shield,
  Building,
  CheckCircle,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  Eye,
  Calendar,
  Loader2,
  RefreshCw
} from 'lucide-react';

// ─────────────────────────── TYPES ───────────────────────────────────────────

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'user' | 'admin' | 'superadmin';
  divisi: string | null;
  unit_kerja: string | null;
  email_verified_at: string | null;
  created_at: string;
}

interface AuthInfo {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'superadmin';
  };
}

interface FetchState {
  loading: boolean;
  error: string | null;
}

// ─────────────────────────── HELPERS ─────────────────────────────────────────

function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  if (envUrl.includes('/api')) return envUrl;
  if (envUrl) return `${envUrl}/api`;
  return 'http://localhost:8000/api';
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

// consistent avatar palette per user id
const AVATAR_PALETTES = [
  {
    bg: 'bg-blue-100 dark:bg-blue-900/50',
    text: 'text-blue-700 dark:text-blue-300'
  },
  {
    bg: 'bg-indigo-100 dark:bg-indigo-900/50',
    text: 'text-indigo-700 dark:text-indigo-300'
  },
  {
    bg: 'bg-sky-100 dark:bg-sky-900/50',
    text: 'text-sky-700 dark:text-sky-300'
  },
  {
    bg: 'bg-cyan-100 dark:bg-cyan-900/50',
    text: 'text-cyan-700 dark:text-cyan-300'
  },
  {
    bg: 'bg-violet-100 dark:bg-violet-900/50',
    text: 'text-violet-700 dark:text-violet-300'
  }
];
function avatarPalette(id: number) {
  return AVATAR_PALETTES[id % AVATAR_PALETTES.length];
}

// ─────────────────────────── COMPONENT ───────────────────────────────────────

export default function UserManagement() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [auth, setAuth] = useState<AuthInfo | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [users, setUsers] = useState<UserData[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<
    'all' | 'user' | 'admin' | 'superadmin'
  >('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [fetchState, setFetchState] = useState<FetchState>({
    loading: false,
    error: null
  });
  const [processingId, setProcessingId] = useState<number | null>(
    null
  );
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<
    number | null
  >(null);
  const [mobileMenuId, setMobileMenuId] = useState<number | null>(
    null
  );
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  // ─── INIT ────────────────────────────────────────────────────────────────
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── FETCH ───────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    if (!auth) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setFetchState({ loading: true, error: null });
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        per_page: String(perPage)
      });
      if (searchTerm.trim())
        params.append('search', searchTerm.trim());
      if (filterRole !== 'all') params.append('role', filterRole);

      const res = await fetch(
        `${getApiBaseUrl()}/superadmin/users?${params}`,
        {
          headers: buildHeaders(auth.token),
          signal: controller.signal
        }
      );

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
      if (!json.success)
        throw new Error(json.message ?? 'Gagal mengambil data');

      const rawList: UserData[] = json.data?.data ?? json.data ?? [];
      setUsers(Array.isArray(rawList) ? rawList : []);
      setTotalPages(json.data?.last_page ?? json.last_page ?? 1);
      setTotalUsers(json.data?.total ?? json.total ?? 0);
      setFetchState({ loading: false, error: null });
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      setFetchState({
        loading: false,
        error: err?.message ?? 'Gagal terhubung ke server'
      });
    }
  }, [auth, currentPage, perPage, searchTerm, filterRole, router]);

  useEffect(() => {
    if (mounted && auth) fetchUsers();
    return () => {
      abortRef.current?.abort();
    };
  }, [mounted, auth, currentPage, perPage, searchTerm, filterRole]); // eslint-disable-line

  // ─── TOAST ───────────────────────────────────────────────────────────────
  const toast = {
    success(msg: string) {
      setSuccessMsg(msg);
      setActionError(null);
      setTimeout(() => setSuccessMsg(null), 3500);
    },
    error(msg: string) {
      setActionError(msg);
      setSuccessMsg(null);
      setTimeout(() => setActionError(null), 4000);
    }
  };

  // ─── ACTIONS ─────────────────────────────────────────────────────────────
  async function handleActivate(id: number) {
    if (!auth || processingId !== null) return;
    setProcessingId(id);
    try {
      const res = await fetch(
        `${getApiBaseUrl()}/superadmin/users/${id}/activate`,
        { method: 'POST', headers: buildHeaders(auth.token) }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(json.message ?? 'Gagal mengaktifkan user');
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== id) return u;
          if (json.data && typeof json.data === 'object')
            return json.data as UserData;
          return {
            ...u,
            email_verified_at: new Date().toISOString()
          };
        })
      );
      toast.success('User berhasil diaktifkan');
    } catch (err: any) {
      toast.error(err?.message ?? 'Gagal mengaktifkan user');
    } finally {
      setProcessingId(null);
      setMobileMenuId(null);
    }
  }

  async function handleDeactivate(id: number) {
    if (!auth || processingId !== null) return;
    setProcessingId(id);
    try {
      const res = await fetch(
        `${getApiBaseUrl()}/superadmin/users/${id}/deactivate`,
        { method: 'POST', headers: buildHeaders(auth.token) }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(json.message ?? 'Gagal menonaktifkan user');
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== id) return u;
          if (json.data && typeof json.data === 'object')
            return json.data as UserData;
          return { ...u, email_verified_at: null };
        })
      );
      toast.success('User berhasil dinonaktifkan');
    } catch (err: any) {
      toast.error(err?.message ?? 'Gagal menonaktifkan user');
    } finally {
      setProcessingId(null);
      setMobileMenuId(null);
    }
  }

  async function handleDelete(id: number) {
    if (!auth || processingId !== null) return;
    setProcessingId(id);
    try {
      const res = await fetch(
        `${getApiBaseUrl()}/superadmin/users/${id}`,
        { method: 'DELETE', headers: buildHeaders(auth.token) }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(json.message ?? 'Gagal menghapus user');
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setTotalUsers((prev) => Math.max(0, prev - 1));
      toast.success('User berhasil dihapus');
    } catch (err: any) {
      toast.error(err?.message ?? 'Gagal menghapus user');
    } finally {
      setProcessingId(null);
      setDeleteConfirmId(null);
      setMobileMenuId(null);
    }
  }

  // ─── UI HELPERS ──────────────────────────────────────────────────────────
  function roleLabel(role: string) {
    return role === 'superadmin'
      ? 'Super Admin'
      : role === 'admin'
        ? 'Admin'
        : 'User';
  }
  function roleStyle(role: string) {
    if (role === 'superadmin')
      return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-700/50';
    if (role === 'admin')
      return 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:ring-indigo-700/50';
    return 'bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-700/50 dark:text-slate-300 dark:ring-slate-600/50';
  }
  function statusStyle(active: boolean) {
    return active
      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-700/50'
      : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-700/50';
  }
  function fmtDate(s: string | null) {
    if (!s) return '—';
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(s));
  }
  function paginationPages(): (number | '...')[] {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2)
      return [
        1,
        '...',
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      ];
    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages
    ];
  }

  // ─── RENDER GUARDS ────────────────────────────────────────────────────────
  if (!mounted || !authChecked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm dark:bg-slate-950/90">
        <div className="flex flex-col items-center gap-5">
          <div className="relative h-14 w-14">
            <div className="h-14 w-14 animate-spin rounded-full border-[3px] border-blue-100 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400" />
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Memuat halaman…
          </p>
        </div>
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
        <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white text-center shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="h-1 w-full bg-gradient-to-r from-red-500 to-rose-500" />
          <div className="p-8">
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-100 dark:bg-red-900/20 dark:ring-red-800/40">
                <AlertTriangle className="h-7 w-7 text-red-500" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Autentikasi Diperlukan
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Mengalihkan ke halaman login…
            </p>
          </div>
        </div>
      </div>
    );
  }

  const superadminCount = users.filter(
    (u) => u.role === 'superadmin'
  ).length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const userCount = users.filter((u) => u.role === 'user').length;

  // ─── MAIN RENDER ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* top accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400" />

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto max-w-7xl px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-200 dark:shadow-blue-950">
                <Users className="h-[18px] w-[18px] text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                  Kelola Pengguna
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manajemen akun &amp; hak akses sistem
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchUsers()}
                disabled={fetchState.loading}
                title="Refresh data"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    fetchState.loading ? 'animate-spin' : ''
                  }`}
                />
              </button>
              <button
                onClick={() => setShowFilterPanel((v) => !v)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border shadow-sm transition-all sm:hidden ${
                  showFilterPanel
                    ? 'border-blue-300 bg-blue-50 text-blue-600 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800'
                }`}
              >
                <Filter className="h-4 w-4" />
              </button>
              <Link href="/dashboard/user-management/create">
                <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 text-sm font-semibold text-white shadow-md shadow-blue-200/60 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg active:scale-[.98] dark:shadow-blue-950/50">
                  <Plus className="h-4 w-4" />
                  <span>Tambah User</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        {/* ── TOASTS ──────────────────────────────────────────────────────────── */}
        {successMsg && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 shadow-sm dark:border-emerald-800/50 dark:bg-emerald-950/40">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/60">
              <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              {successMsg}
            </p>
          </div>
        )}
        {(actionError || fetchState.error) && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 shadow-sm dark:border-red-800/50 dark:bg-red-950/40">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/60">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">
              {actionError || fetchState.error}
            </p>
          </div>
        )}

        {/* ── MOBILE FILTER ───────────────────────────────────────────────────── */}
        {showFilterPanel && (
          <div className="mb-5 overflow-hidden rounded-xl border border-blue-200/70 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:hidden">
            <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/80">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Filter &amp; Pencarian
              </p>
            </div>
            <div className="space-y-3 p-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Cari User
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Nama, email…"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Filter Role
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => {
                    setFilterRole(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="all">Semua Role</option>
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <button
                onClick={() => setShowFilterPanel(false)}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-bold text-white hover:from-blue-700 hover:to-indigo-700"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        )}

        {/* ── STAT CARDS ──────────────────────────────────────────────────────── */}
        <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              label: 'Total Pengguna',
              count: totalUsers,
              Icon: Users,
              gradient: 'from-blue-500 to-blue-600',
              iconBg: 'bg-blue-50 dark:bg-blue-900/40',
              iconRing: 'ring-blue-100 dark:ring-blue-800/50',
              iconColor: 'text-blue-600 dark:text-blue-400',
              barFrom: 'from-blue-500',
              barTo: 'to-blue-400'
            },
            {
              label: 'Super Admin',
              count: superadminCount,
              Icon: Shield,
              gradient: 'from-indigo-500 to-indigo-600',
              iconBg: 'bg-indigo-50 dark:bg-indigo-900/40',
              iconRing: 'ring-indigo-100 dark:ring-indigo-800/50',
              iconColor: 'text-indigo-600 dark:text-indigo-400',
              barFrom: 'from-indigo-500',
              barTo: 'to-indigo-400'
            },
            {
              label: 'Admin',
              count: adminCount,
              Icon: UserCheck,
              gradient: 'from-sky-500 to-sky-600',
              iconBg: 'bg-sky-50 dark:bg-sky-900/40',
              iconRing: 'ring-sky-100 dark:ring-sky-800/50',
              iconColor: 'text-sky-600 dark:text-sky-400',
              barFrom: 'from-sky-500',
              barTo: 'to-sky-400'
            },
            {
              label: 'User Biasa',
              count: userCount,
              Icon: User,
              gradient: 'from-slate-400 to-slate-500',
              iconBg: 'bg-slate-100 dark:bg-slate-700/60',
              iconRing: 'ring-slate-200 dark:ring-slate-600/50',
              iconColor: 'text-slate-600 dark:text-slate-300',
              barFrom: 'from-slate-400',
              barTo: 'to-slate-300'
            }
          ].map(
            ({
              label,
              count,
              Icon,
              iconBg,
              iconRing,
              iconColor,
              barFrom,
              barTo
            }) => (
              <div
                key={label}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/80"
              >
                <div
                  className={`h-0.5 w-full bg-gradient-to-r ${barFrom} ${barTo}`}
                />
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {label}
                      </p>
                      <p className="mt-1.5 text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
                        {count}
                      </p>
                    </div>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 transition-transform duration-200 group-hover:scale-110 ${iconBg} ${iconRing}`}
                    >
                      <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* ── TABLE CARD ──────────────────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-800/80">
          {/* toolbar */}
          <div className="border-b border-slate-100 bg-white px-5 py-4 dark:border-slate-700/60 dark:bg-slate-800">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-sm flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari pengguna…"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700/80 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                />
              </div>
              <div className="flex items-center gap-2">
                {/* segmented role filter */}
                <div className="hidden items-center gap-0.5 rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-sm dark:border-slate-600 dark:bg-slate-700/60 sm:flex">
                  {(
                    ['all', 'superadmin', 'admin', 'user'] as const
                  ).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setFilterRole(r);
                        setCurrentPage(1);
                      }}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                        filterRole === r
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                          : 'text-slate-500 hover:bg-white hover:text-slate-700 hover:shadow-sm dark:text-slate-400 dark:hover:bg-slate-600 dark:hover:text-slate-200'
                      }`}
                    >
                      {r === 'all'
                        ? 'Semua'
                        : r === 'superadmin'
                          ? 'Super Admin'
                          : r === 'admin'
                            ? 'Admin'
                            : 'User'}
                    </button>
                  ))}
                </div>
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="hidden h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 sm:block"
                >
                  {[5, 10, 15, 25].map((n) => (
                    <option key={n} value={n}>
                      {n} / hal
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* mobile role pills */}
            <div className="mt-3 flex flex-wrap gap-1.5 sm:hidden">
              {(['all', 'superadmin', 'admin', 'user'] as const).map(
                (r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setFilterRole(r);
                      setCurrentPage(1);
                    }}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                      filterRole === r
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                        : 'border border-slate-200 bg-white text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {r === 'all' ? 'Semua' : roleLabel(r)}
                  </button>
                )
              )}
            </div>
          </div>

          {/* ── LOADING ── */}
          {fetchState.loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-4">
                <div className="h-11 w-11 animate-spin rounded-full border-[3px] border-blue-100 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Memuat data pengguna…
                </p>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700/60">
                  <UserX className="h-8 w-8 text-slate-400" />
                </div>
                <p className="font-semibold text-slate-700 dark:text-white">
                  Tidak ada pengguna
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Coba ubah filter atau kata kunci pencarian
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* ── DESKTOP TABLE ── */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 dark:border-slate-700/60 dark:bg-slate-800/60">
                      {[
                        'Pengguna',
                        'Role',
                        'Divisi',
                        'Status',
                        'Bergabung',
                        ''
                      ].map((h, i) => (
                        <th
                          key={h + i}
                          className={`px-5 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ${
                            i === 5 ? 'text-right' : 'text-left'
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-700/30">
                    {users.map((user) => {
                      const busy = processingId === user.id;
                      const active = !!user.email_verified_at;
                      const pal = avatarPalette(user.id);
                      return (
                        <tr
                          key={user.id}
                          className="group transition-colors duration-150 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
                        >
                          {/* Pengguna */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold shadow-sm ${pal.bg} ${pal.text}`}
                              >
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                                  {user.name}
                                </p>
                                <div className="mt-0.5 flex items-center gap-1.5">
                                  <Mail className="h-3 w-3 shrink-0 text-slate-400" />
                                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                    {user.email}
                                  </p>
                                </div>
                                {user.phone && (
                                  <div className="mt-0.5 flex items-center gap-1.5">
                                    <Phone className="h-3 w-3 shrink-0 text-slate-400" />
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {user.phone}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-block rounded-lg px-2.5 py-1 text-xs font-semibold ${roleStyle(
                                user.role
                              )}`}
                            >
                              {roleLabel(user.role)}
                            </span>
                          </td>

                          {/* Divisi */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <Building className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                              <span className="text-sm text-slate-500 dark:text-slate-400">
                                {user.divisi || '—'}
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyle(
                                active
                              )}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  active
                                    ? 'bg-emerald-500'
                                    : 'bg-amber-400'
                                }`}
                              />
                              {active ? 'Aktif' : 'Pending'}
                            </span>
                          </td>

                          {/* Bergabung */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                              <span className="text-sm text-slate-500 dark:text-slate-400">
                                {fmtDate(user.created_at)}
                              </span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                href={`/dashboard/user-management/${user.id}`}
                              >
                                <button
                                  title="Detail"
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                              </Link>
                              <Link
                                href={`/dashboard/user-management/${user.id}/edit`}
                              >
                                <button
                                  title="Edit"
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                              </Link>
                              {active ? (
                                <button
                                  onClick={() =>
                                    handleDeactivate(user.id)
                                  }
                                  disabled={busy}
                                  title="Nonaktifkan"
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-amber-50 hover:text-amber-600 disabled:opacity-40 dark:hover:bg-amber-900/30 dark:hover:text-amber-400"
                                >
                                  {busy ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <UserX className="h-4 w-4" />
                                  )}
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleActivate(user.id)
                                  }
                                  disabled={busy}
                                  title="Aktifkan"
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-40 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
                                >
                                  {busy ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <UserCheck className="h-4 w-4" />
                                  )}
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  setDeleteConfirmId(user.id)
                                }
                                disabled={busy}
                                title="Hapus"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 disabled:opacity-40 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ── MOBILE CARDS ── */}
              <div className="space-y-3 p-4 lg:hidden">
                {users.map((user) => {
                  const busy = processingId === user.id;
                  const active = !!user.email_verified_at;
                  const menuOpen = mobileMenuId === user.id;
                  const pal = avatarPalette(user.id);
                  return (
                    <div
                      key={user.id}
                      className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-800"
                    >
                      <div className="flex items-start justify-between p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold shadow-sm ${pal.bg} ${pal.text}`}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {user.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setMobileMenuId(menuOpen ? null : user.id)
                          }
                          className={`rounded-lg p-1.5 transition-colors ${
                            menuOpen
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="border-t border-slate-50 px-4 pb-4 dark:border-slate-700/40">
                        <div className="flex flex-wrap gap-2 pt-3">
                          <span
                            className={`inline-block rounded-lg px-2.5 py-1 text-xs font-semibold ${roleStyle(
                              user.role
                            )}`}
                          >
                            {roleLabel(user.role)}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyle(
                              active
                            )}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                active
                                  ? 'bg-emerald-500'
                                  : 'bg-amber-400'
                              }`}
                            />
                            {active ? 'Aktif' : 'Pending'}
                          </span>
                          {user.divisi && (
                            <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-500 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-400">
                              <Building className="h-3 w-3" />
                              {user.divisi}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-500 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-400">
                            <Calendar className="h-3 w-3" />
                            {fmtDate(user.created_at)}
                          </span>
                        </div>
                      </div>

                      {menuOpen && (
                        <div className="border-t border-slate-100 bg-slate-50/80 p-3 dark:border-slate-700/60 dark:bg-slate-800/60">
                          <div className="grid grid-cols-2 gap-2">
                            <Link
                              href={`/dashboard/user-management/${user.id}`}
                              className="col-span-1"
                            >
                              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-2.5 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-100 dark:border-blue-800/50 dark:bg-blue-900/30 dark:text-blue-400">
                                <Eye className="h-4 w-4" /> Detail
                              </button>
                            </Link>
                            <Link
                              href={`/dashboard/user-management/${user.id}/edit`}
                              className="col-span-1"
                            >
                              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                <Edit className="h-4 w-4" /> Edit
                              </button>
                            </Link>
                            {active ? (
                              <button
                                onClick={() =>
                                  handleDeactivate(user.id)
                                }
                                disabled={busy}
                                className="flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 py-2.5 text-sm font-semibold text-amber-700 transition-all hover:bg-amber-100 disabled:opacity-50 dark:border-amber-800/50 dark:bg-amber-900/30 dark:text-amber-400"
                              >
                                {busy ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <UserX className="h-4 w-4" />
                                )}
                                Nonaktifkan
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleActivate(user.id)
                                }
                                disabled={busy}
                                className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-800/50 dark:bg-emerald-900/30 dark:text-emerald-400"
                              >
                                {busy ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <UserCheck className="h-4 w-4" />
                                )}
                                Aktifkan
                              </button>
                            )}
                            <button
                              onClick={() =>
                                setDeleteConfirmId(user.id)
                              }
                              disabled={busy}
                              className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 disabled:opacity-50 dark:border-red-800/50 dark:bg-red-900/30 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" /> Hapus
                              User
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ── PAGINATION ── */}
              {totalPages > 1 && (
                <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 dark:border-slate-700/60 dark:bg-slate-800/40">
                  <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Menampilkan{' '}
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {(currentPage - 1) * perPage + 1}–
                        {Math.min(currentPage * perPage, totalUsers)}
                      </span>{' '}
                      dari{' '}
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {totalUsers}
                      </span>{' '}
                      pengguna
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1 || !!processingId}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">
                          Sebelumnya
                        </span>
                      </button>
                      {paginationPages().map((p, i) =>
                        p === '...' ? (
                          <span
                            key={`d${i}`}
                            className="px-1 text-sm text-slate-400"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() =>
                              setCurrentPage(p as number)
                            }
                            className={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2.5 text-sm font-semibold transition-all ${
                              currentPage === p
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-200/70 dark:shadow-blue-950/50'
                                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                      <button
                        onClick={() =>
                          setCurrentPage((p) =>
                            Math.min(totalPages, p + 1)
                          )
                        }
                        disabled={
                          currentPage === totalPages || !!processingId
                        }
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      >
                        <span className="hidden sm:inline">
                          Selanjutnya
                        </span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ── DELETE MODAL ──────────────────────────────────────────────────────── */}
      {deleteConfirmId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget && !processingId) {
              setDeleteConfirmId(null);
              setMobileMenuId(null);
            }
          }}
        >
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800">
            <div className="h-1 w-full bg-gradient-to-r from-red-500 to-rose-500" />
            <div className="p-6">
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-100 dark:bg-red-900/30 dark:ring-red-800/40">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Hapus Pengguna?
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              </div>
              <p className="rounded-xl bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-600 dark:bg-slate-700/50 dark:text-slate-300">
                Semua data terkait pengguna ini akan dihapus secara
                permanen dari sistem dan tidak dapat dipulihkan.
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  disabled={!!processingId}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 py-2.5 text-sm font-bold text-white shadow-md shadow-red-200/60 transition-all hover:from-red-600 hover:to-rose-700 hover:shadow-lg active:scale-[.98] disabled:opacity-50 dark:shadow-red-950/30"
                >
                  {processingId === deleteConfirmId ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />{' '}
                      Menghapus…
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" /> Ya, Hapus
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setDeleteConfirmId(null);
                    setMobileMenuId(null);
                  }}
                  disabled={!!processingId}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
