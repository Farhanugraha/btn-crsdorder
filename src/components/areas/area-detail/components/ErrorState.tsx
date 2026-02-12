'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  areaName?: string;
}

export const ErrorState = ({ error, areaName }: ErrorStateProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-slate-800">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
            <span className="text-3xl">😕</span>
          </div>
        </div>
        <p className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
          {areaName ? `Area "${areaName}" tidak ditemukan` : error}
        </p>
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          {error || 'Area mungkin telah dihapus atau tidak tersedia'}
        </p>
        <Link href="/areas">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Areas
          </Button>
        </Link>
      </div>
    </div>
  );
};
