'use client';

import { MapPin, X, Save, XCircle, Loader2 } from 'lucide-react';
import { EMOJI_PRESETS } from '../types';
import type { FormData } from '../types';

interface AreaFormProps {
  formData: FormData;
  editingId: number | null;
  isSubmitting: boolean;
  nextOrder: number;
  onFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onIconSelect: (emoji: string) => void;
  onIconCustom: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const AreaForm = ({
  formData,
  editingId,
  isSubmitting,
  nextOrder,
  onFormChange,
  onIconSelect,
  onIconCustom,
  onSubmit,
  onCancel
}: AreaFormProps) => {
  return (
    <div className="lg:w-96 lg:flex-shrink-0">
      <div className="sticky top-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4 dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-600 p-2 text-white">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingId ? 'Edit Area' : 'Area Baru'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Isi detail area Anda
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Icon Selection */}
          <div>
            <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Pilih Icon
            </label>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
              {EMOJI_PRESETS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onIconSelect(emoji)}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 text-2xl transition-all hover:scale-105 ${
                    formData.icon === emoji
                      ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <input
                type="text"
                maxLength={2}
                value={formData.icon}
                onChange={onIconCustom}
                placeholder="Masukkan emoji kustom..."
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-center text-2xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Nama Area
              <span className="ml-1 text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Contoh: Kantin Utama, Area Meeting, dll."
              value={formData.name}
              onChange={onFormChange}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Deskripsi
              <span className="ml-1 text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Jelaskan detail area, fasilitas, atau spesifikasi lainnya..."
              value={formData.description}
              onChange={onFormChange}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* Order Info */}
          {!editingId && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                <span className="font-medium">Urutan:</span>
                <span className="font-bold text-blue-900 dark:text-white">
                  #{nextOrder}
                </span>
                <span className="ml-auto text-xs">Otomatis</span>
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 border-t border-slate-100 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/50">
          <button
            onClick={onCancel}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <XCircle className="h-4 w-4" />
            Batal
          </button>
          <button
            onClick={onSubmit}
            disabled={
              isSubmitting ||
              !formData.name.trim() ||
              !formData.description.trim()
            }
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {editingId ? 'Simpan' : 'Buat Area'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
