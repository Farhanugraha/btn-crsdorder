'use client';

import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import type { PasswordData } from '../types';

interface PasswordChangeCardProps {
  passwordData: PasswordData;
  showPassword: boolean;
  updating: boolean;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleShowPassword: () => void;
  onSubmit: () => void;
}

export const PasswordChangeCard = ({
  passwordData,
  showPassword,
  updating,
  onPasswordChange,
  onToggleShowPassword,
  onSubmit
}: PasswordChangeCardProps) => {
  const isPasswordMatch =
    passwordData.password &&
    passwordData.password_confirmation &&
    passwordData.password === passwordData.password_confirmation;

  const isPasswordValid =
    passwordData.password && passwordData.password.length >= 6;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-700/70 dark:bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
            <svg
              className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Keamanan Akun
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Atur password baru untuk pengguna
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-6">
        {/* New Password */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Password Baru
            </label>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Minimal 6 karakter
            </span>
          </div>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={passwordData.password}
              onChange={onPasswordChange}
              className="block w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 group-hover:border-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={onToggleShowPassword}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {passwordData.password && !isPasswordValid && (
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
              Password minimal 6 karakter
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="password_confirmation"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Konfirmasi Password
          </label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password_confirmation"
              name="password_confirmation"
              value={passwordData.password_confirmation}
              onChange={onPasswordChange}
              className="block w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 group-hover:border-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          {passwordData.password &&
            passwordData.password_confirmation && (
              <div className="mt-2 flex items-center gap-1">
                {isPasswordMatch ? (
                  <>
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">
                      Password cocok
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                    <span className="text-xs text-amber-600 dark:text-amber-400">
                      Password tidak cocok
                    </span>
                  </>
                )}
              </div>
            )}
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={onSubmit}
            disabled={
              updating ||
              !passwordData.password ||
              !passwordData.password_confirmation ||
              !isPasswordMatch ||
              !isPasswordValid
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Mengubah Password...</span>
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>Perbarui Password</span>
              </>
            )}
          </button>

          {(!passwordData.password ||
            !passwordData.password_confirmation) && (
            <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
              Isi kedua field password untuk mengaktifkan tombol
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
