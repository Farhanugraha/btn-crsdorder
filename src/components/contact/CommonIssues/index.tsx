'use client';

import { HelpCircle } from 'lucide-react';

const commonIssues = [
  'Kesalahan login atau autentikasi',
  'Kendala saat melakukan pemesanan',
  'Masalah pembayaran atau invoice',
  'Lupa password atau reset akun',
  'Permintaan menu atau restoran baru',
  'Laporan bug atau kendala teknis'
];

export const CommonIssues = () => {
  return (
    <div className="rounded-xl border bg-white p-6 dark:bg-gray-900">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          <h2 className="text-xl font-bold">Masalah Umum</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Beberapa kendala yang sering dilaporkan
        </p>
      </div>

      <div className="space-y-3">
        {commonIssues.map((issue, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {index + 1}
            </span>
            <span className="text-sm">{issue}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
