'use client';

import { CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  isSubmitting: boolean;
  isCancelling: boolean;
  isPaymentActive: boolean;
  hasProofImage: boolean;
  onSubmit: () => void;
  onBack: () => void;
  onCancel: () => void;
}

export const ActionButtons = ({
  isSubmitting,
  isCancelling,
  isPaymentActive,
  hasProofImage,
  onSubmit,
  onBack,
  onCancel
}: ActionButtonsProps) => {
  return (
    <div className="space-y-3">
      <Button
        onClick={onSubmit}
        disabled={isSubmitting || !hasProofImage || !isPaymentActive}
        className="w-full bg-emerald-600 py-2 text-sm font-semibold hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:py-3 sm:text-base"
      >
        {isSubmitting ? (
          <>
            <span className="mr-2 animate-spin">⏳</span>{' '}
            Mengunggah...
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />{' '}
            Konfirmasi
          </>
        )}
      </Button>

      <Button
        variant="outline"
        onClick={onBack}
        disabled={isSubmitting}
        className="w-full text-sm sm:text-base"
      >
        Kembali
      </Button>

      <Button
        variant="destructive"
        onClick={onCancel}
        disabled={isSubmitting || isCancelling}
        className="w-full text-sm sm:text-base"
      >
        <Trash2 className="mr-2 h-4 w-4" /> Batalkan Pesanan
      </Button>
    </div>
  );
};
