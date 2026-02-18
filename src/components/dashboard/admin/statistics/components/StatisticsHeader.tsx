'use client';

import { RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatisticsHeaderProps {
  onRefresh: () => void;
  onExport: () => void;
  isRefreshing: boolean;
  isExporting: boolean;
}

export const StatisticsHeader = ({
  onRefresh,
  onExport,
  isRefreshing,
  isExporting
}: StatisticsHeaderProps) => {
  return (
    <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">
            Dashboard Statistik
          </h1>
          <p className="mt-2 opacity-90">
            Pantau performa dan analisis pesanan Anda
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onRefresh}
            disabled={isRefreshing || isExporting}
            variant="outline"
            className="bg-white/10 text-white hover:bg-white/20 disabled:opacity-50"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
            {isRefreshing ? 'Menyegarkan...' : 'Segarkan'}
          </Button>
          <Button
            onClick={onExport}
            disabled={isExporting || isRefreshing}
            variant="outline"
            className="bg-white/10 text-white hover:bg-white/20 disabled:opacity-50"
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? 'Mengekspor...' : 'Ekspor'}
          </Button>
        </div>
      </div>
    </div>
  );
};
