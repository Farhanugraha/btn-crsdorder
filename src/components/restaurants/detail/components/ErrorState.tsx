'use client';

import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <div className="rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-slate-800 sm:p-12">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
          Oops! Terjadi Kesalahan
        </h2>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          {error || 'Restoran tidak ditemukan'}
        </p>
        <Link href="/areas">
          <Button
            size="lg"
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </Link>
      </div>
    </div>
  );
};
