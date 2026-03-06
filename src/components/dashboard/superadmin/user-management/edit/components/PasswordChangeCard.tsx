'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2, Check, X, Shield } from 'lucide-react';
import type { PasswordData } from '../types';

interface PasswordChangeCardProps {
  passwordData: PasswordData;
  showPassword: boolean;
  updating: boolean;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleShowPassword: () => void;
  onSubmit: () => void;
}

const PASSWORD_REQUIREMENTS = [
  'Minimal 6 karakter',
  'Minimal 1 huruf BESAR (A-Z)',
  'Minimal 1 huruf kecil (a-z)',
  'Minimal 1 angka (0-9)',
  'Minimal 1 simbol (@$!%*?&)'
] as const;

export const PasswordChangeCard = ({
  passwordData,
  showPassword,
  updating,
  onPasswordChange,
  onToggleShowPassword,
  onSubmit
}: PasswordChangeCardProps) => {
  const [passwordStrength, setPasswordStrength] = useState(0);

  const password = passwordData.password || '';
  const confirmPassword = passwordData.password_confirmation || '';

  // Validasi individual
  const hasMinLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[@$!%*?&]/.test(password);

  const isPasswordValid =
    hasMinLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSymbol;
  const isPasswordMatch =
    password && confirmPassword && password === confirmPassword;
  const isFormFilled = password && confirmPassword;

  // Calculate password strength
  useEffect(() => {
    if (password) {
      let strength = 0;
      if (hasMinLength) strength += 20;
      if (hasUpperCase) strength += 20;
      if (hasLowerCase) strength += 20;
      if (hasNumber) strength += 20;
      if (hasSymbol) strength += 20;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [
    password,
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSymbol
  ]);

  // Check individual requirements
  const checkRequirement = (requirement: string): boolean => {
    if (!password) return false;

    if (requirement.includes('6 karakter')) return hasMinLength;
    if (requirement.includes('BESAR')) return hasUpperCase;
    if (requirement.includes('kecil')) return hasLowerCase;
    if (requirement.includes('angka')) return hasNumber;
    if (requirement.includes('simbol')) return hasSymbol;

    return false;
  };

  // Get strength color
  const getStrengthColor = () => {
    if (passwordStrength <= 20) return 'bg-red-500';
    if (passwordStrength <= 40) return 'bg-orange-500';
    if (passwordStrength <= 60) return 'bg-yellow-500';
    if (passwordStrength <= 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  // Get strength label
  const getStrengthLabel = () => {
    if (passwordStrength <= 20) return 'Sangat Lemah';
    if (passwordStrength <= 40) return 'Lemah';
    if (passwordStrength <= 60) return 'Cukup';
    if (passwordStrength <= 80) return 'Kuat';
    return 'Sangat Kuat';
  };

  // PERBAIKAN: Kondisi disabled yang lebih ketat
  const isSubmitDisabled =
    updating || // Sedang proses update
    !isFormFilled || // Form belum diisi lengkap
    !isPasswordValid || // Password tidak memenuhi semua requirement
    !isPasswordMatch; // Password tidak cocok

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 dark:border-slate-700/70 dark:from-slate-800 dark:to-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
            <Shield className="h-5 w-5" />
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

      <div className="space-y-6 p-6">
        {/* New Password */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Password Baru <span className="text-red-500">*</span>
            </label>
          </div>

          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className={`h-4 w-4 ${
                  password
                    ? isPasswordValid
                      ? 'text-emerald-500'
                      : 'text-amber-500'
                    : 'text-slate-400 group-focus-within:text-blue-500'
                }`}
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
              className={`block w-full rounded-lg border py-3 pl-10 pr-10 text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
                password
                  ? isPasswordValid
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-100'
                    : 'border-amber-300 bg-amber-50 text-amber-900 focus:border-amber-500 focus:ring-amber-500 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-100'
                  : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
              }`}
              placeholder="Masukkan password baru"
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

          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-3 space-y-2">
              <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className={`${getStrengthColor()} transition-all duration-300`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Kekuatan Password:
                </p>
                <p
                  className={`text-xs font-medium ${
                    passwordStrength <= 40
                      ? 'text-red-600 dark:text-red-400'
                      : passwordStrength <= 60
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-green-600 dark:text-green-400'
                  }`}
                >
                  {getStrengthLabel()}
                </p>
              </div>
            </div>
          )}

          {/* Password Requirements Checklist */}
          {password && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
              <p className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                Password harus memenuhi:
              </p>
              <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {PASSWORD_REQUIREMENTS.map((req, index) => {
                  const isValid = checkRequirement(req);
                  return (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                          isValid
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-slate-200 text-slate-400 dark:bg-slate-700'
                        }`}
                      >
                        {isValid ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                      </span>
                      <span
                        className={
                          isValid
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }
                      >
                        {req}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="password_confirmation"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Konfirmasi Password{' '}
            <span className="text-red-500">*</span>
          </label>

          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className={`h-4 w-4 ${
                  confirmPassword
                    ? isPasswordMatch
                      ? 'text-emerald-500'
                      : 'text-amber-500'
                    : 'text-slate-400 group-focus-within:text-blue-500'
                }`}
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
              className={`block w-full rounded-lg border py-3 pl-10 pr-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
                confirmPassword
                  ? isPasswordMatch
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-100'
                    : 'border-amber-300 bg-amber-50 text-amber-900 focus:border-amber-500 focus:ring-amber-500 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-100'
                  : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
              }`}
              placeholder="Konfirmasi password baru"
            />
          </div>

          {/* Password Match Indicator */}
          {password && confirmPassword && (
            <div className="mt-2 flex items-center gap-1.5">
              {isPasswordMatch ? (
                <>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Password cocok
                  </span>
                </>
              ) : (
                <>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <X className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                    Password tidak cocok
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed ${
              isSubmitDisabled
                ? 'bg-slate-400 dark:bg-slate-600'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800'
            }`}
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

          {/* PERBAIKAN: Helper Text yang lebih informatif */}
          <div className="mt-3 space-y-1 text-center">
            {!isFormFilled && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                ⚠️ Isi kedua field password untuk melanjutkan
              </p>
            )}

            {isFormFilled && !isPasswordValid && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                  ⚠️ Password belum memenuhi syarat:
                </p>
                <ul className="text-xs text-amber-600 dark:text-amber-400">
                  {!hasMinLength && <li>• Minimal 6 karakter</li>}
                  {!hasUpperCase && <li>• Minimal 1 huruf BESAR</li>}
                  {!hasLowerCase && <li>• Minimal 1 huruf kecil</li>}
                  {!hasNumber && <li>• Minimal 1 angka</li>}
                  {!hasSymbol && (
                    <li>• Minimal 1 simbol (@$!%*?&)</li>
                  )}
                </ul>
              </div>
            )}

            {isFormFilled && isPasswordValid && !isPasswordMatch && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                ⚠️ Password konfirmasi tidak cocok
              </p>
            )}

            {isFormFilled && isPasswordValid && isPasswordMatch && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                ✓ Semua syarat terpenuhi. Klik tombol untuk
                memperbarui password.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
