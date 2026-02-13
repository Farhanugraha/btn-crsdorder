'use client';

import type { PaymentMethod, PaymentSettings } from '../types';

interface PaymentMethodSelectionProps {
  availableMethods: string[];
  paymentSettings: PaymentSettings | null;
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

export const PaymentMethodSelection = ({
  availableMethods,
  paymentSettings,
  selectedMethod,
  onMethodChange
}: PaymentMethodSelectionProps) => {
  if (availableMethods.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
      <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
        Metode Pembayaran
      </h2>

      <div className="space-y-3">
        {availableMethods.includes('qris') &&
          paymentSettings?.qris_active && (
            <label
              className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-slate-200 p-4 transition-all hover:border-emerald-300 dark:border-slate-700 dark:hover:border-emerald-600"
              style={{
                borderColor:
                  selectedMethod === 'qris' ? '#10b981' : undefined
              }}
            >
              <input
                type="radio"
                name="payment"
                value="qris"
                checked={selectedMethod === 'qris'}
                onChange={(e) =>
                  onMethodChange(e.target.value as PaymentMethod)
                }
                className="h-4 w-4 cursor-pointer"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  QRIS -{' '}
                  {paymentSettings?.qris_title || 'QRIS Pembayaran'}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Scan dengan e-wallet Anda
                </p>
              </div>
            </label>
          )}

        {availableMethods.includes('transfer') &&
          paymentSettings?.bank_active && (
            <label
              className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-slate-200 p-4 transition-all hover:border-emerald-300 dark:border-slate-700 dark:hover:border-emerald-600"
              style={{
                borderColor:
                  selectedMethod === 'transfer'
                    ? '#10b981'
                    : undefined
              }}
            >
              <input
                type="radio"
                name="payment"
                value="transfer"
                checked={selectedMethod === 'transfer'}
                onChange={(e) =>
                  onMethodChange(e.target.value as PaymentMethod)
                }
                className="h-4 w-4 cursor-pointer"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Transfer Bank
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Transfer ke rekening bank
                </p>
              </div>
            </label>
          )}
      </div>
    </div>
  );
};
