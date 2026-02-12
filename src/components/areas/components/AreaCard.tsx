'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAreaIcon } from '../utils/areaUtils';
import { itemVariants } from '../utils/areaUtils';
import type { Area } from '../types';

interface AreaCardProps {
  area: Area;
}

export const AreaCard = ({ area }: AreaCardProps) => {
  return (
    <motion.div
      variants={itemVariants}
      layout
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/areas/${area.id}`}>
        <div
          className={cn(
            'group relative h-full cursor-pointer overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all duration-300',
            'border-slate-200 hover:border-emerald-300 hover:shadow-lg',
            'dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-600',
            area.featured &&
              'border-emerald-200 dark:border-emerald-700'
          )}
        >
          {/* Featured Badge - For ALL areas with restaurants */}
          {area.featured && area.restaurants_count > 0 && (
            <div className="absolute -right-8 top-4 rotate-45 bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-1 text-xs font-bold text-white shadow-lg">
              TERSEDIA
            </div>
          )}

          {/* Icon */}
          <div className="mb-4 flex justify-center">
            <div
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-md',
                area.restaurants_count > 0
                  ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/10'
                  : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700'
              )}
            >
              {getAreaIcon(area.icon, area.name)}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                {area.name}
              </h3>
              {area.description && (
                <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                  {area.description}
                </p>
              )}
            </div>

            {/* Restaurant Count */}
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-1.5',
                  area.restaurants_count > 0
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                    : 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                )}
              >
                <ChefHat className="h-3 w-3" />
                <span className="text-sm font-medium">
                  {area.restaurants_count} Restoran
                </span>
              </div>

              {/* Arrow Indicator */}
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300',
                  area.restaurants_count > 0
                    ? 'bg-emerald-50 group-hover:bg-emerald-100 dark:bg-emerald-900/20 dark:group-hover:bg-emerald-900/30'
                    : 'bg-slate-50 dark:bg-slate-800'
                )}
              >
                <div
                  className={cn(
                    'h-2 w-2 rotate-45 transform border-b-2 border-r-2',
                    area.restaurants_count > 0
                      ? 'border-emerald-600 dark:border-emerald-400'
                      : 'border-slate-400 dark:border-slate-500'
                  )}
                ></div>
              </div>
            </div>

            {/* Status Indicator */}
            <div
              className={cn(
                'rounded-lg px-3 py-2 text-center text-xs font-medium',
                area.restaurants_count > 0
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              )}
            >
              {area.restaurants_count > 0
                ? 'Restoran tersedia'
                : 'Belum ada restoran'}
            </div>
          </div>

          {/* Hover Effect Line */}
          <div
            className={cn(
              'absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full',
              area.restaurants_count > 0
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                : 'bg-gradient-to-r from-slate-400 to-slate-500'
            )}
          ></div>
        </div>
      </Link>
    </motion.div>
  );
};
