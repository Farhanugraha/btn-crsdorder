'use client';

import { Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaymentSettings } from '../types';

interface PaymentDetailsTransferProps {
  paymentSettings: PaymentSettings;
  totalPrice: number;
  copiedText: string;
  onCopy: (text: string, label: string) => void;
}

export const PaymentDetailsTransfer = ({
  paymentSettings,
  totalPrice,
  copiedText,
  onCopy
}: PaymentDetailsTransferProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
        Detail Rekening Bank
      </h3>

      {paymentSettings?.bank_name && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900 sm:p-4">
          <p className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            Nama Bank
          </p>
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-slate-900 dark:text-white sm:text-lg">
              {paymentSettings.bank_name}
            </p>
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                onCopy(paymentSettings.bank_name, 'Bank')
              }
              className="h-8 w-8 flex-shrink-0"
            >
              {copiedText === 'Bank' ? (
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      {paymentSettings?.account_number && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900 sm:p-4">
          <p className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            Nomor Rekening
          </p>
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono font-semibold text-slate-900 dark:text-white sm:text-lg">
              {paymentSettings.account_number}
            </p>
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                onCopy(
                  paymentSettings.account_number,
                  'Nomor Rekening'
                )
              }
              className="h-8 w-8 flex-shrink-0"
            >
              {copiedText === 'Nomor Rekening' ? (
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      {paymentSettings?.account_name && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900 sm:p-4">
          <p className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            Atas Nama
          </p>
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-slate-900 dark:text-white sm:text-lg">
              {paymentSettings.account_name}
            </p>
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                onCopy(paymentSettings.account_name, 'Nama Rekening')
              }
              className="h-8 w-8 flex-shrink-0"
            >
              {copiedText === 'Nama Rekening' ? (
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="flex gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400 sm:h-5 sm:w-5" />
          <p className="text-xs text-blue-800 dark:text-blue-300 sm:text-sm">
            Transfer{' '}
            <strong>Rp {totalPrice.toLocaleString('id-ID')}</strong>{' '}
            ke rekening di atas
          </p>
        </div>
      </div>
    </div>
  );
};
