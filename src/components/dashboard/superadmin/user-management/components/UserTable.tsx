import Link from 'next/link';
import {
  Mail,
  Phone,
  Building,
  Calendar,
  Eye,
  Edit,
  UserX,
  UserCheck,
  Trash2,
  Loader2
} from 'lucide-react';
import type { UserData } from '../types';

// Helper functions
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

interface UserTableProps {
  users: UserData[];
  processingId: number | null;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
  onDeleteClick: (id: number) => void;
}

export const UserTable = ({
  users,
  processingId,
  onActivate,
  onDeactivate,
  onDeleteClick
}: UserTableProps) => {
  return (
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
                        active ? 'bg-emerald-500' : 'bg-amber-400'
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
                        onClick={() => onDeactivate(user.id)}
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
                        onClick={() => onActivate(user.id)}
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
                      onClick={() => onDeleteClick(user.id)}
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
  );
};
