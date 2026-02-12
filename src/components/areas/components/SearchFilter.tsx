'use client';

import { Search, Filter, ChefHat } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { SortBy } from '../types';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
}

export const SearchFilter = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange
}: SearchFilterProps) => {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500 dark:text-blue-400" />
        <Input
          placeholder="Cari area..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-12 rounded-2xl border-slate-300/80 bg-white/85 pl-12 pr-4 text-base shadow-sm backdrop-blur-sm placeholder:text-slate-500 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700/80 dark:bg-slate-800/85 dark:placeholder:text-slate-400"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
            Urutkan:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant={sortBy === 'restaurants' ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer rounded-full bg-white/80 px-3 py-1.5 text-sm shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md dark:bg-slate-800/80 dark:hover:bg-slate-800',
              sortBy === 'restaurants' &&
                'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/40'
            )}
            onClick={() => onSortChange('restaurants')}
          >
            <ChefHat className="mr-1 h-3 w-3" />
            Banyak Restoran
          </Badge>
          <Badge
            variant={sortBy === 'name' ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer rounded-full bg-white/80 px-3 py-1.5 text-sm shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md dark:bg-slate-800/80 dark:hover:bg-slate-800',
              sortBy === 'name' &&
                'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/40'
            )}
            onClick={() => onSortChange('name')}
          >
            Nama A-Z
          </Badge>
        </div>
      </div>
    </div>
  );
};
