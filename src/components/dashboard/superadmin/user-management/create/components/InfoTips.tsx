'use client';

import { AlertTriangle } from 'lucide-react';

export const InfoTips = () => {
  return (
    <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
        <div>
          <p className="mb-1 text-sm font-medium text-blue-800 dark:text-blue-300">
            Informasi Penting
          </p>
          <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400"></span>
              <span>Password minimal 6 karakter</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400"></span>
              <span>Email harus unik dan belum terdaftar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400"></span>
              <span>
                Pengguna yang dibuat akan langsung aktif
                (terverifikasi)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400"></span>
              <span>Admin wajib memiliki data access minimal 1</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400"></span>
              <span>
                Data access yang tersedia: CRSD 1, CRSD 2, atau All
                Access (keduanya)
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
