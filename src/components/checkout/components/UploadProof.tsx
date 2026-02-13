'use client';

import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadProofProps {
  proofImagePreview: string;
  confirmationNotes: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetImage: () => void;
  onNotesChange: (notes: string) => void;
}

export const UploadProof = ({
  proofImagePreview,
  confirmationNotes,
  onImageChange,
  onResetImage,
  onNotesChange
}: UploadProofProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
      <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
        Unggah Bukti Transfer
      </h2>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900 dark:text-white">
            Bukti Transfer <span className="text-red-600">*</span>
          </label>
          <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center dark:border-slate-600 dark:bg-slate-900 sm:p-6">
            {proofImagePreview ? (
              <div className="space-y-3">
                <img
                  src={proofImagePreview}
                  alt="Preview"
                  className="mx-auto max-h-48 rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onResetImage}
                  className="mx-auto"
                >
                  <X className="mr-2 h-4 w-4" /> Hapus
                </Button>
              </div>
            ) : (
              <label className="cursor-pointer space-y-2">
                <Upload className="mx-auto h-8 w-8 text-slate-400" />
                <p className="text-xs font-medium text-slate-900 dark:text-white sm:text-sm">
                  Klik untuk upload atau drag gambar
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  PNG, JPG, JPEG (Max 5MB)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900 dark:text-white">
            Catatan <span className="text-slate-400">(Opsional)</span>
          </label>
          <textarea
            placeholder="Contoh: Sudah transfer jam 10 pagi..."
            value={confirmationNotes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="min-h-20 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-emerald-400"
            maxLength={500}
          />
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {confirmationNotes.length} / 500 karakter
          </p>
        </div>
      </div>
    </div>
  );
};
