'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface EditNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  onSave: () => void;
  isUpdating: boolean;
}

export const EditNotesDialog = ({
  open,
  onOpenChange,
  notes,
  onNotesChange,
  onSave,
  isUpdating
}: EditNotesDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Edit Catatan Item
          </DialogTitle>
          <DialogDescription className="text-base text-slate-600 dark:text-slate-400">
            Ubah catatan untuk pesanan ini
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <textarea
            placeholder="Contoh: Pedas, Tidak pakai sambal, Extra, dll..."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="min-h-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-emerald-400"
            maxLength={200}
          />
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {notes.length} / 200 karakter
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              onNotesChange('');
            }}
            disabled={isUpdating}
            className="rounded-lg border-slate-300 dark:border-slate-600"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={onSave}
            disabled={isUpdating}
            className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {isUpdating ? '⏳ Menyimpan...' : '✓ Simpan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
