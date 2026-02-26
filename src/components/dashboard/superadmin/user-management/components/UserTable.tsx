import React from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  Building,
  Calendar,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { User } from '../types';
import {
  getRoleColor,
  getRoleLabel,
  getStatusColor,
  formatDate,
  formatPhoneNumber,
  getInitials
} from '../utils/userHelpers';

interface UserTableProps {
  users: User[];
  loading: boolean;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
  onDelete: (id: number) => void;
  showMobileMenu: number | null;
  setShowMobileMenu: (id: number | null) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalUsers: number;
  perPage: number;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  onActivate,
  onDeactivate,
  onDelete,
  showMobileMenu,
  setShowMobileMenu,
  currentPage,
  totalPages,
  onPageChange,
  totalUsers,
  perPage
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Memuat data pengguna...
          </p>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <UserX className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Tidak ada pengguna
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Belum ada pengguna yang terdaftar atau coba sesuaikan
            pencarian Anda.
          </p>
        </div>
      </div>
    );
  }

  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalUsers);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-400">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-400">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-400">
                Kontak
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-400">
                Divisi
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-400">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-400">
                Bergabung
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-400">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white shadow-lg ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ID: {user.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block rounded-full px-3 py-1.5 text-xs font-medium text-white shadow-sm ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {user.email}
                      </span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {formatPhoneNumber(user.phone)}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {user.divisi || '-'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block rounded-full px-3 py-1.5 text-xs font-medium text-white shadow-sm ${
                      user.email_verified_at
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500'
                    }`}
                  >
                    {user.email_verified_at ? 'Aktif' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {formatDate(user.created_at)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/dashboard/user-management/${user.id}`}
                    >
                      <button className="rounded-lg p-2 text-blue-600 transition-all hover:bg-blue-50 group-hover:bg-blue-50 dark:hover:bg-blue-900/30">
                        <Eye className="h-4 w-4" />
                      </button>
                    </Link>
                    <Link
                      href={`/dashboard/user-management/${user.id}/edit`}
                    >
                      <button className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700">
                        <Edit className="h-4 w-4" />
                      </button>
                    </Link>
                    {user.email_verified_at ? (
                      <button
                        onClick={() => onDeactivate(user.id)}
                        className="rounded-lg p-2 text-amber-600 transition-all hover:bg-amber-50 dark:hover:bg-amber-900/30"
                        title="Nonaktifkan"
                      >
                        <UserX className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onActivate(user.id)}
                        className="rounded-lg p-2 text-emerald-600 transition-all hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                        title="Aktifkan"
                      >
                        <UserCheck className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(user.id)}
                      className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50 dark:hover:bg-red-900/30"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 p-4 lg:hidden">
        {users.map((user) => (
          <div
            key={user.id}
            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            {/* Status Indicator */}
            <div
              className={`absolute left-0 top-0 h-full w-1 ${
                user.email_verified_at
                  ? 'bg-emerald-500'
                  : 'bg-amber-500'
              }`}
            />

            <div className="pl-2">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl font-bold text-white shadow-lg ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {user.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setShowMobileMenu(
                      showMobileMenu === user.id ? null : user.id
                    )
                  }
                  className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <MoreVertical className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Role
                  </p>
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium text-white ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {getRoleLabel(user.role)}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Divisi
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {user.divisi || '-'}
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {user.email}
                  </span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {formatPhoneNumber(user.phone)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {formatDate(user.created_at)}
                  </span>
                </div>
              </div>

              {/* Mobile Action Menu */}
              {showMobileMenu === user.id && (
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
                  <Link
                    href={`/dashboard/user-management/${user.id}`}
                  >
                    <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
                      <Eye className="h-4 w-4" />
                      Detail
                    </button>
                  </Link>
                  <Link
                    href={`/dashboard/user-management/${user.id}/edit`}
                  >
                    <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                  </Link>
                  {user.email_verified_at ? (
                    <button
                      onClick={() => onDeactivate(user.id)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-sm font-medium text-amber-600 transition-colors hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400"
                    >
                      <UserX className="h-4 w-4" />
                      Nonaktifkan
                    </button>
                  ) : (
                    <button
                      onClick={() => onActivate(user.id)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
                    >
                      <UserCheck className="h-4 w-4" />
                      Aktifkan
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(user.id)}
                    className="col-span-2 flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus User
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Info */}
      <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Menampilkan{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {startItem}
            </span>
            {' - '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {endItem}
            </span>
            {' dari '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalUsers}
            </span>{' '}
            pengguna
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                Halaman {currentPage} dari {totalPages}
              </span>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
