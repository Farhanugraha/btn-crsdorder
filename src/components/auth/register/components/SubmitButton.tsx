import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, UserPlus } from 'lucide-react';

interface SubmitButtonProps {
  isSubmitting: boolean;
  label?: string;
  loadingLabel?: string;
  className?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  label = 'Buat Akun',
  loadingLabel = 'Membuat Akun...',
  className = ''
}) => {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className={`w-full bg-gradient-to-r from-primary to-primary/80 transition-all hover:from-primary/90 hover:to-primary/70 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      size="lg"
      aria-label={isSubmitting ? loadingLabel : label}
      aria-busy={isSubmitting}
      suppressHydrationWarning
    >
      {isSubmitting ? (
        <>
          <Loader2
            className="mr-2 h-4 w-4 animate-spin"
            aria-hidden="true"
          />
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </Button>
  );
};
