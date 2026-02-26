'use client';

import { User, Mail, Phone, Shield } from 'lucide-react';
import type { UpdateUserData } from '../types';
import { DivisionInput } from './DivisionInput';

interface UserInfoFormProps {
  formData: UpdateUserData;
  divisionState: {
    isCustomDivisi: boolean;
    customDivisi: string;
  };
  updating: boolean;
  error?: string | null;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onDivisiSelect: (value: string) => void;
  onCustomDivisiChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export const UserInfoForm = ({
  formData,
  divisionState,
  updating,
  error,
  onInputChange,
  onDivisiSelect,
  onCustomDivisiChange
}: UserInfoFormProps) => {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Informasi Pengguna
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Perbarui informasi dasar pengguna
        </p>
      </div>

      <div className="space-y-4 p-5">
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Nama Lengkap *
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <User className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              disabled={updating}
              className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Email *
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              disabled={updating}
              className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="Masukkan email"
              required
            />
          </div>
        </div>

        {/* Phone Field */}
        <div>
          <label
            htmlFor="phone"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Nomor Telepon
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Phone className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              disabled={updating}
              className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="Masukkan nomor telepon"
            />
          </div>
        </div>

        {/* Role Field */}
        <div>
          <label
            htmlFor="role"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Peran (Role) *
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Shield className="h-4 w-4 text-slate-400" />
            </div>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={onInputChange}
              disabled={updating}
              className="block w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              required
            >
              <option value="user">Pengguna</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="h-4 w-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Division Input (untuk user biasa) */}
        {formData.role !== 'admin' && (
          <DivisionInput
            value={formData.divisi}
            isCustomDivisi={divisionState.isCustomDivisi}
            customDivisi={divisionState.customDivisi}
            error={error}
            disabled={updating}
            onDivisiSelect={onDivisiSelect}
            onCustomDivisiChange={onCustomDivisiChange}
          />
        )}
      </div>
    </div>
  );
};
