'use client';

import { MessageSquare } from 'lucide-react';
import type { QuickTip } from '@/types/contact';

const quickTips: QuickTip[] = [
  {
    color: 'blue',
    icon: '📱',
    title: 'Gunakan Browser Terbaru',
    description:
      'Pastikan browser Anda sudah update untuk performa optimal'
  },
  {
    color: 'green',
    icon: '🔄',
    title: 'Clear Cache Secara Rutin',
    description: 'Bersihkan cache browser jika ada masalah loading'
  },
  {
    color: 'amber',
    icon: '⚡',
    title: 'Cek Koneksi Internet',
    description: 'Pastikan koneksi stabil sebelum melakukan transaksi'
  },
  {
    color: 'purple',
    icon: '📸',
    title: 'Screenshot Error',
    description: 'Screenshot error untuk memudahkan troubleshooting'
  }
];

export const QuickTips = () => {
  return (
    <div className="rounded-xl border bg-white p-6 dark:bg-gray-900">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-xl font-bold">Tips Cepat</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Saran untuk pengalaman lebih baik
        </p>
      </div>

      <div className="space-y-4">
        {quickTips.map((tip, index) => (
          <div
            key={index}
            className={`rounded-lg bg-${tip.color}-50 p-4 dark:bg-${tip.color}-950/30`}
          >
            <h4
              className={`font-semibold text-${tip.color}-700 dark:text-${tip.color}-400`}
            >
              {tip.icon} {tip.title}
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">
              {tip.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
