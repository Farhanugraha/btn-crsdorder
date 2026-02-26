'use client';

import Link from 'next/link';
import { Edit, XCircle, CheckCircle, Trash2 } from 'lucide-react';

interface MobileMenuProps {
  userId: number;
  isActive: boolean;
  show: boolean;
  onClose: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
  onDeleteClick: () => void;
}

export const MobileMenu = ({
  userId,
  isActive,
  show,
  onClose,
  onActivate,
  onDeactivate,
  onDeleteClick
}: MobileMenuProps) => {
  if (!show) return null;

  const handleEdit = () => {
    onClose();
  };

  const handleActivate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onActivate();
    onClose();
  };

  const handleDeactivate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDeactivate();
    onClose();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteClick();
    onClose();
  };

  return (
    <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
      {/* Edit - menggunakan Link */}
      <Link
        href={`/dashboard/user-management/${userId}/edit`}
        onClick={handleEdit}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
      >
        <Edit className="h-4 w-4" />
        Edit Pengguna
      </Link>

      {/* Divider */}
      <div className="my-1 border-t border-slate-100 dark:border-slate-700"></div>

      {/* Aktifkan/Nonaktifkan - menggunakan button */}
      {isActive ? (
        <button
          type="button"
          onClick={handleDeactivate}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-amber-600 transition-colors hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20"
        >
          <XCircle className="h-4 w-4" />
          Nonaktifkan
        </button>
      ) : (
        <button
          type="button"
          onClick={handleActivate}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
        >
          <CheckCircle className="h-4 w-4" />
          Aktifkan
        </button>
      )}

      {/* Divider */}
      <div className="my-1 border-t border-slate-100 dark:border-slate-700"></div>

      {/* Hapus - menggunakan button */}
      <button
        type="button"
        onClick={handleDelete}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
      >
        <Trash2 className="h-4 w-4" />
        Hapus Pengguna
      </button>
    </div>
  );
};
