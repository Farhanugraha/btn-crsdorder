'use client';

import { Shield, Lock } from 'lucide-react';
import type { CreateUserData, PasswordState } from '../types';

interface SecurityFormProps {
  formData: CreateUserData;
  passwordState: PasswordState;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
}

export const SecurityForm = ({
  formData,
  passwordState,
  onInputChange,
  onTogglePassword,
  onToggleConfirmPassword
}: SecurityFormProps) => {
  return (
    <div>
      <h2 className="mb-4 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
        <Shield className="mr-2 inline h-5 w-5 text-blue-600 dark:text-blue-400" />
        Keamanan & Role
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type={passwordState.showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={onInputChange}
              required
              minLength={6}
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              placeholder="Minimal 6 karakter"
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              <Lock className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Konfirmasi Password{' '}
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-4 w-4 text-slate-400" />
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
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              placeholder="Ulangi password"
            />
            <button
              type="button"
              onClick={onToggleConfirmPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              <Lock className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
