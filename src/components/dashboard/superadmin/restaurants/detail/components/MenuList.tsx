'use client';

import {
  ChefHat,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { MenuItem } from './MenuItem';
import { MenuListSkeleton } from './skeleton/MenuListSkeleton';
import type { Menu } from '../types';

interface MenuListProps {
  menus: Menu[];
  isLoading: boolean;
  filterStatus: string;
  togglingId: number | null;
  totalMenus: number;
  onEdit: (menu: Menu) => void;
  onToggleAvailability: (id: number, currentStatus: boolean) => void;
  onDelete: (id: number) => void;
  onAddFirst: () => void;
  formatCurrency: (price: number) => string;
  getImageSrc: (image: string | null) => string;

  // Pagination props
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;
}

export const MenuList = ({
  menus,
  isLoading,
  filterStatus,
  togglingId,
  totalMenus,
  onEdit,
  onToggleAvailability,
  onDelete,
  onAddFirst,
  formatCurrency,
  getImageSrc,

  // Pagination props
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}: MenuListProps) => {
  const isFiltered = filterStatus !== 'all';

  const scrollToTop = () => {
    setTimeout(() => {
      document.getElementById('menu-list-top')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      scrollToTop();
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      scrollToTop();
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
    scrollToTop();
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(
      totalPages,
      startPage + maxVisiblePages - 1
    );

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageClick(1)}
          className="min-w-[2rem] rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span
            key="start-ellipsis"
            className="px-2 text-slate-400 dark:text-slate-500"
          >
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`min-w-[2rem] rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            currentPage === i
              ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
          aria-current={currentPage === i ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span
            key="end-ellipsis"
            className="px-2 text-slate-400 dark:text-slate-500"
          >
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageClick(totalPages)}
          className="min-w-[2rem] rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  // Tampilkan skeleton saat loading
  if (isLoading) {
    return <MenuListSkeleton count={itemsPerPage} />;
  }

  // Tampilkan empty state jika tidak ada menu
  if (menus.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12">
        <ChefHat className="mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          {filterStatus === 'available'
            ? 'Tidak ada menu tersedia'
            : filterStatus === 'unavailable'
              ? 'Tidak ada menu tidak tersedia'
              : 'Menu Kosong'}
        </h3>
        <p className="mt-1 text-center text-xs text-slate-600 dark:text-slate-400">
          {!isFiltered && totalMenus === 0
            ? 'Tambahkan menu pertama untuk memulai'
            : 'Tidak ada menu untuk filter atau halaman ini'}
        </p>

        {/* Tombol tambah hanya muncul jika tidak filter dan memang belum ada menu */}
        {!isFiltered && totalMenus === 0 && (
          <button
            onClick={onAddFirst}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            <Plus className="h-4 w-4" />
            Tambah Menu Pertama
          </button>
        )}

        {/* Tombol kembali ke halaman 1 jika ada data tapi halaman ini kosong */}
        {totalMenus > 0 && currentPage > 1 && (
          <button
            onClick={() => onPageChange(1)}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Kembali ke halaman pertama
          </button>
        )}
      </div>
    );
  }

  // Hitung range menu yang ditampilkan
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalMenus);

  return (
    <div className="space-y-4">
      {/* Anchor for scroll */}
      <div id="menu-list-top" className="scroll-mt-24" />

      {/* Info range menu */}
      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
        <p>
          Menampilkan {startItem} - {endItem} dari {totalMenus} menu
        </p>
        {isFiltered && (
          <p className="text-xs">
            Filter:{' '}
            {filterStatus === 'available'
              ? 'Tersedia'
              : 'Tidak Tersedia'}
          </p>
        )}
      </div>

      {/* Menu Items */}
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {menus.map((menu) => (
          <MenuItem
            key={menu.id}
            menu={menu}
            isToggling={togglingId === menu.id}
            onEdit={onEdit}
            onToggleAvailability={onToggleAvailability}
            onDelete={onDelete}
            formatCurrency={formatCurrency}
            getImageSrc={getImageSrc}
          />
        ))}
      </div>

      {/* Pagination Controls - muncul jika totalPages > 1 */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-4 dark:border-slate-700 sm:flex-row">
          {/* Items per page selector */}
          {onItemsPerPageChange && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Tampilkan:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  onItemsPerPageChange(Number(e.target.value));
                  setTimeout(() => {
                    document
                      .getElementById('menu-list-top')
                      ?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      });
                  }, 100);
                }}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                aria-label="Jumlah item per halaman"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                item
              </span>
            </div>
          )}

          {/* Page info */}
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Halaman {currentPage} dari {totalPages}
          </div>

          {/* Pagination buttons */}
          <nav
            className="flex items-center gap-1"
            aria-label="Pagination"
          >
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`rounded-lg p-2 transition-colors ${
                currentPage === 1
                  ? 'cursor-not-allowed text-slate-300 dark:text-slate-600'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
              aria-label="Halaman sebelumnya"
              aria-disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {renderPageNumbers()}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`rounded-lg p-2 transition-colors ${
                currentPage === totalPages
                  ? 'cursor-not-allowed text-slate-300 dark:text-slate-600'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
              aria-label="Halaman berikutnya"
              aria-disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      )}

      {totalPages === 1 && totalMenus > itemsPerPage && (
        <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>
            Menampilkan semua {totalMenus} menu
            {onItemsPerPageChange && (
              <button
                onClick={() => onItemsPerPageChange(5)}
                className="ml-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Tampilkan lebih sedikit
              </button>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
