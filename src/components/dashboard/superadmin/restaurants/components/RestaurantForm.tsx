'use client';

import { X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Area, FormData } from '../types';
import { API_URL } from '../types';

interface RestaurantFormProps {
  formData: FormData;
  areas: Area[];
  editingId: number | null;
  isSubmitting: boolean;
  onFormChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const RestaurantForm = ({
  formData,
  areas,
  editingId,
  isSubmitting,
  onFormChange,
  onPhotoUpload,
  onRemovePhoto,
  onSubmit,
  onCancel
}: RestaurantFormProps) => {
  const selectedArea = areas.find(
    (a) => a.id === Number(formData.area_id)
  );

  return (
    <div className="order-first lg:order-none lg:col-span-1">
      <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-xl border-b border-slate-200 bg-blue-50 px-4 py-4 dark:border-slate-700 dark:bg-blue-900/30 sm:px-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {editingId ? 'Edit Restoran' : 'Tambah Restoran'}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-4 sm:p-6">
          {/* Photo Upload Section */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Foto Restoran{' '}
              <span className="font-normal text-slate-500">
                (Opsional)
              </span>
            </label>
            <div className="relative">
              <input
                type="file"
                id="photoInput"
                accept="image/*"
                onChange={onPhotoUpload}
                className="hidden"
              />
              <label
                htmlFor="photoInput"
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-6 transition-colors hover:border-blue-500 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
              >
                <div className="text-center">
                  <svg
                    className="mx-auto mb-2 h-8 w-8 text-slate-400"
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
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Klik untuk upload foto
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    JPG, PNG, GIF (Max 2MB)
                  </p>
                </div>
              </label>
            </div>

            {/* Photo Preview - New Upload */}
            {formData.photoPreview && (
              <div className="relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                <img
                  src={formData.photoPreview}
                  alt="Preview"
                  className="h-40 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={onRemovePhoto}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white transition-colors hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Photo Preview - Existing Photo */}
            {editingId &&
              !formData.photoPreview &&
              formData.currentPhoto && (
                <div className="relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                  <img
                    src={`${API_URL}/storage/${formData.currentPhoto}`}
                    alt="Current"
                    className="h-40 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/restaurant.png';
                    }}
                  />
                  <button
                    type="button"
                    onClick={onRemovePhoto}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white transition-colors hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
          </div>

          {/* Area Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Pilih Area <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="area_id"
                value={formData.area_id}
                onChange={onFormChange}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              >
                <option value="">-- Pilih Area Restoran --</option>
                {areas && areas.length > 0 ? (
                  areas.map((area) => (
                    <option
                      key={area.id}
                      value={area.id}
                      className="py-2"
                    >
                      {area.icon} {area.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Tidak ada area tersedia</option>
                )}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <svg
                  className="h-5 w-5 text-slate-400 transition-colors dark:text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>
            {!formData.area_id && (
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2.5 dark:bg-amber-900/20">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                  Area harus dipilih sebelum menambah restoran
                </p>
              </div>
            )}
            {formData.area_id && selectedArea && (
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-2.5 dark:bg-blue-900/20">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  Area dipilih:{' '}
                  <span className="font-semibold">
                    {selectedArea.icon} {selectedArea.name}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Nama Restoran <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onFormChange}
              placeholder="Contoh: Warung Makan Santai"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onFormChange}
              placeholder="Jelaskan restoran ini..."
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          {/* Address Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Alamat <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={onFormChange}
              placeholder="Jl. Contoh No. 123"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="sticky bottom-0 flex gap-2 rounded-b-xl border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800 sm:px-6">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting || !formData.area_id}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Simpan...</span>
              </>
            ) : editingId ? (
              'Perbarui'
            ) : (
              'Tambah'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
