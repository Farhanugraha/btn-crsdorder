'use client';

import { Building2 } from 'lucide-react';
import type { PaymentFormData } from '../types';

interface Props {
  formData: PaymentFormData;
  settings: any;
  onToggle: (field: keyof PaymentFormData) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BankCard({
  formData,
  settings,
  onToggle,
  onInputChange
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
      <div className="relative border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white px-4 py-5 dark:border-slate-700 dark:from-slate-800/50 dark:to-slate-900 sm:px-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-blue-500/20 blur-sm dark:bg-blue-500/10"></div>
            <div className="relative rounded-xl bg-blue-600 p-2.5 shadow-lg shadow-blue-200 dark:bg-blue-600 dark:shadow-none">
              <Building2 className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              Bank Transfer
            </h2>
            <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              Atur metode transfer bank
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div
              className={`h-2 w-2 rounded-full ${
                formData.bank_active
                  ? 'animate-pulse bg-green-500'
                  : 'bg-red-500'
              }`}
            ></div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Aktifkan Transfer Bank
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formData.bank_active
                  ? 'Transfer bank aktif'
                  : 'Transfer bank dinonaktifkan'}
              </p>
              {settings &&
                formData.bank_active !== settings.bank_active && (
                  <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                    Status akan diubah
                  </div>
                )}
            </div>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={formData.bank_active}
              onChange={() => onToggle('bank_active')}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-slate-700 dark:after:border-slate-600"></div>
          </label>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">
            Nama Bank
          </label>
          <input
            type="text"
            name="bank_name"
            value={formData.bank_name}
            onChange={onInputChange}
            placeholder="Contoh: Bank Tabungan Negara"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
          />
          {settings && formData.bank_name !== settings.bank_name && (
            <div className="text-xs text-blue-600 dark:text-blue-400">
              {settings.bank_name
                ? `Nama bank akan diubah dari "${settings.bank_name}"`
                : 'Nama bank akan ditambahkan'}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">
            Nomor Rekening
          </label>
          <input
            type="text"
            name="account_number"
            value={formData.account_number}
            onChange={onInputChange}
            placeholder="1234567890"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
          />
          {settings &&
            formData.account_number !== settings.account_number && (
              <div className="text-xs text-blue-600 dark:text-blue-400">
                {settings.account_number
                  ? `Nomor rekening akan diubah`
                  : 'Nomor rekening akan ditambahkan'}
              </div>
            )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">
            Nama Pemilik Rekening
          </label>
          <input
            type="text"
            name="account_name"
            value={formData.account_name}
            onChange={onInputChange}
            placeholder="Contoh: CRSD BTN"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
          />
          {settings &&
            formData.account_name !== settings.account_name && (
              <div className="text-xs text-blue-600 dark:text-blue-400">
                {settings.account_name
                  ? `Nama rekening akan diubah dari "${settings.account_name}"`
                  : 'Nama rekening akan ditambahkan'}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
