'use client';

import { X, Loader2 } from 'lucide-react';
import type { FormData } from '../types';

interface MenuFormProps {
  formData: FormData;
  editingId: number | null;
  isSubmitting: boolean;
  imagePreview: string;
  imageFile: File | null;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageChange: (file: File) => void;
  onRemoveImage: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const MenuForm = ({
  formData,
  editingId,
  isSubmitting,
  imagePreview,
  imageFile,
  onFormChange,
  onImageChange,
  onRemoveImage,
  onSubmit,
  onCancel
}: MenuFormProps) => {
  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = e.target.value;

    const numericValue = rawValue.replace(/[^\d]/g, '');

    if (numericValue === '') {
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          name: 'price',
          value: ''
        }
      };
      onFormChange(newEvent);
      return;
    }

    const intValue = parseInt(numericValue, 10);
    const MAX_PRICE = 999999999;
    const finalValue = intValue > MAX_PRICE ? MAX_PRICE : intValue;

    const newEvent = {
      ...e,
      target: {
        ...e.target,
        name: 'price',
        value: finalValue.toString()
      }
    };

    onFormChange(newEvent);
  };

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 max-h-[calc(100vh-140px)] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-4 dark:border-slate-700 dark:from-blue-900/40 dark:to-blue-900/20 sm:px-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {editingId ? 'Edit Menu' : 'Menu Baru'}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-4 sm:p-6">
          {/* Nama Menu */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
              Nama Menu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Nasi Goreng"
              value={formData.name}
              onChange={onFormChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
            />
          </div>

          {/* Harga */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
              Harga <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Rp
              </span>
              <input
                type="text"
                name="price"
                inputMode="numeric"
                placeholder="35000"
                value={formData.price}
                onChange={handlePriceChange}
                className="flex-1 border-0 bg-transparent text-sm text-slate-900 [appearance:textfield] focus:outline-none dark:text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
            {formData.price &&
              parseInt(formData.price as string) > 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Rp{' '}
                  {parseInt(formData.price as string).toLocaleString(
                    'id-ID'
                  )}
                </p>
              )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
              Gambar Menu{' '}
              <span className="font-normal text-slate-500">
                (Opsional)
              </span>
            </label>

            <div className="relative">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onImageChange(file);
                  }
                }}
                className="hidden"
                id="menu-image-upload"
              />
              <label
                htmlFor="menu-image-upload"
                className="flex cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-300 bg-gradient-to-br from-blue-50 to-slate-50 px-4 py-6 transition-all hover:border-blue-400 hover:bg-blue-50 dark:border-slate-600 dark:from-slate-800 dark:to-slate-800 dark:hover:border-blue-500 dark:hover:bg-slate-700/50"
              >
                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/40">
                  <svg
                    className="h-5 w-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    Klik untuk upload gambar
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    JPG, PNG, JPEG • Maks. 5MB
                  </p>
                </div>
              </label>
            </div>

            {(imagePreview || imageFile) && (
              <div className="rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-full rounded-t-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={onRemoveImage}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white transition-colors hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {imageFile && (
                  <div className="border-t border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800">
                    <p className="truncate text-xs font-medium text-slate-600 dark:text-slate-400">
                      {imageFile.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Checkbox */}
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
            <input
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={onFormChange}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-slate-600"
            />
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              Menu Tersedia
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="sticky bottom-0 flex gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800 sm:px-6">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            disabled={
              isSubmitting ||
              !formData.name.trim() ||
              !formData.price ||
              parseInt(formData.price as string) <= 0
            }
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:hover:bg-blue-800"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Simpan...</span>
              </>
            ) : editingId ? (
              'Update'
            ) : (
              'Tambah'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
