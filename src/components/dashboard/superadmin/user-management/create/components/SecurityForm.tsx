'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, EyeOff, Check, X } from 'lucide-react';
import type { CreateUserData, PasswordState } from '../types';

interface SecurityFormProps {
  formData: CreateUserData;
  passwordState: PasswordState;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
}

const PASSWORD_REQUIREMENTS = [
  'Minimal 6 karakter',
  'Minimal 1 huruf BESAR (A-Z)',
  'Minimal 1 huruf kecil (a-z)',
  'Minimal 1 angka (0-9)',
  'Minimal 1 simbol (@$!%*?&)'
] as const;

export const SecurityForm = ({
  formData,
  passwordState,
  onInputChange,
  onTogglePassword,
  onToggleConfirmPassword
}: SecurityFormProps) => {
  const [passwordStrength, setPasswordStrength] = useState(0);

  const password = formData.password || '';
  const confirmPassword = formData.password_confirmation || '';

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

  const checkRequirement = (requirement: string): boolean => {
    if (!password) return false;

    if (requirement.includes('6 karakter')) return hasMinLength;
    if (requirement.includes('BESAR')) return hasUpperCase;
    if (requirement.includes('kecil')) return hasLowerCase;
    if (requirement.includes('angka')) return hasNumber;
    if (requirement.includes('simbol')) return hasSymbol;

    return false;
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 20) return 'bg-red-500';
    if (passwordStrength <= 40) return 'bg-orange-500';
    if (passwordStrength <= 60) return 'bg-yellow-500';
    if (passwordStrength <= 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 20) return 'Sangat Lemah';
    if (passwordStrength <= 40) return 'Lemah';
    if (passwordStrength <= 60) return 'Cukup';
    if (passwordStrength <= 80) return 'Kuat';
    return 'Sangat Kuat';
  };

  return (
    <div>
      <h2 className="mb-4 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
        <Shield className="mr-2 inline h-5 w-5 text-blue-600 dark:text-blue-400" />
        Keamanan & Role
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Password Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Password <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock
                className={`h-4 w-4 ${
                  password
                    ? isPasswordValid
                      ? 'text-green-500'
                      : 'text-amber-500'
                    : 'text-slate-400'
                }`}
              />
            </div>

            <input
              type={passwordState.showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={onInputChange}
              required
              minLength={6}
              className={`w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
                password
                  ? isPasswordValid
                    ? 'border-green-300 bg-green-50 text-green-900 focus:border-green-500 focus:ring-green-500 dark:border-green-700 dark:bg-green-900/20 dark:text-green-100'
                    : 'border-amber-300 bg-amber-50 text-amber-900 focus:border-amber-500 focus:ring-amber-500 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-100'
                  : 'border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white'
              }`}
              placeholder="Minimal 6 karakter"
            />

            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              {passwordState.showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {password && (
            <div className="mt-2 space-y-2">
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

          {password && (
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
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
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
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
                            ? 'text-green-600 dark:text-green-400'
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

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Konfirmasi Password{' '}
            <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock
                className={`h-4 w-4 ${
                  confirmPassword
                    ? isPasswordMatch
                      ? 'text-green-500'
                      : 'text-amber-500'
                    : 'text-slate-400'
                }`}
              />
            </div>

            <input
              type={
                passwordState.showConfirmPassword
                  ? 'text'
                  : 'password'
              }
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={onInputChange}
              required
              minLength={6}
              className={`w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
                confirmPassword
                  ? isPasswordMatch
                    ? 'border-green-300 bg-green-50 text-green-900 focus:border-green-500 focus:ring-green-500 dark:border-green-700 dark:bg-green-900/20 dark:text-green-100'
                    : 'border-amber-300 bg-amber-50 text-amber-900 focus:border-amber-500 focus:ring-amber-500 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-100'
                  : 'border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white'
              }`}
              placeholder="Ulangi password"
            />

            <button
              type="button"
              onClick={onToggleConfirmPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              {passwordState.showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {password && confirmPassword && (
            <div className="mt-2 flex items-center gap-1.5">
              {isPasswordMatch ? (
                <>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
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
      </div>

      {password && confirmPassword && (
        <div className="mt-4 text-center">
          {!isPasswordValid ? (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              ⚠️ Password belum memenuhi semua syarat keamanan
            </p>
          ) : !isPasswordMatch ? (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              ⚠️ Password konfirmasi tidak cocok
            </p>
          ) : (
            <p className="text-xs text-green-600 dark:text-green-400">
              ✓ Semua syarat terpenuhi. Password aman.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
