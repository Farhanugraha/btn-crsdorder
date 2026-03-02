import Link from 'next/link';
import {
  Building,
  Calendar,
  Eye,
  Edit,
  UserX,
  UserCheck,
  Trash2,
  Loader2,
  MoreVertical
} from 'lucide-react';
import type { UserData } from '../types';

// Helper functions (reuse dari UserTable)
const roleLabel = (role: string) => {
  return role === 'superadmin'
    ? 'Super Admin'
    : role === 'admin'
      ? 'Admin'
      : 'Pengguna';
};

const roleStyle = (role: string) => {
  if (role === 'superadmin')
    return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-700/50';
  if (role === 'admin')
    return 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:ring-indigo-700/50';
  return 'bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-700/50 dark:text-slate-300 dark:ring-slate-600/50';
};

const statusStyle = (active: boolean) => {
  return active
    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-700/50'
    : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-700/50';
};

const fmtDate = (s: string | null) => {
  if (!s) return '—';
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(s));
};

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

const avatarPalette = (id: number) => {
  return AVATAR_PALETTES[id % AVATAR_PALETTES.length];
};

interface UserMobileCardsProps {
  users: UserData[];
  processingId: number | null;
  mobileMenuId: number | null;
  onMenuToggle: (id: number | null) => void;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
  onDeleteClick: (id: number) => void;
}

export const UserMobileCards = ({
  users,
  processingId,
  mobileMenuId,
  onMenuToggle,
  onActivate,
  onDeactivate,
  onDeleteClick
}: UserMobileCardsProps) => {
  return (
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
                  onMenuToggle(menuOpen ? null : user.id)
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
                      active ? 'bg-emerald-500' : 'bg-amber-400'
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
                      onClick={() => onDeactivate(user.id)}
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
                      onClick={() => onActivate(user.id)}
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
                    onClick={() => onDeleteClick(user.id)}
                    disabled={busy}
                    className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 disabled:opacity-50 dark:border-red-800/50 dark:bg-red-900/30 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" /> Hapus User
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
