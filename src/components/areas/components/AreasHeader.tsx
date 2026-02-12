'use client';

import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AreasHeaderProps {
  onBack: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const AreasHeader = ({
  onBack,
  onRefresh,
  isRefreshing
}: AreasHeaderProps) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-10 w-10 rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md dark:bg-slate-800/80 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Pilih Area
          </h1>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
            Pilih area untuk melihat daftar restoran BTN
          </p>
        </div>
      </div>

      <Button
        onClick={onRefresh}
        disabled={isRefreshing}
        variant="outline"
        size="sm"
        className="rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md dark:bg-slate-800/80 dark:hover:bg-slate-800"
      >
        <RefreshCw
          className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
        />
        <span className="ml-2 hidden sm:inline">Refresh</span>
      </Button>
    </div>
  );
};
