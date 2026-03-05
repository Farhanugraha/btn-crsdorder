import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';

interface SubmitButtonProps {
  isSubmitting: boolean;
  label?: string;
  loadingLabel?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  label = 'Kirim Link Reset',
  loadingLabel = 'Mengirim...'
}) => {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className="w-full bg-gradient-to-r from-primary to-primary/80 transition-all hover:from-primary/90 hover:to-primary/70"
      size="lg"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  );
};
