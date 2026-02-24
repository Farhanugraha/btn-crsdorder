'use client';

import { QrCode, Upload, Loader2, Trash2 } from 'lucide-react';
import type { PaymentFormData } from '../types';

interface Props {
  formData: PaymentFormData;
  imagePreview: string | null;
  isUploading: boolean;
  settings: any;
  onToggle: (field: keyof PaymentFormData) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteClick: () => void;
}

export default function QRISCard({
  formData,
  imagePreview,
  isUploading,
  settings,
  onToggle,
  onInputChange,
  onImageUpload,
  onDeleteClick
}: Props) {
  return (
    <div className="lg:col-span-2">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
        <div className="relative border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white px-4 py-5 dark:border-slate-700 dark:from-slate-800/50 dark:to-slate-900 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-green-500/20 blur-sm dark:bg-green-500/10"></div>
              <div className="relative rounded-xl bg-green-600 p-2.5 shadow-lg shadow-green-200 dark:bg-green-600 dark:shadow-none">
                <QrCode className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                QRIS Settings
              </h2>
              <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                Atur metode pembayaran QRIS
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-4 sm:p-6">
          {/* Status Toggle */}
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div
                className={`h-2 w-2 rounded-full ${
                  formData.qris_active
                    ? 'animate-pulse bg-green-500'
                    : 'bg-red-500'
                }`}
              ></div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Aktifkan QRIS
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formData.qris_active
                    ? 'QRIS aktif untuk pembayaran'
                    : 'QRIS dinonaktifkan'}
                </p>
                {settings &&
                  formData.qris_active !== settings.qris_active && (
                    <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                      Status akan diubah
                    </div>
                  )}
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={formData.qris_active}
                onChange={() => onToggle('qris_active')}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-slate-700 dark:after:border-slate-600"></div>
            </label>
          </div>

          {/* QRIS Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Judul QRIS
            </label>
            <input
              type="text"
              name="qris_title"
              value={formData.qris_title}
              onChange={onInputChange}
              placeholder="Contoh: QRIS BTN Food"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
            />
            {settings &&
              formData.qris_title !== settings.qris_title && (
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  Judul akan diubah dari "{settings.qris_title}" ke "
                  {formData.qris_title}"
                </div>
              )}
          </div>

          {/* QRIS Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Gambar QR Code
            </label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                  <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <div className="flex-shrink-0">
                      <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-slate-300 dark:border-slate-600">
                        <img
                          src={imagePreview}
                          alt="QRIS Preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              '/qris-placeholder.png';
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Gambar QRIS Saat Ini
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Gambar akan ditampilkan di halaman checkout
                      </p>
                      <button
                        type="button"
                        onClick={onDeleteClick}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus Gambar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="relative">
                <input
                  type="file"
                  id="qrisImage"
                  accept="image/*"
                  onChange={onImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <label
                  htmlFor="qrisImage"
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 transition-colors hover:border-blue-500 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 ${
                    isUploading ? 'opacity-50' : ''
                  }`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mb-2 h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Mengunggah...
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="mb-2 h-8 w-8 text-slate-400" />
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Klik untuk upload gambar QR Code
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                        Format: JPG, PNG, GIF • Maks: 2MB
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
