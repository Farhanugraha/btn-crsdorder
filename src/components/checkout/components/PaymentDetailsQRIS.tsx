'use client';

import { AlertCircle } from 'lucide-react';
import type { PaymentSettings } from '../types';

interface PaymentDetailsQRISProps {
  paymentSettings: PaymentSettings;
}

export const PaymentDetailsQRIS = ({
  paymentSettings
}: PaymentDetailsQRISProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
        Scan QRIS - {paymentSettings.qris_title}
      </h3>
      {paymentSettings.qris_image_url ? (
        <>
          <div className="flex flex-col items-center">
            <img
              src={paymentSettings.qris_image_url}
              alt="QRIS Code"
              className="h-48 w-48 rounded-lg border-4 border-slate-200 dark:border-slate-700 sm:h-56 sm:w-56"
              onError={(e) => {
                e.currentTarget.src =
                  'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020126360014ID.CO.QRISDDATA520450075303360610712345678906304F500';
              }}
            />
            <p className="mt-4 text-center text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
              Scan dengan aplikasi e-wallet Anda
            </p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400 sm:h-5 sm:w-5" />
              <p className="text-xs text-blue-800 dark:text-blue-300 sm:text-sm">
                Pastikan Anda sudah melakukan pembayaran sebelum
                menutup aplikasi
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
            <div>
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                QRIS Image Not Available
              </p>
              <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-400">
                Admin belum mengupload gambar QRIS. Silakan pilih
                metode pembayaran lain.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
