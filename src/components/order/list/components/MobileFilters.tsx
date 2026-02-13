'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Filter,
  Search,
  Calendar,
  ChevronUp,
  ChevronDown,
  FilterX,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  SORT_OPTIONS,
  DATE_FILTERS,
  MAX_PRICE,
  PRICE_STEP
} from '../constants/orderConstants';
import type { SortBy, DateFilter } from '../types';

interface MobileFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: SortBy;
  onSortChange: (value: SortBy) => void;
  dateFilter: DateFilter;
  onDateFilterChange: (value: DateFilter) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  onReset: () => void;
}

export const MobileFilters = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  dateFilter,
  onDateFilterChange,
  priceRange,
  onPriceRangeChange,
  onReset
}: MobileFiltersProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] =
    useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-white p-6 dark:bg-slate-900 lg:hidden"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Filter & Sort</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Search */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              <Search className="mr-2 inline h-4 w-4" />
              Cari Pesanan
            </label>
            <Input
              placeholder="Cari kode pesanan..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Mobile Sort */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Urutkan Berdasarkan
            </label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger>
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

          {/* Mobile Date Filter */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              <Calendar className="mr-2 inline h-4 w-4" />
              Periode Waktu
            </label>
            <Select
              value={dateFilter}
              onValueChange={onDateFilterChange}
            >
              <SelectTrigger>
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

          {/* Mobile Advanced Filters Toggle */}
          <div className="mb-4">
            <button
              onClick={() =>
                setShowAdvancedFilters(!showAdvancedFilters)
              }
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

          {/* Mobile Advanced Filters */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium">
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
                        className="absolute h-1 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500"
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
                        className="absolute h-1 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Reset Button */}
          <Button
            onClick={() => {
              onReset();
              onClose();
            }}
            variant="outline"
            className="w-full"
          >
            <FilterX className="mr-2 h-4 w-4" />
            Reset Filter
          </Button>
        </motion.div>
      </>
    </AnimatePresence>
  );
};
