'use client';

import { User, Mail, Phone } from 'lucide-react';
import type { CreateUserData } from '../types';

interface BasicInfoFormProps {
  formData: CreateUserData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BasicInfoForm = ({
  formData,
  onInputChange
}: BasicInfoFormProps) => {
  return (
    <div>
      <h2 className="mb-4 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
        <User className="mr-2 inline h-5 w-5 text-blue-600 dark:text-blue-400" />
        Informasi Dasar
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <User className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              required
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              placeholder="Masukkan nama lengkap"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              required
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              placeholder="contoh@email.com"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Nomor Telepon
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Phone className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              placeholder="+62 812 3456 7890"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
