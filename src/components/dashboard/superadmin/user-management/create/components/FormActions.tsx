'use client';

import Link from 'next/link';
import {
  Save,
  Loader2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface FormActionsProps {
  loading: boolean;
  role: string;
  selectedDataTypesLength: number;
  passwordValid: boolean;
  passwordMatch: boolean;
  passwordFilled: boolean;
}

export const FormActions = ({
  loading,
  role,
  selectedDataTypesLength,
  passwordValid,
  passwordMatch,
  passwordFilled
}: FormActionsProps) => {
  const isAdminWithoutData =
    role === 'admin' && selectedDataTypesLength === 0;

  const isPasswordValid = passwordValid && passwordMatch;
  const canSubmit =
    passwordFilled && isPasswordValid && !isAdminWithoutData;

  const isSubmitDisabled = loading || !canSubmit;

  const getErrorMessage = () => {
    if (isAdminWithoutData) {
      return '⚠️ Data access wajib dipilih untuk role admin';
    }
    if (!passwordFilled) {
      return '⚠️ Password harus diisi';
    }
    if (!passwordValid) {
      return '⚠️ Password belum memenuhi syarat keamanan';
    }
    if (!passwordMatch) {
      return '⚠️ Password konfirmasi tidak cocok';
    }
    return null;
  };

  const errorMessage = getErrorMessage();

  return (
    <div className="rounded-b-lg border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50 sm:p-6">
      {errorMessage && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs text-amber-700 dark:text-amber-300">
            {errorMessage}
          </p>
        </div>
      )}

      {!errorMessage &&
        passwordFilled &&
        passwordValid &&
        passwordMatch && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
            <p className="text-xs text-green-700 dark:text-green-300">
              ✓ Semua syarat terpenuhi. Form siap disimpan.
            </p>
          </div>
        )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="order-2 sm:order-1">
          <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
            <span className="text-red-500">*</span> Field wajib diisi
          </p>
        </div>

        <div className="order-1 flex w-full flex-col gap-3 sm:order-2 sm:w-auto sm:flex-row">
          <Link href="/dashboard/user-management" className="w-full">
            <button
              type="button"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Batal
            </button>
          </Link>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed ${
              isSubmitDisabled
                ? 'bg-slate-400 dark:bg-slate-600'
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Simpan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
