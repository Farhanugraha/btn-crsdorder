import Link from 'next/link';
import {
  Edit,
  XCircle,
  CheckCircle,
  Trash2,
  ArrowLeft
} from 'lucide-react';

interface QuickActionsProps {
  userId: number;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onDeleteClick: () => void;
}

export const QuickActions = ({
  userId,
  isActive,
  onActivate,
  onDeactivate,
  onDeleteClick
}: QuickActionsProps) => {
  return (
    <div className="space-y-6">
      {/* Desktop Actions */}
      <div className="hidden space-y-3 md:block">
        <Link href={`/dashboard/user-management/${userId}/edit`}>
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">
            <Edit className="h-4 w-4" />
            Edit Pengguna
          </button>
        </Link>

        {isActive ? (
          <button
            onClick={onDeactivate}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-700"
          >
            <XCircle className="h-4 w-4" />
            Nonaktifkan Akun
          </button>
        ) : (
          <button
            onClick={onActivate}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            <CheckCircle className="h-4 w-4" />
            Aktifkan Akun
          </button>
        )}

        <button
          onClick={onDeleteClick}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          <Trash2 className="h-4 w-4" />
          Hapus Pengguna
        </button>
      </div>

      {/* Mobile Back Button */}
      <div className="block md:hidden">
        <Link href="/dashboard/user-management">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar
          </button>
        </Link>
      </div>
    </div>
  );
};
