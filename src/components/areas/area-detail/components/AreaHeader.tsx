'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Area } from '../types';

interface AreaHeaderProps {
  area: Area;
  restaurantCount: number;
}

export const AreaHeader = ({
  area,
  restaurantCount
}: AreaHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/95 backdrop-blur-md backdrop-saturate-150 dark:border-slate-800/80 dark:bg-slate-900/95">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-3">
          <Link
            href="/areas"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 sm:text-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Kembali ke Area
          </Link>
        </div>

        {/* Area Info */}
        <div className="mb-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2.5">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 sm:h-12 sm:w-12">
                    <span className="text-lg sm:text-xl">
                      {area.icon}
                    </span>
                  </div>
                </div>

                {/* Title and Description */}
                <div className="min-w-0 flex-1">
                  <h1 className="line-clamp-1 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                    {area.name}
                  </h1>
                  {area.description && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                      {area.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Restaurant Count Badge */}
            <div className="flex-shrink-0 pl-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 dark:bg-emerald-900/20">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 sm:text-sm">
                  {restaurantCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
