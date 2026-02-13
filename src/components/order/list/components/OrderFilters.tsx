'use client';

import { useState } from 'react';
import {
  Filter,
  Search,
  Calendar,
  ChevronUp,
  ChevronDown,
  FilterX
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import {
  SORT_OPTIONS,
  DATE_FILTERS,
  MAX_PRICE,
  PRICE_STEP
} from '../constants/orderConstants';
import type { SortBy, DateFilter } from '../types';

interface OrderFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: SortBy;
  onSortChange: (value: SortBy) => void;
  dateFilter: DateFilter;
  onDateFilterChange: (value: DateFilter) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  showAdvancedFilters: boolean;
  onToggleAdvancedFilters: () => void;
  onReset: () => void;
}

export const OrderFilter = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  dateFilter,
  onDateFilterChange,
  priceRange,
  onPriceRangeChange,
  showAdvancedFilters,
  onToggleAdvancedFilters,
  onReset
}: OrderFilterProps) => {
  return (
    <div className="sticky top-6 rounded-xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
          <Filter className="h-5 w-5" />
          Filter & Sort
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-sm"
        >
          <FilterX className="mr-1 h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          <Search className="mr-2 inline h-4 w-4" />
          Cari Pesanan
        </label>
        <Input
          placeholder="Cari kode pesanan..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-slate-300 dark:border-slate-700"
        />
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Urutkan Berdasarkan
        </label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="border-slate-300 dark:border-slate-700">
            <SelectValue placeholder="Pilih urutan" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          <Calendar className="mr-2 inline h-4 w-4" />
          Periode Waktu
        </label>
        <Select value={dateFilter} onValueChange={onDateFilterChange}>
          <SelectTrigger className="border-slate-300 dark:border-slate-700">
            <SelectValue placeholder="Semua waktu" />
          </SelectTrigger>
          <SelectContent>
            {DATE_FILTERS.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <button
          onClick={onToggleAdvancedFilters}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <span>Filter Lanjutan</span>
          {showAdvancedFilters ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Rentang Harga
              </label>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>
                    Rp {priceRange[0].toLocaleString('id-ID')}
                  </span>
                  <span>
                    Rp {priceRange[1].toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="h-1 w-full rounded-full bg-slate-300 dark:bg-slate-700"></div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={MAX_PRICE}
                    step={PRICE_STEP}
                    value={priceRange[0]}
                    onChange={(e) =>
                      onPriceRangeChange([
                        parseInt(e.target.value),
                        priceRange[1]
                      ])
                    }
                    className="absolute h-1 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-lg"
                  />
                  <input
                    type="range"
                    min="0"
                    max={MAX_PRICE}
                    step={PRICE_STEP}
                    value={priceRange[1]}
                    onChange={(e) =>
                      onPriceRangeChange([
                        priceRange[0],
                        parseInt(e.target.value)
                      ])
                    }
                    className="absolute h-1 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-lg"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
