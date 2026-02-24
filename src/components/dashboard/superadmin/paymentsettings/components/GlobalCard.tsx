'use client';

import { CreditCard } from 'lucide-react';
import type { PaymentFormData } from '../types';

interface Props {
  formData: PaymentFormData;
  settings: any;
  onToggle: (field: keyof PaymentFormData) => void;
}

export default function GlobalCard({
  formData,
  settings,
  onToggle
}: Props) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
      <div className="relative border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white px-4 py-5 dark:border-slate-700 dark:from-slate-800/50 dark:to-slate-900 sm:px-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-purple-500/20 blur-sm dark:bg-purple-500/10"></div>
            <div className="relative rounded-xl bg-purple-600 p-2.5 shadow-lg shadow-purple-200 dark:bg-purple-600 dark:shadow-none">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              Pengaturan Global
            </h2>
            <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              Atur sistem pembayaran keseluruhan
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div
              className={`h-2 w-2 rounded-full ${
                formData.active
                  ? 'animate-pulse bg-green-500'
                  : 'bg-red-500'
              }`}
            ></div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Sistem Pembayaran Aktif
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formData.active
                  ? 'Semua pembayaran aktif'
                  : 'Sistem pembayaran dinonaktifkan'}
              </p>
              {settings && formData.active !== settings.active && (
                <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                  Status sistem akan diubah
                </div>
              )}
            </div>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={() => onToggle('active')}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-slate-700 dark:after:border-slate-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
